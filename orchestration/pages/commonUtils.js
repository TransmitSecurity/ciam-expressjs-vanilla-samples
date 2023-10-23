import { tsPlatform } from '../../node_modules/orchestration/dist/web-sdk-ido.js'; // debug only
import { pageUtils } from '../../shared/pageUtils.js';
import { ClientResponseOptionType, IdoServiceResponseType } from './sdk_interface.js';

let sdk = null;

const DEFAULT_SDK_INIT_OPTIONS = {
  clientId: 'az8xbjlb1zbfot2husyw7qu0kb3qj074',
  serverPath: 'https://0dau9szmld2g6zq50g9i6.transmit.security',
  appId: 'default_application',
};

// Initialize the SDK
export async function initSdk(clientId, serverPath, appId, sdkOptions = {}) {
  if (!sdk) {
    await window.tsPlatform.initialize({
      clientId,
      webauthn: { serverPath: 'https://api.idsec-stg.com' },
    });
    await tsPlatform.initialize({
      clientId,
      ido: { serverPath, applicationId: appId },
      ...sdkOptions,
    });
    sdk = tsPlatform.ido;
  }
}

// Handle journey error
function showFatalError(error) {
  console.error(`Journey exited: ${error}`);
  pageUtils.updateElementText('action_response_error', error);
  pageUtils.show('action_response_error');
  pageUtils.show('journey_start');
}

// Start the journey
export async function executeJourney(
  journeyName,
  handleJourneyActionUI,
  additionalParams,
  restoreState,
  sdkInitOptions,
  sdkOptions,
) {
  // initialize SDK first time this is called
  const { clientId, serverPath, appId } = sdkInitOptions ?? DEFAULT_SDK_INIT_OPTIONS;
  await initSdk(clientId, serverPath, appId, sdkOptions);

  // Reset UI
  pageUtils.hide('journey_start');
  pageUtils.hide('journey_end_landing');
  pageUtils.hide('action_response_error');

  try {
    let idoResponse = null;
    if (!restoreState) {
      pageUtils.showLoading();
      idoResponse = await sdk.startJourney(journeyName, additionalParams);
      pageUtils.hideLoading();
    } else {
      idoResponse = sdk.restoreFromSerializedState(restoreState);
    }
    let inJourney = true;
    let uiResponse = null;

    while (inJourney) {
      // write to local store, non expired. Clean manually if needed
      localStorage.setItem(
        'serializedState',
        JSON.stringify({ state: sdk.serializeState(), expires: new Date().getTime() + 10 * 1000 }),
      );

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
          pageUtils.updateElementText('action_response_error', JSON.stringify(idoResponse));
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
  localStorage.removeItem('serializedState');
}

export async function showInformation(actionData) {
  return new Promise((resolve /*reject*/) => {
    function submit() {
      pageUtils.hide('information_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: { ...actionData?.data },
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
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#information_form_button').addEventListener('click', submit);
  });
}
