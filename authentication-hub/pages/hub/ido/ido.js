import { pageUtils } from '../../../../shared/pageUtils.js';
import {
  startDynamicForm,
  createDynamicFormUI,
  addDynamicFormUI,
  removeDynamicFormUI,
} from './dynamic_form.js';
import { ClientResponseOptionType, IdoJourneyActionType } from './sdk_interface.js';

async function startJourney(originalClientId, src_interaction) {
  const journeyId = getJourneyId();
  if (!journeyId) {
    throw new Error('Journey id is null');
  }

  console.log(`Starting journey with id: ${journeyId}`);
  pageUtils.showLoading();
  const idoResponse = await window.tsPlatform.ido.startJourney(journeyId, {
    flowId: flowId(),
    additionalParams: { originalClientId, src_interaction },
  });
  pageUtils.hideLoading();
  localStorage.setItem('journeyId', journeyId); // save current journey id in local storage
  document.getElementById('journey_id').value = journeyId; // save current journey id in UI

  return await processJourney(idoResponse);
}

window.startJourney = startJourney;

async function processJourney(lastIdoResponse) {
  try {
    if (!lastIdoResponse) {
      throw new Error('IDO response is null');
    }

    pageUtils.hide('login_form');
    pageUtils.show('journey_container');
    let idoResponse = lastIdoResponse;
    let inJourney = true;
    let url = null;

    while (inJourney) {
      console.log(`IDO Response: ${JSON.stringify(idoResponse)}`);
      // write to local store, non expired. Clean manually if needed
      localStorage.setItem(
        'serializedState',
        JSON.stringify({
          state: window.tsPlatform.ido.serializeState(),
          expires: new Date().getTime() + 60 * 1000,
        }),
      );

      const journeyStepId = idoResponse?.journeyStepId;
      const data = idoResponse?.data;
      const clientResponseOptions = idoResponse?.clientResponseOptions;
      const error_message =
        data?.json_data?.message || data?.json_data?.error_message || data?.json_data?.error;
      let clientInput = null;

      if (error_message) {
        window.pageUtils.updateElementText('status', data.data?.json_data['message']);
      }
      if (idoResponse.data.json_data?.url) {
        url = idoResponse.data.json_data?.url;
        console.log(`Journey returned redirect url: ${url}`);
      }

      if (idoResponse.data?.app_data?.type == 'dynamic_form') {
        // override stepId lookup and run dynamic form
        clientInput = await showDynamicForm(data.app_data, clientResponseOptions);
      } else {
        // journey step id UI implementation lookup
        switch (journeyStepId) {
          case IdoJourneyActionType.Information:
            clientInput = await showInformation(data, clientResponseOptions);
            break;
          case 'login_page':
            pageUtils.hide('journey_container');
            clientInput = await loginPage(data.app_data, clientResponseOptions);
            pageUtils.show('journey_container');
            break;
          case IdoJourneyActionType.DebugBreak:
            clientInput = await showInformation({
              title: 'Breakpoint',
              text: 'Journey is holding on breakpoint',
            });
            break;
          case IdoJourneyActionType.WebAuthnRegistration:
            // Handle webauthn registration step
            clientInput = await showInformation({
              title: 'Webauthn Register action',
              text: 'About to register a webauthn key',
            });
            clientInput.data.webauthn_encoded_result = await window.tsPlatform.webauthn.register(
              data.username,
            );
            break;
          case IdoJourneyActionType.Success:
            alert(`Journey is completed successfully with url: ${url}`);
            inJourney = false;
            break;
          case IdoJourneyActionType.Rejection:
            await showInformation({
              title: 'Rejection',
              text: `Journey is rejected with error: ${idoResponse.rejectionReason}`,
            });
            inJourney = false;
            break;
          default:
            throw new Error(`Unexpected step id: ${journeyStepId}`);
        }
      }

      if (inJourney) {
        if (!clientInput) {
          throw new Error('Client input is null');
        }
        pageUtils.showLoading();
        idoResponse = await window.tsPlatform.ido.submitClientResponse(
          clientInput.option,
          clientInput.data,
        );
        pageUtils.hideLoading();
      }
    }

    pageUtils.hide('journey_container');
    localStorage.removeItem('serializedState'); // remove serialized state from local storage upon journey completion
    return url;
  } catch (error) {
    pageUtils.hideLoading();
    await showInformation({
      title: 'Rejection',
      text: `Journey is rejected with error: ${error}`,
    });
    removeDynamicFormUI('journey_container');
    pageUtils.hide('journey_container');
    localStorage.removeItem('serializedState'); // remove serialized state from local storage upon journey completion
    throw error;
  }
}

window.processJourney = processJourney;

