import { showInformation, startJourney } from '../commonUtils.js';
import { IdoJourneyActionType } from '../sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'wait_for_device';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: 'random',
  additionalParams: {},
};

const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
if (parsedState && parsedState.expires > new Date().getTime()) {
  startJourney(JOURNEY_NAME, handleJourneyActionUI, JOURNEY_ADDITIONAL_PARAMS, parsedState.state);
} else {
  localStorage.removeItem('serializedState');
}

function onClick() {
  startJourney(JOURNEY_NAME, handleJourneyActionUI, JOURNEY_ADDITIONAL_PARAMS);
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
    case IdoJourneyActionType.WaitForAnotherDevice:
      clientResponse = await showInformation({
        title: 'Wait for ticket',
        text: 'Journey is waiting for a ticket',
      });
      break;
    default:
      throw `Unexpected step id: ${stepId}`;
  }

  return clientResponse;
}
