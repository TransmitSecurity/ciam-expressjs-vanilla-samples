import { showInformation, executeJourney, flowId } from '../commonUtils.js';
import { IdoJourneyActionType } from '../sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'DRS';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: flowId(),
  additionalParams: {},
};

const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
if (parsedState && parsedState.expires > new Date().getTime()) {
  executeJourney(JOURNEY_NAME, handleJourneyActionUI, JOURNEY_ADDITIONAL_PARAMS, parsedState.state);
} else {
  localStorage.removeItem('serializedState');
}

window.drs = {
  actionType: {
    LOGIN: 'login',
    REGISTER: 'register',
    TRANSACTION: 'transaction',
    PASSWORD_RESET: 'password_reset',
    LOGOUT: 'logout',
    CHECKOUT: 'checkout',
    ACCOUNT_DETAILS_CHANGE: 'account_details_change',
    ACCOUNT_AUTH_CHANGE: 'account_auth_change',
    WITHDRAW: 'withdraw',
    CREDITS_CHANGE: 'credits_change',
  },
};

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
    case IdoJourneyActionType.DrsTriggerAction:
      // eslint-disable-next-line no-case-declarations
      const { actionToken } = await window.tsPlatform.drs.triggerActionEvent(
        window.drs.actionType.LOGIN,
      );
      console.log('Action Token', actionToken);
      // Add code here to send the action and the received actionToken to your backend
      clientResponse = await showInformation({
        title: 'DRS Trigger Action',
        text: 'About to trigger a DRS action',
        data: { action_token: actionToken },
      });
      break;
    default:
      throw `Unexpected step id: ${stepId}`;
  }

  return clientResponse;
}
