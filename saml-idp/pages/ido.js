import {
  executeJourney,
  showInformation,
  DEFAULT_SDK_INIT_OPTIONS,
} from '../../orchestration/pages/commonUtils.js';
import { IdoJourneyActionType } from '../../orchestration/pages/sdk_interface.js';

// Register event handlers for buttons
document.querySelector('#restart_journey_button').addEventListener('click', onClick);
document.querySelector('#start_journey_button').addEventListener('click', onClick);

const JOURNEY_NAME = 'ido-idp';
const JOURNEY_ADDITIONAL_PARAMS = {
  flowId: 'my_external_session_tracking_id',
  additionalParams: {
    username: 'avihai-myslyuk apatoff7',
    service_provider_id: window.env.VITE_TS_SERVICE_PROVIDER_ID,
  },
};

const state = localStorage.getItem('serializedState');
const parsedState = state ? JSON.parse(state) : null;
if (parsedState && parsedState.expires > new Date().getTime()) {
  runJourney(parsedState.state);
} else {
  localStorage.removeItem('serializedState');
}

// Run the journey or resume it if state is provided
async function runJourney(state = null) {
  const idoInitParams = DEFAULT_SDK_INIT_OPTIONS;
  idoInitParams.clientId = window.env.VITE_TS_CLIENT_ID;

  const idoResponse = await executeJourney(
    JOURNEY_NAME, // journey name
    handleJourneyActionUI, // journey step handler implemented here
    JOURNEY_ADDITIONAL_PARAMS, // additional journey parameters: flow_id and journey params
    state, // state is null if we start a new journey
    idoInitParams, // ido sdk init options
    {
      webauthn: {
        serverPath: 'https://api.idsec-stg.com',
      },
    }, // add specific init options for webauthn module
  );

  console.log(idoResponse);
  if (!idoResponse.token) {
    throw Error('Journey failed to complete with user access token.');
  }

  try {
    const decodedToken = parseJwt(idoResponse.token);
    const b64_saml_response_html = decodedToken.saml;
    const saml_response_html = decodeB64SamlResponse(b64_saml_response_html);
    const saml_response = new DOMParser().parseFromString(saml_response_html, 'text/html');
    document.documentElement.innerHTML = saml_response.documentElement.innerHTML;
    //submit form
    document.querySelector('#f').submit();
    console.log(saml_response);
  } catch (error) {
    console.error(error);
    throw Error('Failed to parse access token.');
  }
}

function decodeB64SamlResponse(b64_saml_response) {
  const b64_saml_response_decoded = window.atob(b64_saml_response);
  const char_code_array = Uint8Array.from(b64_saml_response_decoded, c => c.charCodeAt(0));
  const char_code_string = String.fromCharCode.apply(null, char_code_array);
  const res = decodeURIComponent(encodeURI(window.atob(char_code_string)));
  return res;
}

function onClick() {
  runJourney();
}

// Handle the journey information action
async function handleJourneyActionUI(idoResponse) {
  const actionData = idoResponse?.data;
  const stepId = idoResponse?.journeyStepId;
  const responseOptions = idoResponse?.clientResponseOptions || new Map();

  console.debug(`handle journey action ${stepId}`);
  let clientResponse = null;

  switch (stepId) {
    case 'auth_webauthn': {
      // This is the step id of the webauthn authentication step
      clientResponse = await showInformation({
        title: 'Webauthn Authenticate action',
        text: 'About to authenticate with a webauthn key',
      });
      await window.WebAuthnSdk.preparePasskeyAuthentication();
      window.pageUtils.enable('passkeyInput');
      window.pageUtils.hideLoading();
      const code = await window.WebAuthnSdk.executePasskeyAuthentication();
      window.pageUtils.showLoading();
      clientResponse.data.auth_code = code;
      break;
    }
    case IdoJourneyActionType.Information:
      clientResponse = await showInformation(actionData, responseOptions);
      break;
    case IdoJourneyActionType.DebugBreak:
      clientResponse = await showInformation({
        title: 'Breakpoint',
        text: 'Journey is holding on breakpoint',
      });
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
    default:
      throw `Step id ${stepId} not implemented`;
  }

  return clientResponse;
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}