async function loginPage(actionData, responseOptions) {
  const isAutofillSupported = await window.tsPlatform.webauthn.isAutofillSupported();
  if (actionData.username) {
    document.getElementById('username').value = actionData.username;
  }

  return new Promise((resolve /*reject*/) => {
    function submitPasskeyResult(webauthn_encoded_result) {
      const username = document.getElementById('username').value;
      localStorage.setItem('username', username);
      pageUtils.hide('login_form');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: {
          webauthn_encoded_result,
          type: 'webauthn',
          username: username,
        },
      });
    }

    function handleAutofillError(error) {
      if (error.errorCode === 'autofill_authentication_aborted') return;
      window.pageUtils.updateElementText('status', `Error during passkey login: ${error}`);
    }

    if (isAutofillSupported) {
      /* Passkey Logic */
      window.tsPlatform.webauthn.authenticate.autofill.activate({
        onSuccess: submitPasskeyResult,
        onError: handleAutofillError,
      });
    }

    async function passkeyButton() {
      try {
        await window.tsPlatform.webauthn.authenticate.autofill.abort();
        const username = document.getElementById('username').value;
        if (!username) {
          window.pageUtils.updateElementText('status', `Please enter a username`);
          document.getElementById('username').focus();
          return;
        }
        localStorage.setItem('username', username);

        const webauthn_encoded_result = await window.tsPlatform.webauthn.authenticate.modal(
          username,
        );
        submitPasskeyResult(webauthn_encoded_result);
      } catch (error) {
        if (error.errorCode === 'webauthn_authentication_canceled') return;
        window.pageUtils.updateElementText('status', `Error during passkey login: ${error}`);
      }
    }

    async function otherOptions() {
      await window.tsPlatform.webauthn.authenticate.autofill.abort();
      const username = document.getElementById('username').value;
      if (!username) {
        window.pageUtils.updateElementText('status', `Please enter a username`);
        document.getElementById('username').focus();
        return;
      }
      localStorage.setItem('username', username);

      pageUtils.hide('login_form');
      resolve({
        option: 'other_options',
        data: {
          username: username,
        },
      });
    }

    async function createHubUser() {
      try {
        await window.tsPlatform.webauthn.authenticate.autofill.abort();
        const username = document.getElementById('username').value;
        if (!username) {
          window.pageUtils.updateElementText('status', `Please enter a username`);
          document.getElementById('username').focus();
          return;
        }
        localStorage.setItem('username', username);
        pageUtils.hide('login_form');
        resolve({
          option: 'escape_option',
          data: { username: username },
        });
      } catch (error) {
        if (error.errorCode === 'webauthn_authentication_canceled') return;
        window.pageUtils.updateElementText('status', `Error during passkey login: ${error}`);
      }
    }

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#passkey_button').removeEventListener('click', passkeyButton);
    document.querySelector('#passkey_button').addEventListener('click', passkeyButton);

    if (responseOptions.has('other_options')) {
      // clear all handlers, this handles multiple runs of the same action
      document.querySelector('#other_options').removeEventListener('click', otherOptions);
      document.querySelector('#other_options').addEventListener('click', otherOptions);
      pageUtils.show('other_options');
    }

    if (responseOptions.has('escape_option')) {
      // clear all handlers, this handles multiple runs of the same action
      document.querySelector('#escape_option').removeEventListener('click', createHubUser);
      document.querySelector('#escape_option').addEventListener('click', createHubUser);
      document.querySelector('#escape_option').innerText =
        responseOptions.get('escape_option').label;
      pageUtils.show('escape_option');
    }

    pageUtils.show('login_form');
  });
}

async function showInformation(actionData, responseOptions) {
  const app_data = actionData;
  app_data['subtitle'] = actionData.title;
  delete app_data['title'];
  app_data['type'] = 'dynamic_form';
  app_data['actions'] = [];
  if (actionData.text) {
    app_data['actions'].push({ type: 'message', id: 'message', name: actionData.text });
  }
  await showDynamicForm(app_data, responseOptions);
  return {
    option: ClientResponseOptionType.ClientInput,
    data: {},
  };
}

async function showDynamicForm(app_data, responseOptions) {
  const df_div = createDynamicFormUI(app_data, responseOptions);
  addDynamicFormUI(df_div, 'journey_container');
  const clientInput = await startDynamicForm();
  removeDynamicFormUI('journey_container');
  return clientInput;
}

export function getJourneyId() {
  try {
    const journeyIdField = document.getElementById('journey_id');
    if (!journeyIdField.value) {
      if (localStorage.getItem('journeyId')) {
        journeyIdField.value = localStorage.getItem('journeyId');
      } else if (window.env.VITE_TS_FLEXIDO_JOURNEY_ID) {
        journeyIdField.value = window.env.VITE_TS_FLEXIDO_JOURNEY_ID;
      }
    }
    // save journey id in local storage
    localStorage.setItem('journeyId', journeyIdField.value);
    return journeyIdField.value;
  } catch (error) {
    localStorage.removeItem('journeyId');
    throw error;
  }
}

export function flowId() {
  return `orc_${Math.floor(Math.random() * 1000000000)}`;
}
