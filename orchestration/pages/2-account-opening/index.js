import { pageUtils } from '../../../shared/pageUtils.js';
import { showInformation, executeJourney } from '../commonUtils.js';
import { ClientResponseOptionType, IdoJourneyActionType } from '../sdk_interface.js';

import {
  urlParams,
  idoSDKState,
  JOURNEY_NAME,
  JOURNEY_ADDITIONAL_PARAMS,
  idoSDKInitOptions,
  otherModulesInitOptions,
} from './init.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', clearClientState);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

if (idoSDKState) {
  executeJourney(
    JOURNEY_NAME, // journey name
    newJourneyStepHandler, // journey step handler implemented here
    JOURNEY_ADDITIONAL_PARAMS, // additional journey parameters: flow_id and journey params
    idoSDKState, // serialized state to resume work on already started journey
    idoSDKInitOptions, // ido sdk init options
    otherModulesInitOptions, // other modules init options. Used here to support webAuthN registration
  );
}

// Provide UI implementation for the journey start button
function onClick() {
  executeJourney(
    JOURNEY_NAME, // journey name
    newJourneyStepHandler, // journey step handler implemented here
    JOURNEY_ADDITIONAL_PARAMS, // additional journey parameters: flow_id and journey params
    null, // No valid state found, parameter ignored
    idoSDKInitOptions, // ido sdk init options
    otherModulesInitOptions, // other modules init options. Used here to support webAuthN registration
  );
}

function clearClientState() {
  if (idoSDKState) {
    localStorage.removeItem('serializedState');
  }
  if (urlParams.get('start_enhanced') || urlParams.get('sessionId')) {
    window.location.href = './index.html?start_enhanced=true';
  } else {
    window.location.href = './index.html';
  }
}

const BreakValidationLoop = {};

// Provide UI implementation for the journey steps
async function newJourneyStepHandler(idoResponse) {
  const actionData = idoResponse.data; // actionData is the data returned by the journey step
  const stepId = idoResponse.journeyStepId; // stepId is the id of the journey step
  const responseOptions = idoResponse.clientResponseOptions; // responseOptions is a map of response options
  let clientResponse = null;

  switch (stepId) {
    case 'user_details': {
      // Handle user details collection form
      clientResponse = await FullUserDetailsForm(actionData.app_data, responseOptions);
      break;
    }
    case IdoJourneyActionType.Information: {
      // Handle information step
      clientResponse = await showInformation(actionData, responseOptions);
      break;
    }
    case IdoJourneyActionType.DebugBreak:
      clientResponse = await showInformation({
        title: 'Breakpoint',
        text: 'Journey is holding on breakpoint',
      });
      break;

    // Cases used in enhanced flow only

    case IdoJourneyActionType.IdentityVerification:
      // Handle identity verification step
      clientResponse = await handleIdentityVerificationStep(actionData, responseOptions);
      break;
    case IdoJourneyActionType.WebAuthnRegistration:
      // Handle webauthn registration step
      clientResponse = await showInformation({
        title: 'Webauthn Register action',
        text: 'About to register a webauthn key',
      });
      clientResponse.data.webauthn_encoded_result = await window.tsPlatform.webauthn.register(
        actionData.username,
      );
      break;
    case IdoJourneyActionType.DrsTriggerAction:
      // Handle drs trigger action step
      // eslint-disable-next-line no-case-declarations
      const { actionToken } = await window.tsPlatform.drs.triggerActionEvent(
        actionData.action_type,
      );

      // Add code here to send the action and the received actionToken to your backend

      clientResponse = await showInformation({
        title: 'DRS Trigger Action',
        text: 'About to trigger a DRS action',
        data: { action_token: actionToken },
      });
      break;

    default: {
      // Handle unimplemented journey step
      throw new Error('Unimplemented journey step id');
    }
  }

  return clientResponse;
}

/*
 * FullUserDetailsForm is used to handle the User Details step.
 * The function is called when the journey step id is 'user_details',
 * displays a form to collect user details, and returns the user input.
 * If the user cancels the form, the function throws an error.
 * If the user input is invalid, the function displays an error message and re-displays the form.
 * If the user input is valid, the function hides the form and returns the user input.
 * The function is called recursively until the user cancels the form or the user input is valid.
 */
