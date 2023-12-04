/* eslint-disable no-unused-vars */
import { pageUtils } from '../../../shared/pageUtils.js';
import { getJourneyId, handleError, handleJourneySuccess, resetUI } from './training_utils.js';
import { ClientResponseOptionType, IdoJourneyActionType } from '../sdk_interface.js';
import { initSdk } from './init.js';

// Register event handlers for start journey button
document.querySelector('#start_journey_button').addEventListener('click', onClick);

function onClick() {
  resetUI();
  startJourney();
}

let sdk = null;
let ido = null;
const idoSDKState = localStorage.getItem('idoSDKState'); // get serialized state from local storage - supports IDV flow

async function init() {
  sdk = await initSdk();
  ido = sdk?.ido;
  if (idoSDKState) {
    resetUI();
    startJourney();
  }
}

init();

async function startJourney() {
  if (!ido) {
    handleError('IDO is not initialized');
    return;
  }

  // Start the journey...
  const journeyId = getJourneyId();
  if (!journeyId) {
    handleError('Journey ID is empty');
    return;
  }

  try {
    pageUtils.showLoading();
    // start journey
    pageUtils.hideLoading();

    // Handle journey response (loop until journey is done)
    // let inJourney = true;
    // while (inJourney) {
    //}
  } catch (error) {
    handleError(error);
  }
}
// Information action UI
async function showInformation(actionData) {
  return new Promise((resolve /*reject*/) => {
    function submit() {
      pageUtils.hide('information_form');
      pageUtils.hide('action_response_error');
      // resolve here...
    }

    pageUtils.updateElementText(
      'information_form_title',
      actionData?.title || 'Empty title from server',
    );
    pageUtils.updateElementText(
      'information_form_text',
      actionData?.text || 'Empty text from server',
    );
    pageUtils.updateElementText('information_form_button', actionData?.button_text || 'OK');
    pageUtils.show('information_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#information_form_button').removeEventListener('click', submit);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#information_form_button').addEventListener('click', submit);
  });
}
