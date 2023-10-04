import { showInformation, executeJourney } from '../commonUtils.js';
import { IdoJourneyActionType } from '../sdk_interface.js';
// import { tsPlatform } from '../../node_modules/orchestration/dist/web-sdk-ido.js'; // debug only

const JOURNEY_NAME = 'cross_device';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: 'random',
  additionalParams: { messageId: new URLSearchParams(window.location.search).get('messageId') },
};

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

function onClick() {
  executeJourney(JOURNEY_NAME, handleJourneyActionUI, JOURNEY_ADDITIONAL_PARAMS);
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
    default:
      throw `Unexpected step id: ${stepId}`;
  }

  return clientResponse;
}
