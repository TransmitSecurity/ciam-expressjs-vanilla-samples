import { pageUtils } from '../../../../shared/pageUtils.js';
import { showInformation, executeJourney } from '../../commonUtils.js';
import { IdoJourneyActionType } from '../../sdk_interface.js';
// import { tsPlatform } from '../../node_modules/orchestration/dist/web-sdk-ido.js'; // debug only

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'multi_auth';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: 'random',
  additionalParams: {},
};
const CLIENT_ID = '5x2wax6nsboxk13b1zd6ew2lkpx3216p';

function onClick() {
  executeJourney(JOURNEY_NAME, handleJourneyActionUI, JOURNEY_ADDITIONAL_PARAMS, null, CLIENT_ID);
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
    case 'authenticate':
      clientResponse = await showAuthnForm(actionData, responseOptions);
      break;
    default:
      throw `Unexpected step id: ${stepId}`;
  }

  return clientResponse;
}

// This function is tailored for displaying the 'authenticate' action.
// MAY collect more than one Q/A
async function showAuthnForm(/*actionData, responseOptions*/) {
  return new Promise((resolve /*, reject*/) => {
    async function submitAuth() {
      const username_value = pageUtils.extractInputValue(
        'authenticate_webauthn_username_form_input',
      );
      const encodedResult = await window.tsPlatform.webauthn.authenticate.modal(username_value);
      pageUtils.hide('authenticate_webauthn');
      resolve({
        option: 'webauthn', // OFC would properly take this from the responseOptions
        data: {
          webauthn: {
            auth_result: encodedResult,
          },
        },
      });
    }

    document.getElementById('authenticate_webauthn_username_form_input').value = '';
    pageUtils.show('authenticate_webauthn');

    // clear all handlers, this handles multiple runs of the same action
    document
      .querySelector('#authenticate_webauthn_form_button')
      .removeEventListener('click', submitAuth);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document
      .querySelector('#authenticate_webauthn_form_button')
      .addEventListener('click', submitAuth);
  });
}
