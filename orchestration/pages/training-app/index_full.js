import { pageUtils } from '../../../shared/pageUtils.js';
import { getJourneyId, handleError, handleJourneySuccess, resetUI } from './training_utils.js';
import { ClientResponseOptionType, IdoJourneyActionType } from '../sdk_interface.js';
import { initSdk } from './init_full.js';

// Register event handlers for buttons
document.querySelector('#start_journey_button').addEventListener('click', onClick);

function onClick() {
  resetUI();
  startJourney();
}

let sdk = null;
let ido = null;
const idoSDKState = localStorage.getItem('idoSDKState');

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

  try {
    // start journey
    let idoResponse = null;
    if (!idoSDKState) {
      pageUtils.showLoading();
      idoResponse = await ido.startJourney(journeyId, {
        flow_id: 'training-app-flow-id',
        additionalParams: {
          idv_redirect_url: window.location.origin + window.location.pathname,
        },
      });
      pageUtils.hideLoading();
    } else {
      idoResponse = ido.restoreFromSerializedState(idoSDKState);
    }

    let inJourney = true;
    while (inJourney) {
      const stepId = idoResponse.journeyStepId;
      const actionData = idoResponse.data;
      const responseOptions = idoResponse.clientResponseOptions;
      let clientInput = null;

      // Handle journey response
      switch (stepId) {
        case IdoJourneyActionType.Information:
          clientInput = await showInformation(actionData);
          break;
        case IdoJourneyActionType.IdentityVerification:
          clientInput = await handleIdentityVerificationStep(actionData);
          break;
        case 'some_form':
          clientInput = await showForm(actionData, responseOptions);
          break;
        case IdoJourneyActionType.Success:
          handleJourneySuccess(idoResponse);
          localStorage.removeItem('idoSDKState'); // Clear SDK state
          inJourney = false;
          break;
        case IdoJourneyActionType.Rejection:
          throw new Error(`Journey rejected: ${actionData?.reason || 'No reason'}`);
        default:
          throw new Error(`Unknown stepId: ${stepId}`);
      }

      // submit input to journey and get next step
      if (clientInput !== null) {
        pageUtils.showLoading();
        pageUtils.hide('action_response_error');
        idoResponse = await ido.submitClientResponse(clientInput.option, clientInput.data);
        pageUtils.hideLoading();
      }
    }
  } catch (error) {
    handleError(error);
  }
}

// Information action UI
async function showInformation(actionData) {
  return new Promise((resolve /*reject*/) => {
    function submit() {
      pageUtils.hide('information_form');
      // resolve here...
      resolve({ option: ClientResponseOptionType.ClientInput, data: {} });
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

async function showForm(data, responseOptions) {
  return new Promise((resolve /*reject*/) => {
    // optionally add form title and text here
    pageUtils.updateElementText(
      'some_form_title',
      data?.app_data?.title || 'Empty title from server',
    );
    pageUtils.updateElementText('some_form_text', data?.app_data?.text || 'Empty text from server');

    // Handle form submission
    document.getElementById('some_form').addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      // output as an object
      console.log(Object.fromEntries(formData));

      pageUtils.hide('some_form');
      // resolve here...
      resolve({
        option: ClientResponseOptionType.ClientInput, // ClientInput is used to return user input
        data: Object.fromEntries(formData),
      });
    });

    function cancel() {
      pageUtils.hide('some_form');
      pageUtils.hide('action_response_error');
      // resolve here...
      resolve({
        option: ClientResponseOptionType.Cancel,
        data: {},
      });
    }

    if (responseOptions.has(ClientResponseOptionType.Cancel)) {
      // Cancel button event listener
      document.querySelector('#cancel_button').removeEventListener('click', cancel);
      document.querySelector('#cancel_button').addEventListener('click', cancel);
      pageUtils.show('cancel_button');
    } else {
      pageUtils.hide('cancel_button');
    }

    function custom_escape() {
      pageUtils.hide('some_form');
      pageUtils.hide('action_response_error');
      // resolve here...
      resolve({
        option: 'custom_escape',
        data: { foo: 'bar' },
      });
    }

    if (responseOptions.has('custom_escape')) {
      // Custom escape button event listener
      document.querySelector('#custom_escape_button').removeEventListener('click', custom_escape);
      document.querySelector('#custom_escape_button').addEventListener('click', custom_escape);
      pageUtils.show('custom_escape_button');
    } else {
      pageUtils.hide('custom_escape_button');
    }

    // Show form
    pageUtils.show('some_form');
  });
}

/*
 * handleIdentityVerificationStep is used to handle the Identity Verification step.
 * The function is called when the journey step id is 'identity_verification'.
 * The function checks if the journey step contains a sessionId.
 * If so, the function displays a success message.
 * Otherwise, the function checks if the journey step contains an endpoint.
 * If so, the function redirects the user to the endpoint.
 * Otherwise, the function throws an error.
 */
async function handleIdentityVerificationStep(actionData /*, responseOptions*/) {
  // Check if the journey step contains a sessionId and state
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('sessionId');
  const idvState = urlParams.get('state');

  let clientResponse = null;
  // Display success message if the journey step contains a sessionId and state
  if (sessionId) {
    clientResponse = await showInformation({
      title: 'Identity verification completed',
      text: 'You have successfully completed the identity verification step.',
    });
    clientResponse.data = { payload: { sessionId: sessionId, state: idvState } };
  } else {
    // Redirect to endpoint if the journey step contains an endpoint
    const endpoint = actionData?.payload?.endpoint;
    {
      if (endpoint) {
        // Before redirection to hosted Identity verification action,
        // serialize the ido sdk state
        localStorage.setItem('idoSDKState', ido.serializeState());
        window.location.href = endpoint;
      }
    }
  }
  return clientResponse;
}
