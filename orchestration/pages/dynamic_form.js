// this together with <html style="display: none"> avoids flash of unstyled content (FOUC)
document.addEventListener('DOMContentLoaded', function () {
  document.getElementsByTagName('html')[0].style.display = 'block';
});

let _actionData = null;
const _fields_output = {};
let _phoneInput = null;
let _submitHandler = null;
let _rejectHandler = null;

export async function enableDynamicForm() {
  return new Promise((resolve, reject) => {
    _submitHandler = resolve;
    _rejectHandler = reject;
  });
}

export function getDynamicFormUI(actionData) {
  _submitHandler = null;
  _rejectHandler = null;

  if (actionData.type != 'dynamic_form') {
    throw 'app data must contain type: "dynamic_form" to use dynamic forms';
  }

  const fields = actionData.actions;

  if (!(fields && Array.isArray(fields))) {
    throw 'Dynamic forms must have a "fields" field with an array value, containing field objects';
  }

  _actionData = actionData;

  const df_div = document.createElement('DIV');
  df_div.id = 'dynamic_form_body';
  df_div.classList.add('column');
  df_div.classList.add('gap');
  df_div.classList.add('hidden');
  df_div.innerHTML = `<div class="column gap">
  <a id="form_title" class="title">Title</a>
  <a id="form_subtitle" class="title sm">Subtitle</a>
  </div>
<button id="ok_button" class="full-width" type="button">OK</button>
<button id="cancel_button" class="full-width hidden"
  type="button">Cancel</button>
<button id="delete_button" class="full-width danger hidden"
  type="button">Delete</button>
  <div class="column gap">
  <div class="row"></div>
  <div
	id="dynamic_form_error"
	style="font-family: Sans-serif; color: red"
	class="column hidden"
  >
	Error
  </div>
</div>`;

  // set form title
  if (actionData.title) {
    df_div.querySelector('#form_title').innerHTML = actionData.title;
    df_div.querySelector('#form_title').display = 'block';
  } else {
    df_div.querySelector('#form_title').display = 'none !important';
  }

  // set form subtitle
  if (actionData.subtitle) {
    df_div.querySelector('#form_subtitle').innerHTML = actionData.subtitle;
    df_div.querySelector('#form_subtitle').display = 'block';
  } else {
    df_div.querySelector('#form_subtitle').display = 'none !important';
  }

  // set form input fields
  fields.forEach((field, index) => {
    if (!(field.type && field.id)) {
      throw 'dynamic form fields must have type and id fields. Where type is one of: text, number, date, password, email, phone.';
    }

    const field_id = field.id;
    if (!field_id.match(/^[0-9a-z_-]+$/i)) {
      throw 'field ids must contain only digits english alphabet, _ and -';
    }

    let new_elem = null;
    switch (field.type) {
      case 'email':
        new_elem = createEmailInput(field);
        break;
      case 'phone':
        new_elem = createPhoneInput(field);
        break;
      case 'text':
        new_elem = createTextInput(field);
        break;
      case 'message':
        new_elem = createMessage(field);
        pushFieldInDiv(new_elem, df_div);
        return;
      case 'decimal':
        new_elem = createDecimalInput(field);
        break;
      case 'numeric':
        new_elem = createNumberInput(field);
        break;
      case 'list':
        new_elem = createDropDownList(field);
        break;
      case 'switch':
        new_elem = createCheckbox(field);
        break;
      default:
        console.log(`Unknown field type provided: ${field.type} - ignoring.`);
    }

    if (!new_elem) return;
    _fields_output[`${index}`] = { type: field.type, id: field.id, value: null };
    pushFieldInDiv(new_elem, df_div);
  });

  // set form buttons
  setButton(df_div.querySelector('#ok_button'), null, () => {
    if (_submitHandler) {
      if (!validateForm()) return;
      const fields_values = collectOutput(_fields_output);
      disableAllButtons();
      _submitHandler({
        option: 'client_input',
        data: { fields: fields_values },
      });
      _submitHandler = _rejectHandler = null;
    }
  });

  setButton(df_div.querySelector('#cancel_button'), null, () => {
    disableAllButtons();
    if (_rejectHandler) _rejectHandler('Cancel button pressed');
    _submitHandler = _rejectHandler = null;
  });

  df_div.querySelector('#dynamic_form_error').classList.add('hidden');
  return df_div;
}

