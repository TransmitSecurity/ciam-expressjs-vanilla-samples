import { showInformation, executeJourney } from '../commonUtils.js';
import { IdoJourneyActionType } from '../sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'test2';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: 'random',
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
    case IdoJourneyActionType.WebAuthnRegistration:
      // eslint-disable-next-line no-case-declarations
      const webauthn_encoded_result = await window.tsPlatform.webauthn.register(
        actionData.username,
      );
      clientResponse = await showInformation({
        title: 'Webauthn Register action',
        text: 'About to register a webauthn key',
        data: { webauthn_encoded_result },
      });
      break;
    default:
      throw `Unexpected step id: ${stepId}`;
  }

  return clientResponse;
}
