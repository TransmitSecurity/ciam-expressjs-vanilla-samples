import { showInformation, executeJourney, flowId } from '../commonUtils.js';
import { IdoJourneyActionType } from '../sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'IDV';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: flowId(),
  additionalParams: {},
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sessionId = urlParams.get('sessionId');
const idvState = urlParams.get('state');
const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
if (parsedState && (sessionId ?? parsedState.expires > new Date().getTime())) {
  executeJourney(JOURNEY_NAME, handleJourneyActionUI, JOURNEY_ADDITIONAL_PARAMS, parsedState.state);
} else {
  localStorage.removeItem('serializedState');
}

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
    case IdoJourneyActionType.IdentityVerification:
      if (sessionId) {
        clientResponse = await showInformation({
          title: 'Identity verification Action',
          text: 'Identity verification action finished successfully',
          data: { payload: { sessionId, state: idvState } },
        });
      } else {
        // eslint-disable-next-line no-case-declarations
        const {
          payload: { endpoint },
        } = actionData ?? { payload: {} };
        if (endpoint) {
          window.location.href = endpoint;
          clientResponse = await showInformation({
            title: 'Identity verification Action',
            text: 'Being redirected to hosted Identity verification action',
          });
        }
      }
      break;
    default:
      throw `Unexpected step id: ${stepId}`;
  }

  return clientResponse;
}
