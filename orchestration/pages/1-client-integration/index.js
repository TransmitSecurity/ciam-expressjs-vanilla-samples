import { executeJourney } from '../commonUtils.js';
import { IdoJourneyActionType, ClientResponseOptionType } from '../sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

// Start the journey
function onClick() {
  executeJourney(
    'sample_info_journey',
    handleJourneyActionUI,
    {
      flowId: 'my_external_session_tracking_id',
      additionalParams: {},
    },
    undefined,
    {
      clientId: 'demo-client-id',
      serverPath: 'https://appclips.poc.transmit-field.com',
      appId: 'idosdk',
    },
  );
}

// Handle the journey information action
async function handleJourneyActionUI(idoResponse) {
  const actionData = idoResponse?.data;
  const stepId = idoResponse?.journeyStepId;

  console.debug(`handle journey action ${stepId}`);
  let clientResponse = null;

  switch (stepId) {
    case IdoJourneyActionType.Information:
      // handle new journey step
      clientResponse = new Promise(resolve => {
        // Present provided information in UI or handle programmatically. E.g. use alert for presentation:
        alert(`Data from IDO server: ${JSON.stringify(actionData)}`);
        // Return an empty client input
        resolve({
          option: ClientResponseOptionType.ClientInput,
          data: {},
        });
      });
      break;
    default:
      throw `Step id ${stepId} not implemented`;
  }

  return clientResponse;
}
