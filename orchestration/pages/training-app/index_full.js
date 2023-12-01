import { pageUtils } from '../../../shared/pageUtils.js';
import { getJourneyId, handleError, handleJourneySuccess, resetUI } from './training_utils.js';
import { ClientResponseOptionType, IdoJourneyActionType, IdoServiceResponseType } from '../sdk_interface.js';
import { initSdk } from './init_full.js';

// Register event handlers for buttons
document.querySelector('#start_journey_button').addEventListener('click', onClick);

function onClick() {
  resetUI();
  startJourney();
}

const sdk = await initSdk();
const ido = sdk.ido;


async function startJourney() {

  if (!ido) {
    handleError('IDO is not initialized');
    return;
  }

  // Start the journey...
  const journeyId = getJourneyId();

  try {
    // start journey
    pageUtils.showLoading();
    let idoResponse = await ido.startJourney(journeyId, {
      flow_id: 'training-app-flow-id',
      additionalParams: {
        foo: 'bar',
      },
    });

    let inJourney = true;
    while (inJourney) {
      pageUtils.hideLoading();

      if (idoResponse.type === IdoServiceResponseType.JourneySuccess) {
        handleJourneySuccess(idoResponse);
        inJourney = false;
        return;
      }

      if (idoResponse.type === IdoServiceResponseType.JourneyRejection) {
        throw new Error(`Journey rejected: ${idoResponse.data?.reason || 'No reason'}`);
      }

      const stepId = idoResponse.journeyStepId;
      const actionData = idoResponse.data;
      let clientInput = null;

      // Handle journey response
      switch (stepId) {
        case IdoJourneyActionType.Information:
          clientInput = await showInformation(actionData);
          break;
        case IdoJourneyActionType.Success:
          handleJourneySuccess(idoResponse);
          inJourney = false;
          break;
        case IdoJourneyActionType.Rejection:
          throw new Error(`Journey rejected: ${actionData?.reason || 'No reason'}`);
        default:
          console.error(`Unknown stepId: ${stepId}`);
          inJourney = false;
          break;
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