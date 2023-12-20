import { executeJourney, flowId, showAuthentication, showInformation } from '../commonUtils.js';
import { ClientResponseOptionType, IdoJourneyActionType } from '../sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'authentication_action';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: flowId(),
  additionalParams: {},
};

const SDK_INIT_OPTIONS = {
  clientId: '93nvx1guth3pf2w92souyf5ebb47m91g',
  serverPath: 'https://ia1sex9mt686s6xt1akm9.transmit.security',
  appId: 'default_application',
};

const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
if (parsedState && parsedState.expires > new Date().getTime()) {
  executeJourney(
    JOURNEY_NAME,
    handleJourneyActionUI,
    JOURNEY_ADDITIONAL_PARAMS,
    parsedState.state,
    SDK_INIT_OPTIONS,
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
    SDK_INIT_OPTIONS,
  );
}

async function handleJourneyActionUI(idoResponse) {
  console.log('idoResponse', idoResponse);
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
        idoResponse,
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
