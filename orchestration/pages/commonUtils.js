import { tsPlatform } from './web-sdk-ido.js'; // debug only
import { pageUtils } from '../../shared/pageUtils.js';
import { ClientResponseOptionType, IdoServiceResponseType } from './sdk_interface.js';
import { startDynamicForm, createDynamicFormUI } from './dynamic_form.js';

let sdk = null;

export const DEFAULT_SDK_INIT_OPTIONS = {
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
      drs: { serverPath: 'https://collect.riskid-stg.io' },
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
  pageUtils.show('journey_end_landing');
  removeDynamicFormUI();
  pageUtils.hideLoading();
}

// Add dynamic form to the page
function addDynamicFormUI(df_div) {
  const journey_container_id = 'journey_container';
  removeDynamicFormUI(journey_container_id);
  const rootDiv = document.getElementById(journey_container_id);
  for (const child of rootDiv.children) {
    try {
      if (child.id) {
        pageUtils.hide(child.id);
      }
    } catch (ex) {
      console.error(ex);
    }
  }
  rootDiv.appendChild(df_div);
  pageUtils.hide('action_response_error');
  pageUtils.show(df_div.id);
}

// Remove dynamic form from the page
function removeDynamicFormUI() {
  try {
    const journey_container_id = 'journey_container';
    const rootDiv = document.getElementById(journey_container_id);
    const dynamic_form = document.getElementById('dynamic_form_body');
    if (dynamic_form && rootDiv) {
      rootDiv.removeChild(dynamic_form);
    }
  } catch (ex) {
    console.log(ex);
  }
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
      pageUtils.updateElementText('journey_id', `Journey Id: '${journeyName}'`);
      idoResponse = await sdk.startJourney(journeyName, additionalParams);
      const debugPin = await sdk.generateDebugPin();
      pageUtils.updateElementText('debug_pin', `Debug pin: ${debugPin}`);
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
        JSON.stringify({ state: sdk.serializeState(), expires: new Date().getTime() + 60 * 1000 }),
      );

      switch (idoResponse.type) {
        case IdoServiceResponseType.ClientInputRequired:
        case IdoServiceResponseType.ClientInputUpdateRequired:
          if (idoResponse.data?.app_data?.type == 'dynamic_form') {
            const df_div = createDynamicFormUI(idoResponse.data?.app_data);
            addDynamicFormUI(df_div);
            uiResponse = await startDynamicForm();
            removeDynamicFormUI();
          } else {
            uiResponse = await handleJourneyActionUI(idoResponse);
          }
          pageUtils.showLoading();
          pageUtils.hide('action_response_error');
          idoResponse = await sdk.submitClientResponse(uiResponse.option, uiResponse.data);
          pageUtils.hideLoading();
          break;
        case IdoServiceResponseType.JourneyRejection:
          console.log('FlexID Server Error: ', idoResponse);
          pageUtils.hideLoading();
          pageUtils.updateElementText('action_response_error', JSON.stringify(idoResponse));
          pageUtils.show('action_response_error');
          pageUtils.show('journey_start');
          removeDynamicFormUI();
          inJourney = false;
          break;
        case IdoServiceResponseType.JourneySuccess:
          inJourney = false;
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

export function flowId() {
  return `orc_${Math.floor(Math.random() * 1000000000)}`;
}

export async function showAuthentication(actionData) {
  return new Promise((resolve /*reject*/) => {
    async function submit() {
      const webauthn_encoded_result = await window.tsPlatform.webauthn.authenticate.modal(
        actionData.idoResponse.data.username,
      );
      pageUtils.hide('authentication_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: ClientResponseOptionType.ClientInput,
        data: {
          webauthn_encoded_result,
          type: 'webauthn',
        },
      });
    }

    function escape(escapeId) {
      pageUtils.hide('authentication_form');
      pageUtils.hide('action_response_error');
      resolve({
        option: escapeId,
        data: {},
      });
    }

    pageUtils.updateElementText(
      'authentication_form_title',
      actionData?.title || 'Empty title from server',
    );
    pageUtils.updateElementText(
      'authentication_form_text',
      actionData?.text || 'Empty text from server',
    );
    pageUtils.updateElementText('authenticate_button', actionData?.button_text || 'OK');
    pageUtils.show('authentication_form');

    // clear all handlers, this handles multiple runs of the same action
    document.querySelector('#authenticate_button').removeEventListener('click', submit);

    // Handle input field and main submit
    // eslint-disable-next-line no-unused-vars
    document.querySelector('#authenticate_button').addEventListener('click', submit);

    actionData.idoResponse.clientResponseOptions.forEach(option => {
      if (option.type === 'custom' || option.type === 'cancel') {
        const escapeButton = document.getElementById(option.id);
        if (!escapeButton) {
          const escapeButton = document.createElement('button');
          escapeButton.id = option.id;
          escapeButton.textContent = option.label || option.id;
          escapeButton.className = 'full-width';
          escapeButton.removeEventListener('click', () => escape(option.id));
          escapeButton.addEventListener('click', () => escape(option.id));
          document.querySelector('#authentication_form > div').appendChild(escapeButton);
        } else {
          escapeButton.removeEventListener('click', () => escape(option.id));
          escapeButton.addEventListener('click', () => escape(option.id));
        }
      }
    });
  });
}
