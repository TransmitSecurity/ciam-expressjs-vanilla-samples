import { pageUtils } from '../../shared/pageUtils.js';
import { IdoServiceResponseType, ClientResponseOptionType } from './sdk_interface.js';
// import { tsPlatform } from '../../node_modules/ido-sdk-web/web-sdk-ido.js'; // remove
// import { tsPlatform } from '../../node_modules/orchestration/dist/web-sdk-ido.js'; // remove

let sdk = null;

async function init(clientId, serverPath, appId) {
  if (!sdk) {
    sdk = window.tsPlatform.ido;
    await window.tsPlatform.initialize({ clientId, ido: { serverPath, applicationId: appId } });
    // await sdk.init(clientId, { serverPath, applicationId: appId });
    // sdk = tsPlatform.ido;
  }
}

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', startJourney);
document.querySelector('#start_journey_button').addEventListener('click', startJourney);

// Start the journey
async function startJourney() {
  // initialize SDK first time this is called
  await init('demo-client-id', 'https://ts1.tsec-stg.com', 'idosdk');

  // Reset UI
  pageUtils.hide('journey_start');
  pageUtils.hide('journey_end_landing');
  pageUtils.hide('action_response_error');

  try {
    pageUtils.showLoading();
    let idoResponse = await sdk.startJourney('skeleton', {
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
          console.log(`FlexID Server Error: ${idoResponse}`);
          pageUtils.updateElementText('action_response_error', idoResponse);
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
    case 'phone_input':
      clientResponse = await showPhoneForm(actionData, responseOptions);
      break;
    case 'otp_input':
      clientResponse = await showOtpForm(actionData, responseOptions);
      break;
    case 'kba_input':
      clientResponse = await showKbaForm(actionData, responseOptions);
      break;
    default:
      throw `Unexpectind action id: ${stepId}`;
  }

  return clientResponse;
}

// This function is tailored for displaying the 'phone_input' action
async function showPhoneForm() {
  return new Promise((resolve /*reject*/) => {
    function submitPhone() {
      const input_value = pageUtils.extractInputValue('phone_form_input');
      pageUtils.hide('phone_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: { phone: input_value },
      });
    }

    document.getElementById('phone_form_input').value = '';
    pageUtils.show('phone_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#phone_form_button').removeEventListener('click', submitPhone);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#phone_form_button').addEventListener('click', submitPhone);
  });
}

// This function is tailored for displaying the 'otp_input' action
async function showOtpForm(actionData) {
  return new Promise((resolve /*reject*/) => {
    function submitOtp() {
      const input_value = pageUtils.extractInputValue('otp_form_input');
      pageUtils.hide('otp_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: { otp: input_value },
      });
    }

    pageUtils.updateElementText(
      'otp_form_text',
      actionData?.app_data?.message || 'Empty message from server',
    );
    document.getElementById('otp_form_input').value = '';
    pageUtils.show('otp_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#otp_form_button').removeEventListener('click', submitOtp);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#otp_form_button').addEventListener('click', submitOtp);
  });
}

// This function is tailored for displaying the 'kba_input' action.
// MAY collect more than one Q/A
async function showKbaForm() {
  return new Promise((resolve /*reject*/) => {
    function submitKba() {
      const question_value = pageUtils.extractInputValue('kba_question_form_input');
      const answer_value = pageUtils.extractInputValue('kba_answer_form_input');
      pageUtils.hide('kba_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: {
          kba: [
            {
              question: question_value,
              answer: answer_value,
            },
          ],
        },
      });
    }
    function submitSkip() {
      pageUtils.hide('kba_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: 'skip_question_registration',
        data: {},
      });
    }

    document.getElementById('kba_question_form_input').value = '';
    document.getElementById('kba_answer_form_input').value = '';
    pageUtils.show('kba_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#kba_form_button').removeEventListener('click', submitKba);
    document.querySelector('#kba_skip_button').removeEventListener('click', submitSkip);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#kba_form_button').addEventListener('click', submitKba);
    document.querySelector('#kba_skip_button').addEventListener('click', submitSkip);
  });
}

// Handle journey error
function showFatalError(error) {
  console.error(`Journey exited: ${error}`);
  pageUtils.updateElementText('action_response_error', error);
  pageUtils.show('action_response_error');
  pageUtils.show('journey_start');
}
