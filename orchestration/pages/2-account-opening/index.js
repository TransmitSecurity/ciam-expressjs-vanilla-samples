import { showInformation, executeJourney } from '../commonUtils.js';
import { ClientResponseOptionType, IdoJourneyActionType } from '../sdk_interface.js';
// import { tsPlatform } from '../../node_modules/orchestration/dist/web-sdk-ido.js'; // debug only

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'account_opening';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: 'my_external_session_tracking_id',
  additionalParams: {},
};

// Check if there is a serialized state in local storage and if it is still valid
// If so, continue the journey from the last step
const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
if (parsedState && parsedState.expires > new Date().getTime()) {
  executeJourney(JOURNEY_NAME, newJourneyStepHandler, JOURNEY_ADDITIONAL_PARAMS, parsedState.state);
} else {
  localStorage.removeItem('serializedState');
}

function onClick() {
  executeJourney(JOURNEY_NAME, newJourneyStepHandler, JOURNEY_ADDITIONAL_PARAMS, undefined);
}

async function newJourneyStepHandler(idoResponse) {
  const actionData = idoResponse.data;
  const stepId = idoResponse.journeyStepId;
  const responseOptions = idoResponse.clientResponseOptions;

  console.debug(`handle journey action ${stepId}`);
  let clientResponse = null;

  switch (stepId) {
    case 'account_opening': {
      // handle new journey step
      clientResponse = await handleAccountOpeningForm(actionData.app_data, responseOptions);
      break;
    }
    case IdoJourneyActionType.Information: {
      // handle new journey step
      clientResponse = await showInformation(actionData, responseOptions);
      break;
    }
    default: {
      throw new Error('Unimplemented journey step id');
    }
  }

  return clientResponse;
}

// Step 7: Provide UI implementation for the user Id and phone collection form
function handleAccountOpeningForm(app_data, responseOptions) {
  return new Promise(resolve => {
    // Reset input fields
    document.getElementById('user_id_input').value = '';
    document.getElementById('phone_input').value = '';
    document.getElementById('phone_input').maxLength = app_data.phone_max_length;

    // Set form instructions
    document.getElementById('account_opening_text').textContent = app_data.instructions;

    // Handle input field and main submit
    document.querySelector('#account_opening_button')?.addEventListener(
      'click',
      () => {
        const phone_value = document.getElementById('phone_input').value; // collect phone
        const user_id_value = document.getElementById('user_id_input').value; // collect user Id
        document.getElementById('account_opening').style.display = 'none';
        resolve({
          option: ClientResponseOptionType.ClientInput,
          data: { phone: phone_value, user_id: user_id_value },
        });
      },
      { once: true },
    );

    // Handle form cancellation
    if (responseOptions.has(ClientResponseOptionType.Cancel)) {
      document.querySelector('#account_opening_cancel_button')?.addEventListener(
        'click',
        () => {
          resolve({ option: ClientResponseOptionType.Cancel });
          document.getElementById('account_opening').style.display = 'none';
        },
        { once: true },
      );
    }
    document.getElementById('account_opening').style.display = 'block';
  });
}
