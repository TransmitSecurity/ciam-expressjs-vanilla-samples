/* eslint-disable no-var */
/**
 * @enum
 * @description The enum for the log levels.
 */
export var LogLevel;
(function (LogLevel) {
  LogLevel[(LogLevel['Debug'] = 0)] = 'Debug';
  LogLevel[(LogLevel['Info'] = 1)] = 'Info';
  LogLevel[(LogLevel['Warning'] = 2)] = 'Warning';
  LogLevel[(LogLevel['Error'] = 3)] = 'Error';
})(LogLevel || (LogLevel = {}));
/**
 * @enum
 * @description The enum for the sdk error codes.
 */
export var ErrorCode;
(function (ErrorCode) {
  /**
   * @description The init options object is invalid.
   */
  ErrorCode['InvalidInitOptions'] = 'invalid_initialization_options';
  /**
   * @description The sdk is not initialized.
   */
  ErrorCode['NotInitialized'] = 'not_initialized';
  /**
   * @description There is no active Journey.
   */
  ErrorCode['NoActiveJourney'] = 'no_active_journey';
  /**
   * @description Unable to receive response from the server.
   */
  ErrorCode['NetworkError'] = 'network_error';
  /**
   * @description The client response to the Journey is not valid.
   */
  ErrorCode['ClientResponseNotValid'] = 'client_response_not_valid';
  /**
   * @description The server returned an unexpected error.
   */
  ErrorCode['ServerError'] = 'server_error';
  /**
   * @description The provided state is not valid for SDK state recovery.
   */
  ErrorCode['InvalidState'] = 'invalid_state';
})(ErrorCode || (ErrorCode = {}));
/**
 * @enum
 * @description The enum for the client response option types.
 */
export var ClientResponseOptionType;
(function (ClientResponseOptionType) {
  /**
   * @description Client response option type for client input.
   */
  ClientResponseOptionType['ClientInput'] = 'client_input';
  /**
   * @description Client response option type for cancelation branch in the Journey, used for canceling the current step.
   */
  ClientResponseOptionType['Cancel'] = 'cancel';
  /**
   * @description Client response option type for custom branch in the Journey, used for custom branching.
   */
  ClientResponseOptionType['Custom'] = 'custom';
})(ClientResponseOptionType || (ClientResponseOptionType = {}));
/**
 * @enum
 * @description The enum for the Journey step types.
 */
export var IdoServiceResponseType;
(function (IdoServiceResponseType) {
  /**
   * @description The Journey ended successfully.
   */
  IdoServiceResponseType['JourneySuccess'] = 'journey_success';
  /**
   * @description The Journey reached a step that requires client input.
   */
  IdoServiceResponseType['ClientInputRequired'] = 'client_input_required';
  /**
   * @description The current Journey step updated the client data or provided an error message.
   */
  IdoServiceResponseType['ClientInputUpdateRequired'] = 'client_input_update_required';
  /**
   * @description The Journey ended with explicit rejection.
   */
  IdoServiceResponseType['JourneyRejection'] = 'journey_rejection';
})(IdoServiceResponseType || (IdoServiceResponseType = {}));
/**
 * @enum
 * @description The enum for the Journey step ID, when the journey step is a known action and not a custom form.
 */
