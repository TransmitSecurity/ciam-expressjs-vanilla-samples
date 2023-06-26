import { pageUtils } from '../../shared/pageUtils.js';
import {
  IdoServiceResponseType,
  ClientResponseOptionType,
} from '../../node_modules/ido-sdk-web/sdk_interface.js';

let sdk = null;

async function init(clientId, serverPath, appId) {
  if (!sdk) {
    sdk = window.tsPlatform.ido.sdk;
    await sdk.init(clientId, { serverPath, appId });
  }
}

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', startJourney);
document.querySelector('#start_journey_button').addEventListener('click', startJourney);

// Start the journey
async function startJourney() {
  // initialize SDK first time this is called
  await init('demo-client-id', 'https://demo.ido-service.io', 'demo-app');

  // Reset UI
  pageUtils.hide('journey_start');
  pageUtils.hide('journey_end_landing');
  pageUtils.hide('action_response_error');

  try {
    pageUtils.showLoading();
    let idoResponse = await sdk.startJourney('demo', {
      flowId: 'random',
      additionalParams: { username: 'John Doe' },
    });
    pageUtils.hideLoading();
    let inJourney = true;
    let uiResponse = null;

    while (inJourney) {
      switch (idoResponse.type) {
        case IdoServiceResponseType.ClientInputRequired:
        case IdoServiceResponseType.ClientInputUpdateRequired:
          uiResponse = await handleJourneyActionUI(idoResponse);
          pageUtils.showLoading();
          idoResponse = await sdk.submitClientResponse(uiResponse.option, uiResponse.data);
          pageUtils.hideLoading();
          break;
        case IdoServiceResponseType.JourneyRejection:
          console.log(`FlexID Server Error: ${idoResponse.getErrorMessage()}`);
          pageUtils.updateElementText('action_response_error', idoResponse.getErrorMessage());
          pageUtils.show('action_response_error');
          inJourney = false;
          break;
        case IdoServiceResponseType.JourneySuccess:
          inJourney = false;
          pageUtils.hide('action_response_error');
          break;
      }
    }

    // journey is complete
    console.log(`Journey Complete!`);
    pageUtils.show('journey_end_landing');
  } catch (error) {
    showFatalError(error);
  }
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
    case 'step1':
      clientResponse = await showStep1Form(actionData, responseOptions);
      break;
    default:
      throw `Unexpectind action id: ${stepId}`;
  }

  return clientResponse;
}

// This function is tailored for displaying the 'step1' action
async function showStep1Form(actionData, responseOptions) {
  return new Promise((resolve /*reject*/) => {
    function submitOtp() {
      const input_value = pageUtils.extractInputValue('intro_form_input');
      pageUtils.hide('action_intro_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: responseOptions.get(ClientResponseOptionType.ClientInput),
        data: { otp: input_value },
      });
    }

    pageUtils.updateElementText(
      'intro_form_text',
      actionData?.message || 'Empty message from server',
    );
    document.getElementById('intro_form_input').value = '';
    pageUtils.show('action_intro_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#intro_form_button').removeEventListener('click', submitOtp);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#intro_form_button').addEventListener('click', submitOtp);
  });
}

// Handle journey error
function showFatalError(error) {
  console.error(`Journey exited: ${error}`);
  pageUtils.updateElementText('action_response_error', error);
  pageUtils.show('action_response_error');
  pageUtils.show('journey_start');
}
