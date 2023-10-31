import { DEFAULT_SDK_INIT_OPTIONS } from '../commonUtils.js';

// Collect urlParams
export const urlParams = new URLSearchParams(window.location.search);

// Define the journey name and additional parameters
const startEnhancedJourney = urlParams.get('start_enhanced');
const isIDVDone = urlParams.get('sessionId');
const isVerboseJourney = true;
export let JOURNEY_NAME = 'ciam_account_opening_start';
export let JOURNEY_ADDITIONAL_PARAMS = {
  // optional
  flowId: 'my_external_session_tracking_id',
  additionalParams: { verbose: isVerboseJourney },
};

// Define the SDK init options
export const idoSDKInitOptions = DEFAULT_SDK_INIT_OPTIONS;
export const otherModulesInitOptions = {};

// If the enhanced journey is selected, change the journey name and add webAuthN registration
if (startEnhancedJourney || isIDVDone) {
  // change start journey button to start enhanced journey button
  document.querySelector('#start_journey_button').textContent = 'Start Enhanced Journey';
  document.querySelector('#restart_journey_button').textContent = 'Restart Enhanced Journey';

  JOURNEY_NAME = 'ciam_account_opening_full';
  JOURNEY_ADDITIONAL_PARAMS = {
    // optional
    flowId: 'my_external_session_tracking_id',
    additionalParams: {
      verbose: isVerboseJourney,
      idv_redirect_url: window.location.origin + window.location.pathname,
    },
  };

  otherModulesInitOptions.webauthn = {
    serverPath: 'https://api.idsec-stg.com',
  };
  otherModulesInitOptions.drs = {
    serverPath: 'https://collect.riskid-stg.io',
  };
} else {
  document.querySelector('#start_journey_button').textContent = 'Start Journey';
  document.querySelector('#restart_journey_button').textContent = 'Restart Journey';
}

// Check if there is a serialized state in local storage and if it is still valid
// If so, continue the journey from the last step
// Otherwise, remove the serialized state from local storage
const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
export let idoSDKState = null;
if (parsedState && parsedState.expires > new Date().getTime()) {
  idoSDKState = parsedState.state;
} else {
  localStorage.removeItem('serializedState');
}

// Set event handlers for back to menu buttons
document.querySelector('#back_to_menu_1').addEventListener('click', () => {
  window.location.href = './account-opening-menu.html';
});
document.querySelector('#back_to_menu_2').addEventListener('click', () => {
  window.location.href = './account-opening-menu.html';
});
