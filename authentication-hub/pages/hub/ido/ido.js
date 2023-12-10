import { pageUtils } from '../../../../shared/pageUtils.js';
import { flowId, addDynamicFormUI, removeDynamicFormUI, getJourneyId } from './commonUtils.js';
import { startDynamicForm, createDynamicFormUI } from './dynamic_form.js';
import { ClientResponseOptionType, IdoJourneyActionType } from './sdk_interface.js';

// Register event handlers for buttons
// document.querySelector('#start_journey_button').addEventListener('click', onClick);

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
const ido = window.tsPlatform.ido;

// function onClick() {
//   const journeyId = getJourneyId();
//   startJourney(journeyId);
// }

async function loginWithUsername(username, originalClientId, src_interaction) {
  return new Promise((resolve, reject) => {
    const journeyId = getJourneyId();
    const params = {
      username,
      originalClientId,
      src_interaction,
    };

    pageUtils.show('journey_container');
    return startJourney(journeyId, params)
      .then(response => {
        pageUtils.hide('journey_container');
        resolve(response);
      })
      .catch(error => {
        pageUtils.hide('journey_container');
        reject(error);
      });
  });
}

window.loginWithUsername = loginWithUsername;

async function startJourney(journeyId, params = {}) {
  if (!journeyId) {
    throw new Error('Journey id is null');
  }

  console.log(`Starting journey with id: ${journeyId}`);
  pageUtils.showLoading();
  const idoResponse = await window.tsPlatform.ido.startJourney(journeyId, {
    flowId: flowId(),
    additionalParams: params,
  });
  pageUtils.hideLoading();
  localStorage.setItem('journeyId', journeyId);
  return await processJourney(idoResponse);
}

async function processJourney(lastIdoResponse) {
  if (!lastIdoResponse) {
    throw new Error('IDO response is null');
  }

  let idoResponse = lastIdoResponse;
  let inJourney = true;

  while (inJourney) {
    console.log(`IDO Response: ${JSON.stringify(idoResponse)}`);
    // write to local store, non expired. Clean manually if needed
    // localStorage.setItem(
    //   'serializedState',
    //   JSON.stringify({ state: ido.serializeState(), expires: new Date().getTime() + 60 * 1000 }),
    // );

    const journeyStepId = idoResponse?.journeyStepId;
    const data = idoResponse?.data;
    const clientResponseOptions = idoResponse?.clientResponseOptions;
    let clientInput = null;

    if (idoResponse.data?.app_data?.type == 'dynamic_form') {
      // override stepId lookup and run dynamic form
      clientInput = await showDynamicForm(data, clientResponseOptions);
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
        case 'authenticate_passkey':
          clientInput = await showAuthentication({
            title: 'Authenticate with Webauthn action',
            text: 'About to authenticate using a webauthn key',
            data: data.app_data,
          });
          break;
        case IdoJourneyActionType.Success:
          await showInformation({
            title: 'Success',
            text: `Journey is completed successfully with token: ${idoResponse.token}`,
          });
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
      idoResponse = await ido.submitClientResponse(clientInput.option, clientInput.data);
      pageUtils.hideLoading();
    }
  }

  return idoResponse;
}

window.processJourney = processJourney;

async function showInformation(actionData) {
  return new Promise((resolve /*reject*/) => {
    function submit() {
      pageUtils.hide('information_form');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: { ...actionData?.data },
      });
    }

    pageUtils.updateElementText(
      'information_form_title',
      actionData?.title || 'Empty title from server',
    );
    pageUtils.updateElementText(
      'information_form_text',
      actionData?.text || 'Empty text from server',
    );
    pageUtils.updateElementText('information_form_button', actionData?.button_text || 'OK');
    pageUtils.show('information_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#information_form_button').removeEventListener('click', submit);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#information_form_button').addEventListener('click', submit);
  });
}

async function showDynamicForm(actionData, responseOptions) {
  const df_div = createDynamicFormUI(actionData?.app_data, responseOptions);
  addDynamicFormUI(df_div);
  const clientInput = await startDynamicForm();
  removeDynamicFormUI();
  return clientInput;
}

async function loginPage(actionData /*, responseOptions*/) {
  const isAutofillSupported = await window.tsPlatform.webauthn.isAutofillSupported();
  if (actionData.username) {
    document.getElementById('username').value = actionData.username;
  }

  return new Promise((resolve /*reject*/) => {
    function submitPasskeyResult(webauthn_encoded_result) {
      const username = document.getElementById('username').value;
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
        const webauthn_encoded_result = await window.tsPlatform.webauthn.authenticate.modal(
          username,
        );
        submitPasskeyResult(webauthn_encoded_result);
      } catch (error) {
        if (error.errorCode === 'webauthn_authentication_canceled') return;
        window.pageUtils.updateElementText('status', `Error during passkey login: ${error}`);
      }
    }

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#passkey_button').removeEventListener('click', passkeyButton);
    document.querySelector('#passkey_button').addEventListener('click', passkeyButton);

    pageUtils.show('login_form');
  });
}

async function showAuthentication(actionData) {
  return new Promise((resolve /*reject*/) => {
    async function submit() {
      const webauthn_encoded_result = await window.tsPlatform.webauthn.authenticate.modal(
        actionData.data.username,
      );
      pageUtils.hide('authentication_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: {
          webauthn_encoded_result,
          type: 'webauthn',
        },
      });
    }

    function escape() {
      pageUtils.hide('authentication_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: 'escape_1',
        data: {},
      });
    }
    function cancel() {
      pageUtils.hide('authentication_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.Cancel,
        data: {},
      });
    }

    pageUtils.updateElementText(
      'authentication_form_title',
      actionData?.title || 'Empty title from server',
    );
    pageUtils.updateElementText(
      'authentication_form_text',
      actionData?.text || 'Empty text from server',
    );
    pageUtils.updateElementText('authenticate_button', actionData?.button_text || 'OK');
    pageUtils.show('authentication_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#authenticate_button').removeEventListener('click', submit);
    document.querySelector('#escape_button').removeEventListener('click', escape);
    document.querySelector('#cancel_button').removeEventListener('click', cancel);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#authenticate_button').addEventListener('click', submit);
    document.querySelector('#escape_button').addEventListener('click', escape);
    document.querySelector('#cancel_button').addEventListener('click', cancel);
  });
}
