import { pageUtils } from '../../shared/pageUtils.js';
import { showInformation, executeJourney, flowId } from './commonUtils.js';
import { ClientResponseOptionType, IdoJourneyActionType } from './sdk_interface.js';
// import { tsPlatform } from '../../node_modules/orchestration/dist/web-sdk-ido.js'; // debug only

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'ENTER JOURNEY NAME HERE';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: flowId(),
  additionalParams: { username: 'John Doe', plus: true },
};

const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
if (parsedState && parsedState.expires > new Date().getTime()) {
  executeJourney(JOURNEY_NAME, handleJourneyActionUI, JOURNEY_ADDITIONAL_PARAMS, parsedState.state);
} else {
  localStorage.removeItem('serializedState');
}

function onClick() {
  executeJourney(
    JOURNEY_NAME,
    handleJourneyActionUI,
    JOURNEY_ADDITIONAL_PARAMS,
    undefined,
    undefined,
    { webauthn: { serverPath: 'https://api.idsec-stg.com' } },
  );
}

async function handleJourneyActionUI(idoResponse) {
  const actionData = idoResponse?.data;
  const stepId = idoResponse?.journeyStepId;
  const responseOptions = idoResponse?.clientResponseOptions || new Map();

  console.debug(`handle journey action ${stepId}`);
  let clientResponse = null;

  if (actionData['json_data']) {
    console.log(`JSON data: ${JSON.stringify(actionData['json_data'])}`);
  }

  switch (stepId) {
    case IdoJourneyActionType.Information:
      clientResponse = await showInformation(actionData, responseOptions);
      break;
    case IdoJourneyActionType.DebugBreak:
      clientResponse = await showInformation({
        title: 'Breakpoint',
        text: 'Journey is holding on breakpoint',
      });
      break;
    case IdoJourneyActionType.CryptoBindingRegistration:
      clientResponse = await showInformation({
        title: 'Crypto Binding',
        text: 'About to register a device key',
      });
      break;
    case IdoJourneyActionType.WaitForAnotherDevice:
      clientResponse = await showInformation({
        title: 'Wait for ticket',
        text: 'Journey is waiting for a ticket',
      });
      break;
    case 'phone_input':
      clientResponse = await showPhoneForm(actionData, responseOptions);
      break;
    case 'otp_input':
      clientResponse = await showOtpForm(actionData, responseOptions);
      break;
    case 'kba_input':
      clientResponse = await showKbaForm(actionData, responseOptions);
      break;
    case IdoJourneyActionType.Authentication:
      clientResponse = await showInformation({
        title: 'Webauthn Register action',
        text: 'About to register a webauthn key',
      });
      clientResponse.data.webauthn_encoded_result =
        await window.tsPlatform.webauthn.authenticate.modal(actionData.username);
      break;
    default:
      throw `Unexpected step id: ${stepId}`;
  }

  return clientResponse;
}
// This function is tailored for displaying the 'phone_input' action
async function showPhoneForm() {
  return new Promise((resolve /*reject*/) => {
    function submitPhone() {
      const input_value = pageUtils.extractInputValue('phone_form_input');
      pageUtils.hide('phone_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: { phone: input_value },
      });
    }

    document.getElementById('phone_form_input').value = '';
    pageUtils.show('phone_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#phone_form_button').removeEventListener('click', submitPhone);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#phone_form_button').addEventListener('click', submitPhone);
  });
}

// This function is tailored for displaying the 'otp_input' action
async function showOtpForm(actionData) {
  return new Promise((resolve /*reject*/) => {
    function submitOtp() {
      const input_value = pageUtils.extractInputValue('otp_form_input');
      pageUtils.hide('otp_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: { otp: input_value },
      });
    }

    pageUtils.updateElementText(
      'otp_form_text',
      actionData?.app_data?.message || 'Empty message from server',
    );
    document.getElementById('otp_form_input').value = '';
    pageUtils.show('otp_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#otp_form_button').removeEventListener('click', submitOtp);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#otp_form_button').addEventListener('click', submitOtp);
  });
}

// This function is tailored for displaying the 'kba_input' action.
// MAY collect more than one Q/A
async function showKbaForm(actionData, responseOptions) {
  return new Promise((resolve /*reject*/) => {
    function submitKba() {
      const question_value = pageUtils.extractInputValue('kba_question_form_input');
      const answer_value = pageUtils.extractInputValue('kba_answer_form_input');
      pageUtils.hide('kba_form');
      pageUtils.hide('kba_skip_button');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: {
          kba: [
            {
              question: question_value,
              answer: answer_value,
            },
          ],
        },
      });
    }
    function submitSkip() {
      pageUtils.hide('kba_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: 'skip_question_registration',
        data: {},
      });
    }

    document.getElementById('kba_question_form_input').value = '';
    document.getElementById('kba_answer_form_input').value = '';
    if (responseOptions.get('skip_question_registration')) {
      pageUtils.show('kba_skip_button');
    }
    pageUtils.show('kba_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#kba_form_button').removeEventListener('click', submitKba);
    document.querySelector('#kba_skip_button').removeEventListener('click', submitSkip);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#kba_form_button').addEventListener('click', submitKba);
    document.querySelector('#kba_skip_button').addEventListener('click', submitSkip);
  });
}
