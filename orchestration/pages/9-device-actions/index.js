import { showInformation, executeJourney } from '../commonUtils.js';
import { IdoJourneyActionType } from '../sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'device_actions';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: 'random',
  additionalParams: {},
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
    { drs: { serverPath: 'https://collect.riskid-stg.io' } },
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
    case IdoJourneyActionType.CryptoBindingRegistration:
    case IdoJourneyActionType.RegisterDeviceAction:
      clientResponse = await showInformation({
        title: 'Crypto Binding',
        text: 'About to register a device key',
      });
      break;
    case IdoJourneyActionType.CryptoBindingValidation:
    case IdoJourneyActionType.ValidateDeviceAction:
      clientResponse = await showInformation({
        title: 'Crypto Binding validation',
        text: 'About to validate a device key',
      });
      break;
    default:
      throw `Unexpected step id: ${stepId}`;
  }

  return clientResponse;
}
