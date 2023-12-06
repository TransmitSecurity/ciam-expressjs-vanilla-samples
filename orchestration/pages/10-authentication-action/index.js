import { pageUtils } from '../../../shared/pageUtils.js';
import { executeJourney, flowId, showInformation } from '../commonUtils.js';
import { ClientResponseOptionType, IdoJourneyActionType } from '../sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'authentication_actione';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: flowId(),
  additionalParams: {},
};

const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
if (parsedState && parsedState.expires > new Date().getTime()) {
  executeJourney(
    JOURNEY_NAME,
    handleJourneyActionUI,
    JOURNEY_ADDITIONAL_PARAMS,
    parsedState.state,
    undefined,
    { webauthn: { serverPath: 'https://api.idsec-stg.com' } },
  );
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
    case 'collect_username':
      clientResponse = await handleCollectUsernameForm();
      break;
    case IdoJourneyActionType.Authentication:
      clientResponse = await showAuthentication({
        title: 'Authenticate with Webauthn action',
        text: 'About to authenticate using a webauthn key',
      });
      break;
    default:
      throw `Unexpected step id: ${stepId}`;
  }

  return clientResponse;
}

function handleCollectUsernameForm() {
  return new Promise(resolve => {
    // Reset input fields
    document.getElementById('username_input').value = '';

    // Set form instructions
    document.getElementById('collect_username_text').textContent = 'Please enter your username';

    // Handle input field and main submit
    document.querySelector('#collect_username_button')?.addEventListener(
      'click',
      () => {
        const username_value = document.getElementById('username_input').value; // collect username
        document.getElementById('collect_username').style.display = 'none';
        resolve({
          option: ClientResponseOptionType.ClientInput,
          data: { username: username_value },
        });
      },
      { once: true },
    );

    document.getElementById('collect_username').style.display = 'block';
  });
}

async function showAuthentication(actionData) {
  return new Promise((resolve /*reject*/) => {
    async function submit() {
      const webauthn_encoded_result = await window.tsPlatform.webauthn.authenticate.modal(
        actionData.username,
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
