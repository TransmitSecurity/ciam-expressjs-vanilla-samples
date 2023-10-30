import { DEFAULT_SDK_INIT_OPTIONS } from '../commonUtils.js';

// Collect urlParams
export const urlParams = new URLSearchParams(window.location.search);

// Define the journey name and additional parameters
const startEnhancedJourney = urlParams.get('start_enhanced');
const isIDVDone = urlParams.get('sessionId');
export let JOURNEY_NAME = 'ciam_account_opening_start';
export const JOURNEY_ADDITIONAL_PARAMS = {
  // optional
  flowId: 'my_external_session_tracking_id',
  additionalParams: { verbose: true },
};

// Define the SDK init options
export const idoSDKInitOptions = DEFAULT_SDK_INIT_OPTIONS;
export const otherModulesInitOptions = {};

// If the enhanced journey is selected, change the journey name and add webAuthN registration
if (startEnhancedJourney || isIDVDone) {
  JOURNEY_NAME = 'ciam_account_opening_full';
  otherModulesInitOptions.webauthn = {
    serverPath: 'https://api.idsec-stg.com',
  };
  otherModulesInitOptions.drs = {
    serverPath: 'https://collect.riskid-stg.io',
  };
}

if (startEnhancedJourney) {
  // Sample application convenience code:
  // Reset the journey state when an explicit request to start full journey has been made.
  // This will allow escaping Identity Verification by going back to the menu and starting the journey again.
  localStorage.removeItem('serializedState');
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

// DRS action types
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

// Set event handlers for back to menu buttons
document.querySelector('#back_to_menu_1').addEventListener('click', () => {
  window.location.href = './account-opening-menu.html';
});
document.querySelector('#back_to_menu_2').addEventListener('click', () => {
  window.location.href = './account-opening-menu.html';
});
