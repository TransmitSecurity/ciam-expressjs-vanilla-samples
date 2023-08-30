import { pageUtils } from '../../../../shared/pageUtils.js';
import { showInformation, executeJourney } from '../../commonUtils.js';
import { IdoJourneyActionType } from '../../sdk_interface.js';
// import { tsPlatform } from '../../node_modules/orchestration/dist/web-sdk-ido.js'; // debug only

// Register event handlers for buttons
document.querySelector('#start_journey_button').addEventListener('click', onStart);
document.querySelector('#restart_journey_button').addEventListener('click', onRestart);

const JOURNEY_NAME = 'multi_auth';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: 'random',
  additionalParams: {},
};
const CLIENT_ID = '5x2wax6nsboxk13b1zd6ew2lkpx3216p';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get('code');
const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
if (parsedState && (code || parsedState.expires > new Date().getTime())) {
  executeJourney(JOURNEY_NAME, handleJourneyActionUI, JOURNEY_ADDITIONAL_PARAMS, parsedState.state);
} else {
  localStorage.removeItem('serializedState');
}

function onStart() {
  executeJourney(JOURNEY_NAME, handleJourneyActionUI, JOURNEY_ADDITIONAL_PARAMS, null, CLIENT_ID);
}
function onRestart() {
  window.location.href = location.protocol + '//' + location.host + location.pathname;
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
    async function submitWebauthn() {
      const username_value = pageUtils.extractInputValue(
        'authenticate_webauthn_username_form_input',
      );
      const encodedResult = await window.tsPlatform.webauthn.authenticate.modal(username_value);
      pageUtils.hide('authenticate_webauthn');
      resolve({
        option: 'webauthn', // OFC would properly take this from the responseOptions
        data: {
          webauthn: {
            result: encodedResult,
          },
        },
      });
    }

    async function submitHosted() {
      window.location.href = `https://api.userid.security/oidc/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        'http://localhost:5501/orchestration/pages/webauthn/authenticate/index.html',
      )}&scope=openid&prompt=login`;
      // On page load, the journey will continue by picking up stored state
      // This form will be re-shown, and then we should auto resolve the Promise with the authCode from the URL
    }

    if (code) {
      // we have just returned from hosted login
      resolve({
        option: 'hosted', // OFC would properly take this from the responseOptions
        data: {
          hosted: {
            code: code,
          },
        },
      });
    } else {
      // we are new to this page
      document.getElementById('authenticate_webauthn_username_form_input').value = '';
      pageUtils.show('authenticate_webauthn');

      // clear all handlers, this handles multiple runs of the same action
      document
        .querySelector('#authenticate_webauthn_form_button')
        .removeEventListener('click', submitWebauthn);
      document
        .querySelector('#authenticate_hosted_form_button')
        .removeEventListener('click', submitHosted);

      // Handle input field and main submit
      // eslint-disable-next-line no-unused-vars
      document
        .querySelector('#authenticate_webauthn_form_button')
        .addEventListener('click', submitWebauthn);
      document
        .querySelector('#authenticate_hosted_form_button')
        .addEventListener('click', submitHosted);
    }
  });
}
