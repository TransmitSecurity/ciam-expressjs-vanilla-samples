/**
 * @enum
 * @description The enum for the log levels.
 */
// eslint-disable-next-line no-var
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
// eslint-disable-next-line no-var
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
// eslint-disable-next-line no-var
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
// eslint-disable-next-line no-var
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
// eslint-disable-next-line no-var
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
   * @description `journeyStepId` for device crypto binding action.
   * This action is presented to the client side when the journey has a form with the ID `"action:crypto_binding_registration"`.
   * On submission of `clientResponse` - the SDK will generate a key and respond in the following format:
   * ```json
   * {
   *   "ts:idosdk:device": {
   *     "platform_device_key": "base64 encoded public key",
   *     "platform_device_id": "an opaque key ID",
   *  }
   * ```
   * The server should store the key and the ID for future device identity validation.
   */
  IdoJourneyActionType['CryptoBindingRegistration'] = 'action:crypto_binding_registration';
})(IdoJourneyActionType || (IdoJourneyActionType = {}));
