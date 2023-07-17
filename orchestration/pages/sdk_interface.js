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
// eslint-disable-next-line no-var
export var IdoJourneyActionType;
(function (IdoJourneyActionType) {
  IdoJourneyActionType['Rejection'] = 'action:rejection';
  IdoJourneyActionType['Information'] = 'action:information';
  IdoJourneyActionType['DebugBreak'] = 'action:debug_break';
})(IdoJourneyActionType || (IdoJourneyActionType = {}));