function setButton(btn, text, completion) {
  if (text) {
    btn.value = text;
  }

  // clear all handlers, this handles multiple runs of the same action
  btn.removeEventListener('click', completion);
  btn.addEventListener('click', completion);

  btn.classList.remove('hidden');
  btn.enabled = true;
}

function createPhoneInput(field) {
  try {
    const wrapperDiv = createWrapperDiv(field.id + 'Div', field.name || 'Phone number:');
    const phone = createInputField(field);
    phone.setAttribute('type', 'tel');
    phone.setAttribute('name', 'phone');
    phone.setAttribute('onkeypress', 'return event.charCode >= 48 && event.charCode <= 57');
    appendElementInDiv(phone, wrapperDiv);

    _phoneInput = window.intlTelInput(phone, {
      initialCountry: 'auto',
      nationalMode: true,
      preferredCountries: ['us', 'gb', 'il', 'in', 'au'],
      utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
    });

    return wrapperDiv;
  } catch (ex) {
    console.log(ex);
  }
}

function createTextInput(field) {
  try {
    const wrapperDiv = createWrapperDiv(field.id + 'Div', field.name || 'Enter text:');
    const text = createInputField(field);
    if (field.masked) {
      text.setAttribute('type', 'password');
    } else {
      text.setAttribute('type', 'text');
    }
    appendElementInDiv(text, wrapperDiv);
    return wrapperDiv;
  } catch (ex) {
    console.log(ex);
  }
}

function createMessage(field) {
  try {
    const wrapperDiv = document.createElement('DIV');
    wrapperDiv.id = field.id;
    wrapperDiv.classList.add('column');
    wrapperDiv.classList.add('gap');

    const label = document.createElement('LABEL');
    label.setAttribute('for', field.id);
    label.innerHTML = field.name;
    label.style = 'margin: 6px; font-weight: lighter;';
    appendElementInDiv(label, wrapperDiv);

    return wrapperDiv;
  } catch (ex) {
    console.log(ex);
  }
}

function createDecimalInput(field) {
  try {
    const wrapperDiv = createWrapperDiv(field.id + 'Div', field.name || 'Amount:');
    const num = createInputField(field);
    num.setAttribute('type', 'number');
    num.setAttribute('step', '0.10');
    num.setAttribute('pattern', '^d*(.d{0,2})?$');
    num.setAttribute(
      'onkeypress',
      'return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46',
    );
    appendElementInDiv(num, wrapperDiv);
    return wrapperDiv;
  } catch (ex) {
    console.log(ex);
  }
}

function createNumberInput(field) {
  try {
    const wrapperDiv = createWrapperDiv(field.id + 'Div', field.name || 'Number:');
    const num = createInputField(field);
    num.setAttribute('type', 'number');
    num.setAttribute('step', '1');
    // num.setAttribute('oninput', 'validity.valid||(value="");');
    num.setAttribute('onkeypress', 'return event.charCode >= 48 && event.charCode <= 57');
    appendElementInDiv(num, wrapperDiv);
    return wrapperDiv;
  } catch (ex) {
    console.log(ex);
  }
}

function createEmailInput(field) {
  try {
    const wrapperDiv = createWrapperDiv(field.id + 'Div', field.name || 'Email:');
    const email = createInputField(field);
    email.setAttribute('type', 'email');
    appendElementInDiv(email, wrapperDiv);
    return wrapperDiv;
  } catch (ex) {
    console.log(ex);
  }
}

function createDropDownList(field) {
  try {
    const wrapperDiv = createWrapperDiv(field.id + 'Div', field.name || 'Select an option:');
    const dropdown = Object.assign(document.createElement(`DIV`), {
      innerHTML:
        `<select name="dropdown" id=${field.id} ><option/><option disabled selected value> -- select an option -- </option>` +
        field.options
          .map(item => {
            return '<option value="' + item + '">' + item + '</option>';
          })
          .join('') +
        '</select>',
      classList: 'form-group',
    });
    appendElementInDiv(dropdown, wrapperDiv);
    return wrapperDiv;
  } catch (ex) {
    console.log(ex);
  }
}

function createCheckbox(field) {
  try {
    const wrapperDiv = createWrapperDiv(field.id + 'Div', field.name);
    const checkbox = document.createElement('INPUT');
    checkbox.type = 'checkbox';
    checkbox.id = field.id;
    checkbox.name = field.id;
    checkbox.value = field.value ?? false;
    checkbox.style = 'margin: 6px;';

    const onCheck = (/*event*/) => {
      checkbox.value = checkbox.checked;
    };

    checkbox.addEventListener('change', onCheck);

    const label = document.createElement('label');
    label.htmlFor = 'car';
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode('Car'));
    appendElementInDiv(label, wrapperDiv);
    return wrapperDiv;
  } catch (ex) {
    console.log(ex);
  }
}

