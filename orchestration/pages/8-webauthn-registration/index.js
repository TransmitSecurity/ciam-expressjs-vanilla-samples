import { showInformation, executeJourney, flowId } from '../commonUtils.js';
import { ClientResponseOptionType, IdoJourneyActionType } from '../sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'test2';
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
    case IdoJourneyActionType.WebAuthnRegistration:
      clientResponse = await showInformation({
        title: 'Webauthn Register action',
        text: 'About to register a webauthn key',
      });
      clientResponse.data.webauthn_encoded_result = await window.tsPlatform.webauthn.register(
        actionData.username,
      );
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