export var IdoJourneyActionType;
(function (IdoJourneyActionType) {
  /**
   * @description `journeyStepId` for a Rejection action.
   */
  IdoJourneyActionType['Rejection'] = 'action:rejection';
  /**
   * @description `journeyStepId` for an Information action.
   */
  IdoJourneyActionType['Information'] = 'action:information';
  /**
   * @description `journeyStepId` for a server side debugger breakpoint.
   */
  IdoJourneyActionType['DebugBreak'] = 'action:debug_break';
  /**
   * @description `journeyStepId` for a wait for Cross Session Message.
   */
  IdoJourneyActionType['WaitForAnotherDevice'] = 'action:wait_for_another_device';
  /**
   * @deprecated Use {@link IdoJourneyActionType.RegisterDeviceAction} instead.
   * @description `journeyStepId` for device crypto binding action.
   * This action is presented to the client side when the journey has a form with the ID `"action:crypto_binding_registration"`.
   * On submission of `clientResponse` - the SDK will generate a key and respond in the following format:
   * ```json
   * {
   *   "ts:idosdk:device": {
   *     "platform_device_key": "base64 encoded public key",
   *     "platform_device_id": "an opaque key ID",
   *   }
   * }
   * ```
   * The server should store the key and the ID for future device identity validation.
   */
  IdoJourneyActionType['CryptoBindingRegistration'] = 'action:crypto_binding_registration';
  /**
   * @deprecated
   * Use {@link IdoJourneyActionType.ValidateDeviceAction} instead.
   * @description `journeyStepId` for device crypto binding validation action.
   * This action is presented to the client side when the journey has a form with the ID `"action:crypto_binding_validation"`.
   * * On submission of `clientResponse` - the SDK will sign the challenge and respond in the following format:
   * ```json
   * {
   *   "ts:idosdk:device": {
   *     "signature": "base64 encoded signature",
   *     "platform_device_id": "an opaque key ID",
   *  }
   * }
   * ```
   */
  IdoJourneyActionType['CryptoBindingValidation'] = 'action:crypto_binding_validation';
  /**
   * @description `journeyStepId` for Register Device action.
   */
  IdoJourneyActionType['RegisterDeviceAction'] = 'transmit_platform_device_registration';
  /**
   * @description `journeyStepId` for Validate Device action.
   */
  IdoJourneyActionType['ValidateDeviceAction'] = 'transmit_platform_device_validation';
  /**
   * @description `journeyStepId` for WebAuthn registration action.
   * * This action is presented to the client side when the journey has an action with the ID `"action:webauthn_registration"`.
   *
   * Data received in `idoServiceResponse`:
   * These input parameters are the input to tsPlatform.webauthn.register()
   * ```json
   * {
   *  "data": {
   *    "username": "<USERNAME>",
   *    "display_name": "<DISPLAY_NAME>",
   *    "register_as_discoverable": <true|false>,
   *    "allow_cross_Platform_authenticators": <true|false>
   *  }
   * }
   * ```
   * Data to send with `submitClientResponse`:
   * The `webauthn_encoded_result` is the output of tsPlatform.webauthn.register()
   * ```json
   * {
   *   "webauthn_encoded_result": "<WEBAUTHN_ENCODED_RESULT_FROM_SDK>"
   * }
   * ```
   */
  IdoJourneyActionType['WebAuthnRegistration'] = 'action:webauthn_registration';
  /**
   * @description `journeyStepId` for DRS trigger action. (Risk Recommendation)
   *
   * Data received in `idoServiceResponse`:
   * These input parameters are the input to tsPlatform.drs.triggerActionEvent()
   * ```json
   * {
   *  "data": {
   *     "correlation_id": "a47ed80a-41f9-464a-a42f-fce775b6e446",
   *     "user_id": "user",
   *     "action_type": "login"
   *  },
   * }
   * ```
   * Data to send with `submitClientResponse`:
   * The `action_token` is the output of tsPlatform.drs.triggerActionEvent()
   * ```json
   * {
   *  "action_token": "<DRS action token>"
   *}
   * ```
   */
  IdoJourneyActionType['DrsTriggerAction'] = 'action:drs_trigger_action';
  /**
   * @description `journeyStepId` for Identity Verification action.
   *
   * Data received in `idoServiceResponse`:
   * ```json
   * {
   *  "data": {
   *    "payload": {
   *      "endpoint": "<endpoint to redirect>",
   *      "state": "<state>",
   *      "session": "<session>"
   *      },
   *    }
   * }
   * ```
   *
   * Data to send with `submitClientResponse`:
   * ```json
   * {
   *    "payload": {
   *      "sessionId": "<sessionId>",
   *      "state": "<state>"
   *    },
   * }
   * ```
   */
  IdoJourneyActionType['IdentityVerification'] = 'action:id_verification';
})(IdoJourneyActionType || (IdoJourneyActionType = {}));