function FullUserDetailsForm(app_data /*, responseOptions*/) {
  return new Promise((resolve, reject) => {
    const user_input = {
      name: null,
      surname: null,
      email: null,
      phone: null,
    };

    // Reset input fields
    Object.keys(user_input).forEach(key => {
      const input_field = document.getElementById(key);
      if (input_field) {
        input_field.value = '';
        if (app_data[key]) {
          input_field.value = app_data[key];
          input_field.disabled = true; //disable field
        }
      }
      if (key == 'phone') {
        input_field.setAttribute(
          'onkeypress',
          'return event.charCode >= 48 && event.charCode <= 57',
        ); // only allow numbers
      }
    });

    // Set form text
    document.getElementById('account_opening_text').textContent = app_data.message;

    // Handle form submission
    const submitForm = () => {
      try {
        // Validate user input
        Object.keys(user_input).forEach(key => {
          // Check if field is empty
          const input_field = document.getElementById(key);
          if (isFieldEmpty(input_field)) {
            input_field.focus();
            throw BreakValidationLoop; // BreakValidationLoop is used to break out of the validation loop
          }
          // Store valid user input
          user_input[key] = input_field.value;
        });
      } catch (e) {
        if (e !== BreakValidationLoop) throw e; // re-throw unexpected errors
        return;
      }
      // Hide form
      pageUtils.hide('account_opening');
      // Return user input
      resolve({
        option: ClientResponseOptionType.ClientInput, // ClientInput is used to return user input
        data: user_input,
      });
    };

    // Handle form cancellation
    const cancelForm = () => {
      pageUtils.hide('account_opening');
      reject('Account opening cancelled.');
    };

    // clear all handlers, this allows multiple runs of the same action
    document.querySelector('#account_opening_button')?.removeEventListener('click', submitForm);
    document.querySelector('#account_opening_button')?.addEventListener('click', submitForm);

    document
      .querySelector('#account_opening_cancel_button')
      ?.removeEventListener('click', cancelForm);
    document.querySelector('#account_opening_cancel_button')?.addEventListener('click', cancelForm);

    // Show form
    pageUtils.show('account_opening');
  });
}

// Helper function to check if a field is empty
function isFieldEmpty(input_field) {
  return !(String(input_field?.value || '').trim() != '');
}

/*
 * This function is used to handle the Identity Verification step.
 * The function is called when the journey step id is 'identity_verification'.
 * The function checks if the journey step contains a sessionId.
 * If so, the function displays a success message.
 * Otherwise, the function checks if the journey step contains an endpoint.
 * If so, the function redirects the user to the endpoint.
 * Otherwise, the function throws an error.
 */

async function handleIdentityVerificationStep(actionData /*, responseOptions*/) {
  // Check if the journey step contains a sessionId and state
  const sessionId = urlParams.get('sessionId');
  const idvState = urlParams.get('state');

  let clientResponse = null;
  // Display success message if the journey step contains a sessionId and state
  if (sessionId) {
    clientResponse = await showInformation({
      title: 'Identity verification Action',
      text: 'Identity verification action finished successfully',
      data: { payload: { sessionId, state: idvState } },
    });
  } else {
    // Redirect to endpoint if the journey step contains an endpoint
    const {
      payload: { endpoint },
    } = actionData ?? { payload: {} };
    if (endpoint) {
      // Before redirection to hosted Identity verification action, serialize the state and store it in local storage with 5 minutes expiry.
      localStorage.setItem(
        'serializedState',
        JSON.stringify({
          state: window.tsPlatform.ido.serializeState(),
          expires: new Date().getTime() + 300 * 1000,
        }),
      );
      // Redirect to hosted identity verification flow
      window.location.href = endpoint;
      clientResponse = await showInformation({
        title: 'Identity verification Action',
        text: 'Being redirected to hosted Identity verification action',
      });
    }
  }
  return clientResponse;
}
