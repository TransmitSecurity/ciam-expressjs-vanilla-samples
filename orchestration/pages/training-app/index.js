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
const idoSDKState = null; //localStorage.getItem('idoSDKState'); // get serialized state from local storage - supports IDV flow

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
    let idoResponse = await ido.startJourney(journeyId, {
      additionalParams: {
        foo: 'bar',
      },
    });
    pageUtils.hideLoading();

    // Handle journey response (loop until journey is done)
    const inJourney = true;
    while (inJourney) {
      const journeyStepId = idoResponse?.journeyStepId;
      let clientResponse = null;

      switch (journeyStepId) {
        case IdoJourneyActionType.Information:
          clientResponse = await showInformation(idoResponse?.data);
          break;
        case IdoJourneyActionType.Success:
          return handleJourneySuccess(idoResponse);
        default:
          throw new Error(`Unknown journey step id: ${journeyStepId}`);
      }

      // Handle client response
      if (clientResponse !== null) {
        idoResponse = await ido.submitClientResponse(clientResponse.option, clientResponse.data);
      }
    }
  } catch (error) {
    handleError(error);
  }
}

// Show form
async function showForm(/*actionData, responseOptions*/) {
  return new Promise((resolve /*reject*/) => {
    // optionally add form title and text here

    // Handle form submission
    document.getElementById('some_form').addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      // output as an object
      console.log(Object.fromEntries(formData));

      pageUtils.hide('some_form');
      // resolve here...
      resolve();
    });

    // Show form
    pageUtils.show('some_form');
  });
}

// Information action UI
async function showInformation(actionData) {
  return new Promise((resolve /*reject*/) => {
    function submit() {
      pageUtils.hide('information_form');
      pageUtils.hide('action_response_error');
      // resolve here...
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: {},
      });
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
    document.querySelector('#information_form_button').addEventListener('click', submit);
  });
}