function createWrapperDiv(id, label_text) {
  const wrapperDiv = document.createElement('DIV');
  wrapperDiv.id = id;
  wrapperDiv.classList.add('column');

  if (label_text) {
    const label = document.createElement('LABEL');
    label.setAttribute('for', id);
    label.innerHTML = label_text;
    label.style = 'margin: 6px; font-weight: bold;';
    appendElementInDiv(label, wrapperDiv);
  }
  return wrapperDiv;
}

function createInputField(field) {
  const elem = document.createElement('INPUT');
  elem.classList.add('focus-visible');
  elem.classList.add('full-width');
  elem.classList.add('sm');
  elem.id = field.id;
  elem.setAttribute('name', field.type);
  if (field.hint) {
    elem.placeholder = field.hint;
  }
  if (field.value) {
    elem.value = field.value;
  }
  elem.required = field.mandatory == true;
  return elem;
}

function appendElementInDiv(element, wrapperDiv) {
  try {
    wrapperDiv.appendChild(element);
  } catch (ex) {
    console.log(ex);
  }
}

function pushFieldInDiv(element, root_div) {
  try {
    const btn = root_div.querySelector('#ok_button');
    root_div.insertBefore(element, btn);
  } catch (ex) {
    console.log(ex);
  }
}

function markInputError(id, message) {
  const elem = document.getElementById(id);
  if (!elem) throw 'Cannot use function before dynamic form is added to the page document.';
  elem.style.borderColor = 'red';
  elem.focus();
  setInterval(function () {
    const elem = document.getElementById(id);
    if (elem) {
      elem.style = 'borderColor: #ccc';
    }
    console.log('clearing error');
  }, 1500);

  if (message) {
    const errorDiv = document.getElementById('dynamic_form_error');
    errorDiv.innerHTML = message;
    errorDiv.classList.remove('hidden');
  }
}

function validateForm() {
  const fields = _actionData.actions;
  let isValid = true;
  fields.forEach((field /*, index, arr*/) => {
    const field_id = field.id;
    const elem = document.getElementById(field_id);
    if (!elem) {
      console.log(`Cannot find element with id: ${field_id}`);
      return false;
    }
    const elem_value = elem.value;

    if (field.mandatory == true && !elem_value) {
      markInputError(field_id, 'Required input missing.');
      isValid = false;
      return false;
    }

    if (elem_value) {
      if (field.min_len) {
        if (length(elem_value) > field.max_len) {
          markInputError(field_id, `Input must contain at least ${field.min_len} characters`);
          isValid = false;
          return false;
        }
      }

      if (field.max_len) {
        if (length(elem_value) < field.min_len) {
          markInputError(field_id, `Input must contain at most ${field.max_len} characters`);
          isValid = false;
          return false;
        }
      }

      switch (field.type) {
        case 'email':
          if (!isValidEmail(elem_value)) {
            markInputError(field_id, 'Email missing or invalid.');
            isValid = false;
            return false;
          }
          break;
        case 'phone':
          if (!_phoneInput.isValidNumber()) {
            markInputError(field_id, 'Phone number missing or invalid.');
            isValid = false;
            return false;
          }
          break;
        case 'number':
          if (isNaN(elem_value)) {
            markInputError(field_id, 'Input must be a number.');
            isValid = false;
            return false;
          }
      }
    }
  });
  return isValid;
}

function isValidEmail(input) {
  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return input.match(validRegex);
}

function disableAllButtons() {
  const btn = document.getElementById('ok_button');
  if (!btn) throw 'Cannot use function before dynamic form is added to the page document.';
  document.getElementById('ok_button').disabled = true;
  document.getElementById('cancel_button').disabled = true;
  document.getElementById('delete_button').disabled = true;
}

function collectOutput(fields_output) {
  const output = {};
  const size = Object.keys(fields_output).length;
  Array(size)
    .fill(0)
    .map((_, index) => {
      const obj = fields_output[`${index}`];
      if (obj) {
        const elem = document.getElementById(obj.id);
        obj['value'] = elem.value;
        output[obj.id] = obj;
      }
    });
  return output;
}
