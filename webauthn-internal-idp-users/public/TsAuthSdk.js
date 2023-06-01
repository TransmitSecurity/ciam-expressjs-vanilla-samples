(function (exports) {
  'use strict';

  /******************************************************************************
   Copyright ©2022 Transmit Security Incorporated. All rights reserved.
   Transmit Security and the Transmit Security logo are trademarks or registered
   trademarks of Transmit Security Incorporated. All other company and/or product
   names may be trademarks or registered trademarks of their owners. Information
   contained in this document is subject to change without notice.
   www.transmitsecurity.com
   ******************************************************************************/

  /******************************************************************************
   Copyright (c) Microsoft Corporation.

   Permission to use, copy, modify, and/or distribute this software for any
   purpose with or without fee is hereby granted.

   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
   OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   PERFORMANCE OF THIS SOFTWARE.
   ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };

  function __extends(d, b) {
    if (typeof b !== 'function' && b !== null)
      throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null');
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }

  var __assign = function () {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }

  function __values(o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
  }

  function __read(o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }

  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }

  var BaseSdk = (function () {
    function BaseSdk() {}
    BaseSdk.prototype.init = function (clientId, authUrl) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          if (!clientId) {
            throw new Error('clientId is required');
          }
          if (!authUrl) {
            throw new Error('authUrl is required');
          }
          return [2];
        });
      });
    };
    return BaseSdk;
  })();

  var SOCIALS_LOGIN_FLOW = ['google', 'facebook', 'apple', 'line'];

  var DEFAULT_CLAIMS_OBJECT = { id_token: { roles: null } };

  var socialLogin = function (_a) {
    var authUrl = _a.authUrl,
      flow = _a.flow,
      clientId = _a.clientId,
      redirectUri = _a.redirectUri,
      requireMfa = _a.requireMfa;
    return __awaiter(void 0, void 0, void 0, function () {
      var urlParams;
      return __generator(this, function (_b) {
        urlParams = new URLSearchParams(
          JSON.stringify({
            require_mfa: requireMfa,
            client_id: clientId,
            redirect_uri: redirectUri,
            create_new_user: true,
            claims: DEFAULT_CLAIMS_OBJECT,
          }),
        );
        fetch(''.concat(authUrl, 'v1/auth/').concat(flow, '?').concat(urlParams.toString()), {
          method: 'GET',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
        });
        return [2];
      });
    });
  };

  var OauthSdkImpl = (function (_super) {
    __extends(OauthSdkImpl, _super);
    function OauthSdkImpl() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    OauthSdkImpl.prototype.init = function (clientId, authUrl, options) {
      return __awaiter(this, void 0, void 0, function () {
        var requireMfa;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, _super.prototype.init.call(this, clientId, authUrl)];
            case 1:
              _a.sent();
              requireMfa = (options !== null && options !== void 0 ? options : {}).requireMfa;
              SOCIALS_LOGIN_FLOW.forEach(function (flow) {
                _this[flow] = function (_a) {
                  var redirectUri = _a.redirectUri;
                  return socialLogin({
                    authUrl: authUrl,
                    flow: flow,
                    clientId: clientId,
                    redirectUri: redirectUri,
                    requireMfa: !!requireMfa,
                  });
                };
              });
              return [2];
          }
        });
      });
    };
    return OauthSdkImpl;
  })(BaseSdk);

  var passwordLogin = function (_a) {
    var authUrl = _a.authUrl,
      clientId = _a.clientId,
      username = _a.username,
      password = _a.password,
      redirectUri = _a.redirectUri,
      requireMfa = _a.requireMfa;
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4,
              fetch(''.concat(authUrl, 'v1/auth/password/login'), {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  username: username,
                  password: password,
                  require_mfa: requireMfa,
                  client_id: clientId,
                  redirect_uri: redirectUri,
                  claims: DEFAULT_CLAIMS_OBJECT,
                }),
              }),
            ];
          case 1:
            response = _b.sent();
            return [2, response.json()];
        }
      });
    });
  };
  var resetPassword = function (_a) {
    var authUrl = _a.authUrl,
      resetToken = _a.resetToken,
      newPassword = _a.newPassword;
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4,
              fetch(''.concat(authUrl, 'v1/auth/password/reset'), {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  reset_token: resetToken,
                  new_password: newPassword,
                }),
              }),
            ];
          case 1:
            response = _b.sent();
            return [2, response.json()];
        }
      });
    });
  };

  var PasswordsSdkImpl = (function (_super) {
    __extends(PasswordsSdkImpl, _super);
    function PasswordsSdkImpl() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    PasswordsSdkImpl.prototype.init = function (clientId, authUrl, options) {
      return __awaiter(this, void 0, void 0, function () {
        var requireMfa;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, _super.prototype.init.call(this, clientId, authUrl)];
            case 1:
              _a.sent();
              requireMfa = (options !== null && options !== void 0 ? options : {}).requireMfa;
              this.login = function (_a) {
                var username = _a.username,
                  password = _a.password,
                  redirectUri = _a.redirectUri;
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        return [
                          4,
                          passwordLogin({
                            authUrl: authUrl,
                            username: username,
                            password: password,
                            redirectUri: redirectUri,
                            clientId: clientId,
                            requireMfa: !!requireMfa,
                          }),
                        ];
                      case 1:
                        result = _b.sent();
                        return [2, result];
                    }
                  });
                });
              };
              this.resetPassword = function (_a) {
                var resetToken = _a.resetToken,
                  newPassword = _a.newPassword;
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        return [
                          4,
                          resetPassword({
                            authUrl: authUrl,
                            resetToken: resetToken,
                            newPassword: newPassword,
                          }),
                        ];
                      case 1:
                        result = _b.sent();
                        return [2, result];
                    }
                  });
                });
              };
              return [2];
          }
        });
      });
    };
    return PasswordsSdkImpl;
  })(BaseSdk);

  var createSamlResponse = function (_a) {
    var authUrl = _a.authUrl,
      userToken = _a.userToken,
      serviceProviderId = _a.serviceProviderId,
      samlRequest = _a.samlRequest,
      relayState = _a.relayState;
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4,
              fetch(''.concat(authUrl, 'v1/serviceprovider/saml2/').concat(serviceProviderId), {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(userToken),
                },
                body: JSON.stringify({
                  SAMLRequest: samlRequest,
                  RelayState: relayState,
                }),
              }),
            ];
          case 1:
            response = _b.sent();
            return [2, response.json()];
        }
      });
    });
  };

  var SamlSdkImpl = (function (_super) {
    __extends(SamlSdkImpl, _super);
    function SamlSdkImpl() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    SamlSdkImpl.prototype.init = function (clientId, authUrl) {
      return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, _super.prototype.init.call(this, clientId, authUrl)];
            case 1:
              _a.sent();
              this.createSamlResponse = function (_a) {
                var userToken = _a.userToken,
                  serviceProviderId = _a.serviceProviderId,
                  samlRequest = _a.samlRequest,
                  relayState = _a.relayState;
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        return [
                          4,
                          createSamlResponse({
                            authUrl: authUrl,
                            userToken: userToken,
                            serviceProviderId: serviceProviderId,
                            samlRequest: samlRequest,
                            relayState: relayState,
                          }),
                        ];
                      case 1:
                        result = _b.sent();
                        return [2, result];
                    }
                  });
                });
              };
              return [2];
          }
        });
      });
    };
    return SamlSdkImpl;
  })(BaseSdk);

  function sleep(ms) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }
  function symmetricDifference(arr1, arr2) {
    var set1 = new Set(arr1);
    var set2 = new Set(arr2);
    return __spreadArray(
      __spreadArray(
        [],
        __read(
          arr1.filter(function (x) {
            return !set2.has(x);
          }),
        ),
        false,
      ),
      __read(
        arr2.filter(function (x) {
          return !set1.has(x);
        }),
      ),
      false,
    );
  }

  var ErrorCode$1;
  (function (ErrorCode) {
    ErrorCode['NotInitialized'] = 'not_initialized';
    ErrorCode['MissingPrepareStep'] = 'missing_prepare_step';
    ErrorCode['RegistrationFailed'] = 'registration_failed';
    ErrorCode['AuthenticationFailed'] = 'authentication_failed';
    ErrorCode['InvalidAuthSession'] = 'invalid_auth_session';
    ErrorCode['InvalidApprovalData'] = 'invalid_approval_data';
    ErrorCode['Unknown'] = 'unknown';
    ErrorCode['InvalidPasskeysMediationType'] = 'invalid_passkeys_mediation_type';
    ErrorCode['AttachDeviceFailed'] = 'attach_device_failed';
    ErrorCode['DetachDeviceFailed'] = 'detach_device_failed';
    ErrorCode['UserCanceledWebAuthnRegistration'] = 'user_canceled_webauthn_registration';
    ErrorCode['PasskeyAuthenticationAborted'] = 'passkey_authentication_aborted';
  })(ErrorCode$1 || (ErrorCode$1 = {}));
  var PasskeysMediationType;
  (function (PasskeysMediationType) {
    PasskeysMediationType['InputAutofill'] = 'input-autofill';
    PasskeysMediationType['Modal'] = 'modal';
  })(PasskeysMediationType || (PasskeysMediationType = {}));

  var logger = {
    log: console.log,
    error: console.error,
  };

  function makeSdkRejection$1(errorCode, description, data) {
    if (description === void 0) {
      description = '';
    }
    return {
      errorCode: errorCode,
      description: description,
      data: data,
    };
  }
  function isSdkRejection$1(rejection) {
    return typeof rejection.errorCode === 'string' && typeof rejection.description === 'string';
  }

  var KeyPersistance;
  (function (KeyPersistance) {
    KeyPersistance[(KeyPersistance['persistent'] = 0)] = 'persistent';
    KeyPersistance[(KeyPersistance['session'] = 1)] = 'session';
  })(KeyPersistance || (KeyPersistance = {}));
  var SdkStorage = (function () {
    function SdkStorage() {}
    SdkStorage.get = function (keyName) {
      return (
        SdkStorage.getStorageMedium(SdkStorage.allowedKeys[keyName]).getItem(
          SdkStorage.getStorageKey(keyName),
        ) || undefined
      );
    };
    SdkStorage.set = function (keyName, value) {
      return SdkStorage.getStorageMedium(SdkStorage.allowedKeys[keyName]).setItem(
        SdkStorage.getStorageKey(keyName),
        value,
      );
    };
    SdkStorage.remove = function (keyName) {
      SdkStorage.getStorageMedium(SdkStorage.allowedKeys[keyName]).removeItem(
        SdkStorage.getStorageKey(keyName),
      );
    };
    SdkStorage.clear = function (retainConfiguration) {
      var e_1, _a;
      try {
        for (
          var _b = __values(Object.entries(SdkStorage.allowedKeys)), _c = _b.next();
          !_c.done;
          _c = _b.next()
        ) {
          var _d = __read(_c.value, 2),
            key = _d[0],
            keyPersistence = _d[1];
          var typedKey = key;
          if (
            (retainConfiguration && this.configurationKeys.includes(typedKey)) ||
            keyPersistence === KeyPersistance.persistent
          ) {
            continue;
          }
          SdkStorage.getStorageMedium(keyPersistence).removeItem(
            SdkStorage.getStorageKey(typedKey),
          );
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    };
    SdkStorage.getStorageKey = function (keyName) {
      return 'WebAuthnSdk:'.concat(keyName);
    };
    SdkStorage.getStorageMedium = function (keyPersistance) {
      switch (keyPersistance) {
        case KeyPersistance.session:
          return sessionStorage;
        default:
          return localStorage;
      }
    };
    SdkStorage.allowedKeys = {
      authSessionId: KeyPersistance.session,
      clientId: KeyPersistance.session,
      deviceBindingToken: KeyPersistance.session,
      deviceUsers: KeyPersistance.persistent,
    };
    SdkStorage.configurationKeys = ['clientId'];
    return SdkStorage;
  })();

  var NEW_API_PATH_PREFIX$1 = '/cis';
  var SdkBindIdApiClient = (function () {
    function SdkBindIdApiClient() {}
    SdkBindIdApiClient.dnsPrefetch = function (serverPath) {
      var hint = document.createElement('link');
      hint.rel = 'dns-prefetch';
      hint.href = serverPath;
      document.head.appendChild(hint);
    };
    SdkBindIdApiClient.preconnect = function (serverPath, crossOrigin) {
      var hint = document.createElement('link');
      hint.rel = 'preconnect';
      hint.href = serverPath;
      if (crossOrigin) {
        hint.crossOrigin = 'anonymous';
      }
      document.head.appendChild(hint);
    };
    SdkBindIdApiClient.warmupConnection = function (serverPath) {
      this.dnsPrefetch(serverPath);
      this.preconnect(serverPath, false);
      this.preconnect(serverPath, true);
    };
    SdkBindIdApiClient.init = function (options) {
      var _a, _b;
      try {
        this._serverPath = new URL(options.serverPath);
        if (
          this.newApiDomains.includes(
            (_a = this._serverPath) === null || _a === void 0 ? void 0 : _a.hostname,
          )
        ) {
          this.warmupConnection(this._serverPath.origin);
        }
        this._apiPaths =
          (_b = options.webauthnApiPaths) !== null && _b !== void 0 ? _b : this.getDefaultPaths();
      } catch (error) {
        throw makeSdkRejection$1(ErrorCode$1.NotInitialized, 'Invalid options.serverPath', {
          error: error,
        });
      }
    };
    SdkBindIdApiClient.sendRequest = function (path, request, metadata) {
      return __awaiter(this, void 0, void 0, function () {
        var deviceBindingToken, requestUrl, response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              logger.log('[WebAuthn SDK] Calling '.concat(request.method, ' ').concat(path, '...'));
              deviceBindingToken = SdkStorage.get('deviceBindingToken');
              requestUrl = new URL(this._serverPath);
              requestUrl.pathname = path;
              return [
                4,
                fetch(
                  requestUrl.toString(),
                  __assign(__assign({}, request), {
                    headers: __assign(
                      __assign(
                        __assign({}, request.headers),
                        metadata.authSessionId && {
                          'x-ts-flow-id': metadata.authSessionId,
                        },
                      ),
                      deviceBindingToken && {
                        'x-ts-device-binding-token': deviceBindingToken,
                      },
                    ),
                  }),
                ),
              ];
            case 1:
              response = _a.sent();
              if (response.headers.has('set-device-binding-token')) {
                SdkStorage.set(
                  'deviceBindingToken',
                  response.headers.get('set-device-binding-token'),
                );
              }
              return [2, response];
          }
        });
      });
    };
    SdkBindIdApiClient.startRestrictedSession = function (
      clientId,
      crossDeviceBindingMessage,
      approvalData,
      redirectUri,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.startRestrictedSession,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                      __assign(
                        __assign(
                          __assign(
                            { client_id: clientId },
                            crossDeviceBindingMessage && {
                              cross_device: {
                                binding_message: crossDeviceBindingMessage,
                              },
                            },
                          ),
                          approvalData && { approval_data: approvalData },
                        ),
                        redirectUri && { redirect_uri: redirectUri },
                      ),
                    ),
                  },
                  {},
                ),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.InvalidAuthSession,
                  'Failed to start restricted session',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkBindIdApiClient.startWebauthnRegistration = function (
      authSessionId,
      idpUsername,
      fidoUserDisplayName,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.startWebauthnRegistration,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      auth_session_id: authSessionId,
                      user: {
                        username: idpUsername,
                        display_name: fidoUserDisplayName,
                      },
                    }),
                  },
                  { authSessionId: authSessionId },
                ),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.RegistrationFailed,
                  'Failed to start register with status',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkBindIdApiClient.completeWebauthnRegistration = function (
      authSessionId,
      webauthnSessionId,
      encodedCredential,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.completeWebauthnRegistration,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      auth_session_id: authSessionId,
                      webauthn_session_id: webauthnSessionId,
                      public_key_credential: encodedCredential,
                    }),
                  },
                  { authSessionId: authSessionId },
                ),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.RegistrationFailed,
                  'Failed to complete registration with status',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkBindIdApiClient.startWebauthnAuthentication = function (authSessionId, idpUsername) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.startWebauthnAuthentication,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      auth_session_id: authSessionId,
                      username: idpUsername,
                    }),
                  },
                  { authSessionId: authSessionId },
                ),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.AuthenticationFailed,
                  'Failed to start authentication with status',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkBindIdApiClient.completeWebauthnAuthentication = function (
      authSessionId,
      webauthnSessionId,
      encodedCredential,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.completeWebauthnAuthentication,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      auth_session_id: authSessionId,
                      webauthn_session_id: webauthnSessionId,
                      public_key_credential: encodedCredential,
                    }),
                  },
                  { authSessionId: authSessionId },
                ),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.AuthenticationFailed,
                  'Failed to complete authentication with status',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkBindIdApiClient.getSessionStatus = function (authSessionId) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.getSessionStatus,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      auth_session_id: authSessionId,
                    }),
                  },
                  { authSessionId: authSessionId },
                ),
              ];
            case 1:
              response = _a.sent();
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkBindIdApiClient.attachDeviceToSession = function (authSessionId) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.attachDeviceToSession,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      auth_session_id: authSessionId,
                    }),
                  },
                  { authSessionId: authSessionId },
                ),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.AttachDeviceFailed,
                  'Failed to attach device with status',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkBindIdApiClient.detachDeviceFromSession = function (authSessionId) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.detachDeviceFromSession,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      auth_session_id: authSessionId,
                    }),
                  },
                  { authSessionId: authSessionId },
                ),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.DetachDeviceFailed,
                  'Failed to detach device with status',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [2, response.json()];
          }
        });
      });
    };
    SdkBindIdApiClient.startPasskeyAuthentication = function (authSessionId) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.startPasskeyAuthentication,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      auth_session_id: authSessionId,
                    }),
                  },
                  { authSessionId: authSessionId },
                ),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.AuthenticationFailed,
                  'Failed to start passkey with status',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkBindIdApiClient.completePasskeyAuthentication = function (
      authSessionId,
      webauthnSessionId,
      encodedCredential,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(
                  this._apiPaths.completePasskeyAuthentication,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      auth_session_id: authSessionId,
                      webauthn_session_id: webauthnSessionId,
                      public_key_credential: encodedCredential,
                    }),
                  },
                  { authSessionId: authSessionId },
                ),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.AuthenticationFailed,
                  'Failed to complete passkey with status',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkBindIdApiClient.getDefaultPaths = function () {
      var _a;
      var pathPrefix = this.newApiDomains.includes(
        (_a = this._serverPath) === null || _a === void 0 ? void 0 : _a.hostname,
      )
        ? NEW_API_PATH_PREFIX$1
        : '';
      return {
        startRestrictedSession: ''.concat(pathPrefix, '/v1/auth-session/start-restricted'),
        startWebauthnRegistration: ''.concat(pathPrefix, '/v1/webauthn/register/start'),
        completeWebauthnRegistration: ''.concat(pathPrefix, '/v1/webauthn/register/complete'),
        startWebauthnAuthentication: ''.concat(pathPrefix, '/v1/webauthn/authenticate/start'),
        completeWebauthnAuthentication: ''.concat(pathPrefix, '/v1/webauthn/authenticate/complete'),
        getSessionStatus: ''.concat(pathPrefix, '/v1/auth-session/status'),
        attachDeviceToSession: ''.concat(pathPrefix, '/v1/auth-session/attach-device'),
        detachDeviceFromSession: ''.concat(pathPrefix, '/v1/auth-session/detach-device'),
        startPasskeyAuthentication: ''.concat(
          pathPrefix,
          '/v1/webauthn/authenticate/passkey/start',
        ),
        completePasskeyAuthentication: ''.concat(
          pathPrefix,
          '/v1/webauthn/authenticate/passkey/complete',
        ),
      };
    };
    SdkBindIdApiClient.getApiPaths = function () {
      return this._apiPaths;
    };
    SdkBindIdApiClient.newApiDomains = [
      'api.idsec-dev.com',
      'api.idsec-stg.com',
      'api.transmitsecurity.io',
      'api.eu.transmitsecurity.io',
      'api.ca.transmitsecurity.io',
    ];
    return SdkBindIdApiClient;
  })();

  var DeviceUsers = (function () {
    function DeviceUsers() {}
    DeviceUsers.get = function () {
      var _a;
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
          return [
            2,
            JSON.parse((_a = SdkStorage.get('deviceUsers')) !== null && _a !== void 0 ? _a : '[]'),
          ];
        });
      });
    };
    DeviceUsers.persist = function (username) {
      return __awaiter(this, void 0, void 0, function () {
        var usersList;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, DeviceUsers.get()];
            case 1:
              usersList = _a.sent();
              usersList = usersList.map(function (deviceUser) {
                return { username: deviceUser.username, isCurrent: false };
              });
              usersList = __spreadArray(
                [{ username: username, isCurrent: true }],
                __read(
                  usersList.filter(function (deviceUser) {
                    return deviceUser.username !== username;
                  }),
                ),
                false,
              );
              SdkStorage.set('deviceUsers', JSON.stringify(usersList));
              return [2];
          }
        });
      });
    };
    DeviceUsers.remove = function (username) {
      return __awaiter(this, void 0, void 0, function () {
        var usersList;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, DeviceUsers.get()];
            case 1:
              usersList = _a.sent();
              usersList = usersList.filter(function (deviceUser) {
                return deviceUser.username !== username;
              });
              SdkStorage.set('deviceUsers', JSON.stringify(usersList));
              return [2];
          }
        });
      });
    };
    DeviceUsers.clear = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          SdkStorage.set('deviceUsers', '[]');
          return [2];
        });
      });
    };
    return DeviceUsers;
  })();

  var ErrorCode;
  (function (ErrorCode) {
    ErrorCode['NotInitialized'] = 'not_initialized';
    ErrorCode['AuthenticationFailed'] = 'authentication_failed';
    ErrorCode['AuthenticationCanceled'] = 'webauthn_authentication_canceled';
    ErrorCode['RegistrationFailed'] = 'registration_failed';
    ErrorCode['RegistrationCanceled'] = 'webauthn_registration_canceled';
    ErrorCode['AutofillAuthenticationAborted'] = 'autofill_authentication_aborted';
    ErrorCode['AuthenticationProcessAlreadyActive'] = 'authentication_process_already_active';
    ErrorCode['Unknown'] = 'unknown';
  })(ErrorCode || (ErrorCode = {}));
  var AuthenticationMediationType;
  (function (AuthenticationMediationType) {
    AuthenticationMediationType['InputAutofill'] = 'input-autofill';
    AuthenticationMediationType['Modal'] = 'modal';
  })(AuthenticationMediationType || (AuthenticationMediationType = {}));

  var EncodingUtils$1 = (function () {
    function EncodingUtils() {}
    EncodingUtils.arrayBufferToBase64 = function (buffer) {
      return btoa(
        String.fromCharCode.apply(String, __spreadArray([], __read(new Uint8Array(buffer)), false)),
      );
    };
    EncodingUtils.base64ToArrayBuffer = function (base64) {
      return Uint8Array.from(atob(base64), function (c) {
        return c.charCodeAt(0);
      });
    };
    EncodingUtils.stringToBase64 = function (str) {
      return btoa(str);
    };
    EncodingUtils.jsonToBase64 = function (json) {
      var res = JSON.stringify(json);
      return btoa(res);
    };
    EncodingUtils.base64ToString = function (str) {
      return atob(str);
    };
    EncodingUtils.base64ToJson = function (str) {
      var res = atob(str);
      return JSON.parse(res);
    };
    return EncodingUtils;
  })();

  function makeSdkRejection(errorCode, description, data) {
    if (description === void 0) {
      description = '';
    }
    return {
      errorCode: errorCode,
      description: description,
      data: data,
    };
  }
  function isSdkRejection(rejection) {
    return typeof rejection.errorCode === 'string' && typeof rejection.description === 'string';
  }

  var NEW_API_PATH_PREFIX = '/cis';
  var SdkApiClient = (function () {
    function SdkApiClient() {}
    SdkApiClient.dnsPrefetch = function (serverPath) {
      var hint = document.createElement('link');
      hint.rel = 'dns-prefetch';
      hint.href = serverPath;
      document.head.appendChild(hint);
    };
    SdkApiClient.preconnect = function (serverPath, crossOrigin) {
      var hint = document.createElement('link');
      hint.rel = 'preconnect';
      hint.href = serverPath;
      if (crossOrigin) {
        hint.crossOrigin = 'anonymous';
      }
      document.head.appendChild(hint);
    };
    SdkApiClient.warmupConnection = function (serverPath) {
      this.dnsPrefetch(serverPath);
      this.preconnect(serverPath, false);
      this.preconnect(serverPath, true);
    };
    SdkApiClient.init = function (options) {
      var _a, _b;
      try {
        this._serverPath = new URL(options.serverPath);
        if (
          this.newApiDomains.includes(
            (_a = this._serverPath) === null || _a === void 0 ? void 0 : _a.hostname,
          )
        ) {
          this.warmupConnection(this._serverPath.origin);
        }
        this._apiPaths =
          (_b = options.webauthnApiPaths) !== null && _b !== void 0 ? _b : this.getDefaultPaths();
      } catch (error) {
        throw makeSdkRejection(ErrorCode.NotInitialized, 'Invalid options.serverPath', {
          error: error,
        });
      }
    };
    SdkApiClient.getDefaultPaths = function () {
      var _a;
      var pathPrefix = this.newApiDomains.includes(
        (_a = this._serverPath) === null || _a === void 0 ? void 0 : _a.hostname,
      )
        ? NEW_API_PATH_PREFIX
        : '';
      return {
        startAuthentication: ''.concat(pathPrefix, '/v1/auth/webauthn/authenticate/start'),
        startRegistration: ''.concat(pathPrefix, '/v1/auth/webauthn/register/start'),
      };
    };
    SdkApiClient.getApiPaths = function () {
      return this._apiPaths;
    };
    SdkApiClient.sendRequest = function (path, request) {
      return __awaiter(this, void 0, void 0, function () {
        var requestUrl;
        return __generator(this, function (_a) {
          logger.log('[WebAuthn SDK] Calling '.concat(request.method, ' ').concat(path, '...'));
          requestUrl = new URL(this._serverPath);
          requestUrl.pathname = path;
          return [2, fetch(requestUrl.toString(), request)];
        });
      });
    };
    SdkApiClient.startRegistration = function (params) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(this._apiPaths.startRegistration, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    client_id: params.clientId,
                    username: params.username,
                    display_name: params.displayName,
                  }),
                }),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection(
                  ErrorCode.RegistrationFailed,
                  'Failed to start registration',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkApiClient.startAuthentication = function (params) {
      return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                this.sendRequest(this._apiPaths.startAuthentication, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    client_id: params.clientId,
                    username: params.username,
                  }),
                }),
              ];
            case 1:
              response = _a.sent();
              if (!(response === null || response === void 0 ? void 0 : response.ok)) {
                throw makeSdkRejection(
                  ErrorCode.AuthenticationFailed,
                  'Failed to start authentication',
                  response === null || response === void 0 ? void 0 : response.status,
                );
              }
              return [4, response.json()];
            case 2:
              return [2, _a.sent()];
          }
        });
      });
    };
    SdkApiClient.newApiDomains = [
      'api.idsec-dev.com',
      'api.idsec-stg.com',
      'api.transmitsecurity.io',
      'api.eu.transmitsecurity.io',
      'api.ca.transmitsecurity.io',
    ];
    return SdkApiClient;
  })();

  var AuthenticationHandler = (function () {
    function AuthenticationHandler() {}
    AuthenticationHandler.prototype.modal = function (username) {
      return __awaiter(this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [
                4,
                this.startAuthentication({
                  username: username,
                  mediationType: AuthenticationMediationType.Modal,
                }),
              ];
            case 1:
              result = _a.sent();
              return [2, EncodingUtils$1.jsonToBase64(result)];
            case 2:
              err_1 = _a.sent();
              throw this.getSdkError(err_1);
            case 3:
              return [2];
          }
        });
      });
    };
    AuthenticationHandler.prototype.activateAutofill = function (params) {
      var _this = this;
      var onSuccess = params.onSuccess,
        onError = params.onError,
        username = params.username;
      this.abortController = new AbortController();
      this.startAuthentication({
        username: username,
        mediationType: AuthenticationMediationType.InputAutofill,
      })
        .then(function (result) {
          onSuccess(EncodingUtils$1.jsonToBase64(result));
        })
        .catch(function (err) {
          var error = _this.getSdkError(err);
          if (!onError) throw error;
          onError(error);
        });
    };
    AuthenticationHandler.prototype.abortAutofill = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          if (this.abortController)
            this.abortController.abort(ErrorCode.AutofillAuthenticationAborted);
          return [2];
        });
      });
    };
    AuthenticationHandler.prototype.startAuthentication = function (params) {
      return __awaiter(this, void 0, void 0, function () {
        var clientId,
          username,
          mediationType,
          startAuthenticationResponse,
          credentialRequestOptions,
          processedOptions,
          mediatedCredentialRequestOptions,
          credential;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              clientId = this.getValidatedClientId();
              (username = params.username), (mediationType = params.mediationType);
              return [
                4,
                SdkApiClient.startAuthentication({ username: username, clientId: clientId }),
              ];
            case 1:
              startAuthenticationResponse = _a.sent();
              credentialRequestOptions = startAuthenticationResponse.credential_request_options;
              processedOptions = this.processCredentialRequestOptions(credentialRequestOptions);
              mediatedCredentialRequestOptions = this.getMediatedCredentialRequest(
                processedOptions,
                mediationType,
              );
              return [
                4,
                navigator.credentials.get(mediatedCredentialRequestOptions).catch(function (error) {
                  throw _this.getSdkError(error);
                }),
              ];
            case 2:
              credential = _a.sent();
              if (!username) return [3, 4];
              return [4, DeviceUsers.persist(username)];
            case 3:
              _a.sent();
              _a.label = 4;
            case 4:
              return [
                2,
                {
                  webauthnSessionId: startAuthenticationResponse.webauthn_session_id,
                  publicKeyCredential: this.encodeCredential(credential),
                  userAgent: navigator.userAgent,
                },
              ];
          }
        });
      });
    };
    AuthenticationHandler.prototype.getMediatedCredentialRequest = function (
      credentialRequestOptions,
      passkeysMediationType,
    ) {
      var mediatedCredentialRequestOptions = { publicKey: credentialRequestOptions };
      if (passkeysMediationType === AuthenticationMediationType.InputAutofill) {
        mediatedCredentialRequestOptions.mediation = 'conditional';
        mediatedCredentialRequestOptions.signal =
          this.abortController && this.abortController.signal;
      }
      return mediatedCredentialRequestOptions;
    };
    AuthenticationHandler.prototype.processCredentialRequestOptions = function (
      credentialRequestOptions,
    ) {
      return __assign(__assign({}, credentialRequestOptions), {
        challenge: EncodingUtils$1.base64ToArrayBuffer(credentialRequestOptions.challenge),
        allowCredentials: credentialRequestOptions.allowCredentials.map(function (ac) {
          return __assign(__assign({}, ac), { id: EncodingUtils$1.base64ToArrayBuffer(ac.id) });
        }),
      });
    };
    AuthenticationHandler.prototype.encodeCredential = function (credential) {
      var authenticatorAttachment = credential.authenticatorAttachment;
      var credentialResponse = credential.response;
      var encodedCredential = {
        id: credential.id,
        rawId: EncodingUtils$1.arrayBufferToBase64(credential.rawId),
        response: {
          authenticatorData: EncodingUtils$1.arrayBufferToBase64(
            credentialResponse.authenticatorData,
          ),
          clientDataJSON: EncodingUtils$1.arrayBufferToBase64(credentialResponse.clientDataJSON),
          signature: EncodingUtils$1.arrayBufferToBase64(credentialResponse.signature),
          userHandle: EncodingUtils$1.arrayBufferToBase64(credentialResponse.userHandle),
        },
        authenticatorAttachment: authenticatorAttachment,
        type: credential.type,
      };
      return encodedCredential;
    };
    AuthenticationHandler.prototype.getValidatedClientId = function () {
      var clientId = SdkStorage.get('clientId');
      if (!clientId) {
        throw makeSdkRejection(ErrorCode.NotInitialized, 'Missing clientId');
      }
      return clientId;
    };
    AuthenticationHandler.prototype.getSdkError = function (error) {
      if (isSdkRejection(error)) {
        return error;
      }
      if (error.name === 'NotAllowedError') {
        throw makeSdkRejection(
          ErrorCode.AuthenticationCanceled,
          'Authentication was canceled by the user or got timeout',
          { error: error },
        );
      }
      if (error.name === 'OperationError') {
        throw makeSdkRejection(
          ErrorCode.AuthenticationProcessAlreadyActive,
          'Authentication process is already active',
          {
            error: error,
          },
        );
      }
      if (error === ErrorCode.AutofillAuthenticationAborted) {
        return makeSdkRejection(ErrorCode.AutofillAuthenticationAborted);
      }
      throw makeSdkRejection(
        ErrorCode.AuthenticationFailed,
        'Something went wrong during authentication',
        { error: error },
      );
    };
    return AuthenticationHandler;
  })();

  var RegistrationHandler = (function () {
    function RegistrationHandler() {}
    RegistrationHandler.prototype.perform = function (webauthnName, options) {
      return __awaiter(this, void 0, void 0, function () {
        var registrationOptions,
          clientId,
          startRegistrationResponse,
          credentialCreationOptions,
          publicKeyCredential,
          result,
          error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              registrationOptions = __assign(
                {
                  allowCrossPlatformAuthenticators: true,
                  registerAsDiscoverable: true,
                  webauthnDisplayName: webauthnName,
                },
                options,
              );
              clientId = SdkStorage.get('clientId');
              if (!clientId) {
                throw makeSdkRejection(ErrorCode.NotInitialized, 'Missing clientId');
              }
              _a.label = 1;
            case 1:
              _a.trys.push([1, 4, , 5]);
              return [
                4,
                SdkApiClient.startRegistration({
                  username: webauthnName,
                  clientId: clientId,
                  displayName: registrationOptions.webauthnDisplayName || webauthnName,
                }),
              ];
            case 2:
              startRegistrationResponse = _a.sent();
              credentialCreationOptions = this.processCredentialCreationOptions(
                startRegistrationResponse.credential_creation_options,
                registrationOptions,
              );
              return [4, this.registerCredential(credentialCreationOptions)];
            case 3:
              publicKeyCredential = _a.sent();
              result = {
                webauthnSessionId: startRegistrationResponse.webauthn_session_id,
                publicKeyCredential: publicKeyCredential,
                userAgent: navigator.userAgent,
              };
              return [2, EncodingUtils$1.jsonToBase64(result)];
            case 4:
              error_1 = _a.sent();
              throw this.getSdkError(error_1);
            case 5:
              return [2];
          }
        });
      });
    };
    RegistrationHandler.prototype.processCredentialCreationOptions = function (
      rawCredentialCreationOptions,
      options,
    ) {
      var credentialCreationOptions = JSON.parse(JSON.stringify(rawCredentialCreationOptions));
      credentialCreationOptions.challenge = EncodingUtils$1.base64ToArrayBuffer(
        rawCredentialCreationOptions.challenge,
      );
      credentialCreationOptions.user.id = EncodingUtils$1.base64ToArrayBuffer(
        rawCredentialCreationOptions.user.id,
      );
      if (options === null || options === void 0 ? void 0 : options.registerAsDiscoverable) {
        credentialCreationOptions.authenticatorSelection.residentKey = 'preferred';
        credentialCreationOptions.authenticatorSelection.requireResidentKey = true;
      } else {
        credentialCreationOptions.authenticatorSelection.residentKey = 'discouraged';
        credentialCreationOptions.authenticatorSelection.requireResidentKey = false;
      }
      credentialCreationOptions.authenticatorSelection.authenticatorAttachment = (
        options === null || options === void 0 ? void 0 : options.allowCrossPlatformAuthenticators
      )
        ? undefined
        : 'platform';
      return credentialCreationOptions;
    };
    RegistrationHandler.prototype.registerCredential = function (credentialCreationOptions) {
      return __awaiter(this, void 0, void 0, function () {
        var credential, authenticatorAttachment, credentialResponse;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                navigator.credentials
                  .create({
                    publicKey: credentialCreationOptions,
                  })
                  .catch(function (error) {
                    throw _this.getSdkError(error);
                  }),
              ];
            case 1:
              credential = _a.sent();
              authenticatorAttachment = credential.authenticatorAttachment;
              credentialResponse = credential.response;
              return [
                2,
                {
                  id: credential.id,
                  rawId: EncodingUtils$1.arrayBufferToBase64(credential.rawId),
                  response: {
                    attestationObject: EncodingUtils$1.arrayBufferToBase64(
                      credentialResponse.attestationObject,
                    ),
                    clientDataJSON: EncodingUtils$1.arrayBufferToBase64(
                      credentialResponse.clientDataJSON,
                    ),
                  },
                  authenticatorAttachment: authenticatorAttachment,
                  type: credential.type,
                },
              ];
          }
        });
      });
    };
    RegistrationHandler.prototype.getSdkError = function (error) {
      if (isSdkRejection(error)) {
        return error;
      }
      if (error.name === 'NotAllowedError') {
        throw makeSdkRejection(
          ErrorCode.RegistrationCanceled,
          'Registration was canceled by the user or got timeout',
          {
            error: error,
          },
        );
      }
      throw makeSdkRejection(
        ErrorCode.RegistrationFailed,
        'Something went wrong during registration',
        { error: error },
      );
    };
    return RegistrationHandler;
  })();

  var WebAuthnSdkImpl$1 = (function () {
    function WebAuthnSdkImpl() {
      var _this = this;
      this._authenticationHandler = new AuthenticationHandler();
      this._registrationHandler = new RegistrationHandler();
      this.authenticate = {
        modal: function (username) {
          return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
              this.initCheck();
              return [2, this._authenticationHandler.modal(username)];
            });
          });
        },
        autofill: {
          activate: function (params) {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                this.initCheck();
                return [2, this._authenticationHandler.activateAutofill(params)];
              });
            });
          },
          abort: function () {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                return [2, this._authenticationHandler.abortAutofill()];
              });
            });
          },
        },
      };
      this.register = function (webauthnName, options) {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            this.initCheck();
            return [2, this._registrationHandler.perform(webauthnName, options)];
          });
        });
      };
    }
    WebAuthnSdkImpl.prototype.init = function (clientId, options) {
      return __awaiter(this, void 0, void 0, function () {
        var defaultPaths;
        return __generator(this, function (_a) {
          try {
            if (options.webauthnApiPaths) {
              defaultPaths = SdkBindIdApiClient.getDefaultPaths();
              if (
                symmetricDifference(
                  Object.keys(options.webauthnApiPaths),
                  Object.keys(defaultPaths),
                ).length
              ) {
                throw makeSdkRejection(ErrorCode.NotInitialized, 'Invalid custom paths', {
                  customApiPaths: options.webauthnApiPaths,
                });
              }
            }
            SdkApiClient.init(options);
            if (!clientId) {
              throw makeSdkRejection(ErrorCode.NotInitialized, 'Invalid clientId', {
                clientId: clientId,
              });
            }
            SdkStorage.set('clientId', clientId);
            WebAuthnSdkImpl._initialized = true;
          } catch (error) {
            if (isSdkRejection(error)) {
              throw error;
            } else {
              throw makeSdkRejection(ErrorCode.NotInitialized, 'Something went wrong', {
                error: error,
              });
            }
          }
          return [2];
        });
      });
    };
    WebAuthnSdkImpl.prototype.isPlatformAuthenticatorSupported = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [4, PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()];
            case 1:
              return [2, _a.sent()];
            case 2:
              _a.sent();
              return [2, false];
            case 3:
              return [2];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.isAutofillSupported = function () {
      return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              _a = PublicKeyCredential.isConditionalMediationAvailable;
              if (!_a) return [3, 2];
              return [4, PublicKeyCredential.isConditionalMediationAvailable()];
            case 1:
              _a = _b.sent();
              _b.label = 2;
            case 2:
              return [2, !!_a];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.initCheck = function () {
      if (!WebAuthnSdkImpl._initialized) {
        throw makeSdkRejection(ErrorCode.NotInitialized, 'WebAuthnSdk is not initialized');
      }
    };
    WebAuthnSdkImpl._initialized = false;
    return WebAuthnSdkImpl;
  })();

  var AsyncInterval = (function () {
    function AsyncInterval(handler, timeout) {
      this.handler = handler;
      this.timeout = timeout;
      this.resume();
    }
    AsyncInterval.prototype.resume = function () {
      return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.handler()];
            case 1:
              _a.sent();
              this.timeoutId = globalThis.setTimeout(function () {
                return _this.resume();
              }, this.timeout);
              return [2];
          }
        });
      });
    };
    AsyncInterval.prototype.pause = function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = undefined;
    };
    return AsyncInterval;
  })();

  var CrossDeviceSessionHandler = (function () {
    function CrossDeviceSessionHandler(authSessionId, handlers) {
      var _this = this;
      this.authSessionId = authSessionId;
      this.handlers = handlers;
      if (!authSessionId) {
        throw makeSdkRejection$1(ErrorCode$1.InvalidAuthSession, 'authSessionId is missing');
      }
      this._interval = new AsyncInterval(function () {
        return __awaiter(_this, void 0, void 0, function () {
          var currentSessionStatus, handlerResult, error_1;
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
          return __generator(this, function (_o) {
            switch (_o.label) {
              case 0:
                _o.trys.push([0, 12, , 13]);
                return [4, SdkBindIdApiClient.getSessionStatus(this.authSessionId)];
              case 1:
                currentSessionStatus = _o.sent();
                if (!this._lastSessionStatus) return [3, 11];
                if (
                  !(
                    this._lastSessionStatus.cross_device_status !==
                    currentSessionStatus.cross_device_status
                  )
                )
                  return [3, 11];
                handlerResult = void 0;
                if (!(currentSessionStatus.cross_device_status === 'pending-attachment'))
                  return [3, 2];
                logger.log(
                  'cross_device_status was updated to pending-attachment. this should never happen.',
                );
                return [3, 10];
              case 2:
                if (!(currentSessionStatus.cross_device_status === 'attached')) return [3, 4];
                return [
                  4,
                  (_b = (_a = this.handlers).onDeviceAttach) === null || _b === void 0
                    ? void 0
                    : _b.call(_a),
                ];
              case 3:
                handlerResult = _o.sent();
                return [3, 10];
              case 4:
                if (!(currentSessionStatus.cross_device_status === 'registered')) return [3, 6];
                return [
                  4,
                  (_d = (_c = this.handlers).onCredentialRegister) === null || _d === void 0
                    ? void 0
                    : _d.call(
                        _c,
                        (_e = currentSessionStatus.cross_device_result) === null || _e === void 0
                          ? void 0
                          : _e.auth_code,
                      ),
                ];
              case 5:
                handlerResult = _o.sent();
                return [3, 10];
              case 6:
                if (!(currentSessionStatus.cross_device_status === 'authenticated')) return [3, 8];
                return [
                  4,
                  (_g = (_f = this.handlers).onCredentialAuthenticate) === null || _g === void 0
                    ? void 0
                    : _g.call(
                        _f,
                        (_h = currentSessionStatus.cross_device_result) === null || _h === void 0
                          ? void 0
                          : _h.auth_code,
                      ),
                ];
              case 7:
                handlerResult = _o.sent();
                return [3, 10];
              case 8:
                if (!(currentSessionStatus.cross_device_status === 'completed')) return [3, 10];
                return [
                  4,
                  (_k = (_j = this.handlers).onDeviceDetach) === null || _k === void 0
                    ? void 0
                    : _k.call(_j),
                ];
              case 9:
                handlerResult = _o.sent();
                _o.label = 10;
              case 10:
                if (handlerResult === false) {
                  this.destroy();
                }
                _o.label = 11;
              case 11:
                this._lastSessionStatus = currentSessionStatus;
                return [3, 13];
              case 12:
                error_1 = _o.sent();
                logger.error('error in WebAuthn cross device session polling: ', error_1);
                this.destroy();
                (_m = (_l = this.handlers).onFailure) === null || _m === void 0
                  ? void 0
                  : _m.call(_l, ErrorCode$1.Unknown);
                return [3, 13];
              case 13:
                return [2];
            }
          });
        });
      }, 3000);
    }
    CrossDeviceSessionHandler.prototype.destroy = function () {
      this._interval.pause();
    };
    CrossDeviceSessionHandler.prototype.getController = function () {
      var _this = this;
      return {
        stop: function () {
          return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
              this.destroy();
              return [2];
            });
          });
        },
        authSessionId: this.authSessionId,
      };
    };
    return CrossDeviceSessionHandler;
  })();

  var EncodingUtils = (function () {
    function EncodingUtils() {}
    EncodingUtils.arrayBufferToBase64 = function (buffer) {
      return btoa(
        String.fromCharCode.apply(String, __spreadArray([], __read(new Uint8Array(buffer)), false)),
      );
    };
    EncodingUtils.base64ToArrayBuffer = function (base64) {
      return Uint8Array.from(atob(base64), function (c) {
        return c.charCodeAt(0);
      });
    };
    EncodingUtils.stringToBase64 = function (str) {
      return btoa(str);
    };
    EncodingUtils.base64ToString = function (str) {
      return atob(str);
    };
    return EncodingUtils;
  })();

  var LazyLoaded = (function () {
    function LazyLoaded(_getter) {
      this._getter = _getter;
      this._resolved = false;
    }
    LazyLoaded.prototype.get = function () {
      var _this = this;
      if (!this._valuePromise) {
        this._valuePromise = this._getter().then(function (res) {
          _this._resolved = true;
          return res;
        });
      }
      return this._valuePromise;
    };
    Object.defineProperty(LazyLoaded.prototype, 'resolved', {
      get: function () {
        return this._resolved;
      },
      enumerable: false,
      configurable: true,
    });
    return LazyLoaded;
  })();

  var WebAuthnAuthenticationHandler = (function () {
    function WebAuthnAuthenticationHandler(authSessionId, username) {
      var _this = this;
      this.authSessionId = authSessionId;
      this.username = username;
      this.startAuthenticationResponse = new LazyLoaded(function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [
              2,
              SdkBindIdApiClient.startWebauthnAuthentication(this.authSessionId, username),
            ];
          });
        });
      });
    }
    Object.defineProperty(WebAuthnAuthenticationHandler.prototype, 'isReady', {
      get: function () {
        return this.startAuthenticationResponse.resolved;
      },
      enumerable: false,
      configurable: true,
    });
    WebAuthnAuthenticationHandler.prototype.prepare = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.startAuthenticationResponse.get()];
            case 1:
              _a.sent();
              return [2];
          }
        });
      });
    };
    WebAuthnAuthenticationHandler.prototype.execute = function () {
      return __awaiter(this, void 0, void 0, function () {
        var startAuthenticationResponse,
          credentialRequestOptions,
          credential,
          authenticatorAttachment,
          credentialResponse,
          encodedCredential,
          completeAuthenticationResponse;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.startAuthenticationResponse.get()];
            case 1:
              startAuthenticationResponse = _a.sent();
              credentialRequestOptions = startAuthenticationResponse.credential_request_options;
              credentialRequestOptions.challenge = EncodingUtils.base64ToArrayBuffer(
                credentialRequestOptions.challenge,
              );
              credentialRequestOptions.allowCredentials =
                credentialRequestOptions.allowCredentials.map(function (ac) {
                  return __assign(__assign({}, ac), {
                    id: EncodingUtils.base64ToArrayBuffer(ac.id),
                  });
                });
              return [
                4,
                navigator.credentials.get({
                  publicKey: credentialRequestOptions,
                }),
              ];
            case 2:
              credential = _a.sent();
              authenticatorAttachment = credential.authenticatorAttachment;
              credentialResponse = credential.response;
              encodedCredential = {
                id: credential.id,
                rawId: EncodingUtils.arrayBufferToBase64(credential.rawId),
                response: {
                  authenticatorData: EncodingUtils.arrayBufferToBase64(
                    credentialResponse.authenticatorData,
                  ),
                  clientDataJSON: EncodingUtils.arrayBufferToBase64(
                    credentialResponse.clientDataJSON,
                  ),
                  signature: EncodingUtils.arrayBufferToBase64(credentialResponse.signature),
                  userHandle: EncodingUtils.arrayBufferToBase64(credentialResponse.userHandle),
                },
                authenticatorAttachment: authenticatorAttachment,
                type: credential.type,
              };
              return [
                4,
                SdkBindIdApiClient.completeWebauthnAuthentication(
                  this.authSessionId,
                  startAuthenticationResponse.webauthn_session_id,
                  encodedCredential,
                ),
              ];
            case 3:
              completeAuthenticationResponse = _a.sent();
              this.result = completeAuthenticationResponse.auth_code;
              DeviceUsers.persist(this.username);
              return [2];
          }
        });
      });
    };
    return WebAuthnAuthenticationHandler;
  })();

  var PasskeyAuthenticationHandler = (function () {
    function PasskeyAuthenticationHandler(authSessionId) {
      var _this = this;
      this.authSessionId = authSessionId;
      this.startPasskeyAuthenticationResponse = new LazyLoaded(function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [2, SdkBindIdApiClient.startPasskeyAuthentication(this.authSessionId)];
          });
        });
      });
      this.abortController = new AbortController();
    }
    Object.defineProperty(PasskeyAuthenticationHandler.prototype, 'isReady', {
      get: function () {
        return this.startPasskeyAuthenticationResponse.resolved;
      },
      enumerable: false,
      configurable: true,
    });
    PasskeyAuthenticationHandler.prototype.prepare = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.startPasskeyAuthenticationResponse.get()];
            case 1:
              _a.sent();
              return [2];
          }
        });
      });
    };
    PasskeyAuthenticationHandler.prototype.execute = function (passkeysMediationType) {
      if (passkeysMediationType === void 0) {
        passkeysMediationType = PasskeysMediationType.InputAutofill;
      }
      return __awaiter(this, void 0, void 0, function () {
        var startAuthenticationResponse,
          credentialRequestOptions,
          credential,
          authenticatorAttachment,
          credentialResponse,
          encodedCredential,
          completeAuthenticationResponse,
          err_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.startPasskeyAuthenticationResponse.get()];
            case 1:
              startAuthenticationResponse = _a.sent();
              credentialRequestOptions = startAuthenticationResponse.credential_request_options;
              credentialRequestOptions.challenge = EncodingUtils.base64ToArrayBuffer(
                credentialRequestOptions.challenge,
              );
              credentialRequestOptions.allowCredentials = [];
              _a.label = 2;
            case 2:
              _a.trys.push([2, 5, , 6]);
              return [
                4,
                navigator.credentials.get(
                  this.getMediatedCredentialRequest(
                    credentialRequestOptions,
                    passkeysMediationType,
                  ),
                ),
              ];
            case 3:
              credential = _a.sent();
              authenticatorAttachment = credential.authenticatorAttachment;
              credentialResponse = credential.response;
              encodedCredential = {
                id: credential.id,
                rawId: EncodingUtils.arrayBufferToBase64(credential.rawId),
                response: {
                  authenticatorData: EncodingUtils.arrayBufferToBase64(
                    credentialResponse.authenticatorData,
                  ),
                  clientDataJSON: EncodingUtils.arrayBufferToBase64(
                    credentialResponse.clientDataJSON,
                  ),
                  signature: EncodingUtils.arrayBufferToBase64(credentialResponse.signature),
                  userHandle: EncodingUtils.arrayBufferToBase64(credentialResponse.userHandle),
                },
                authenticatorAttachment: authenticatorAttachment,
                type: credential.type,
              };
              return [
                4,
                SdkBindIdApiClient.completePasskeyAuthentication(
                  this.authSessionId,
                  startAuthenticationResponse.webauthn_session_id,
                  encodedCredential,
                ),
              ];
            case 4:
              completeAuthenticationResponse = _a.sent();
              this.result = completeAuthenticationResponse.auth_code;
              return [3, 6];
            case 5:
              err_1 = _a.sent();
              if (
                err_1 instanceof Error &&
                err_1.message === ErrorCode$1.PasskeyAuthenticationAborted
              ) {
                throw makeSdkRejection$1(ErrorCode$1.PasskeyAuthenticationAborted);
              }
              throw err_1;
            case 6:
              return [2];
          }
        });
      });
    };
    PasskeyAuthenticationHandler.prototype.getMediatedCredentialRequest = function (
      credentialRequestOptions,
      passkeysMediationType,
    ) {
      var mediatedCredentialRequestOptions = { publicKey: credentialRequestOptions };
      if (passkeysMediationType === PasskeysMediationType.InputAutofill) {
        mediatedCredentialRequestOptions.mediation = 'conditional';
        mediatedCredentialRequestOptions.signal = this.abortController.signal;
      }
      return mediatedCredentialRequestOptions;
    };
    PasskeyAuthenticationHandler.prototype.abort = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          this.abortController.abort(ErrorCode$1.PasskeyAuthenticationAborted);
          return [2];
        });
      });
    };
    return PasskeyAuthenticationHandler;
  })();

  var WebAuthnRegistrationHandler = (function () {
    function WebAuthnRegistrationHandler(authSessionId, username, userDisplayName) {
      var _this = this;
      this.authSessionId = authSessionId;
      this.username = username;
      this.startRegistrationResponse = new LazyLoaded(function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [
              2,
              SdkBindIdApiClient.startWebauthnRegistration(
                this.authSessionId,
                username,
                userDisplayName,
              ),
            ];
          });
        });
      });
    }
    Object.defineProperty(WebAuthnRegistrationHandler.prototype, 'isReady', {
      get: function () {
        return this.startRegistrationResponse.resolved;
      },
      enumerable: false,
      configurable: true,
    });
    WebAuthnRegistrationHandler.prototype.prepare = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.startRegistrationResponse.get()];
            case 1:
              _a.sent();
              return [2];
          }
        });
      });
    };
    WebAuthnRegistrationHandler.prototype.execute = function (
      allowCrossPlatformAuthenticators,
      registerAsDiscoverable,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var startRegistrationResponse,
          credentialCreationOptions,
          credential,
          authenticatorAttachment,
          credentialResponse,
          encodedCredential,
          completeRegistrationResponse,
          err_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4, this.startRegistrationResponse.get()];
            case 1:
              startRegistrationResponse = _a.sent();
              credentialCreationOptions = startRegistrationResponse.credential_creation_options;
              credentialCreationOptions.challenge = EncodingUtils.base64ToArrayBuffer(
                credentialCreationOptions.challenge,
              );
              credentialCreationOptions.user.id = EncodingUtils.base64ToArrayBuffer(
                credentialCreationOptions.user.id,
              );
              if (registerAsDiscoverable) {
                credentialCreationOptions.authenticatorSelection.residentKey = 'preferred';
                credentialCreationOptions.authenticatorSelection.requireResidentKey = true;
              } else {
                credentialCreationOptions.authenticatorSelection.residentKey = 'discouraged';
                credentialCreationOptions.authenticatorSelection.requireResidentKey = false;
              }
              credentialCreationOptions.authenticatorSelection.authenticatorAttachment =
                allowCrossPlatformAuthenticators ? undefined : 'platform';
              _a.label = 2;
            case 2:
              _a.trys.push([2, 5, , 6]);
              return [
                4,
                navigator.credentials.create({
                  publicKey: credentialCreationOptions,
                }),
              ];
            case 3:
              credential = _a.sent();
              authenticatorAttachment = credential.authenticatorAttachment;
              credentialResponse = credential.response;
              encodedCredential = {
                id: credential.id,
                rawId: EncodingUtils.arrayBufferToBase64(credential.rawId),
                response: {
                  attestationObject: EncodingUtils.arrayBufferToBase64(
                    credentialResponse.attestationObject,
                  ),
                  clientDataJSON: EncodingUtils.arrayBufferToBase64(
                    credentialResponse.clientDataJSON,
                  ),
                },
                authenticatorAttachment: authenticatorAttachment,
                type: credential.type,
              };
              return [
                4,
                SdkBindIdApiClient.completeWebauthnRegistration(
                  this.authSessionId,
                  startRegistrationResponse.webauthn_session_id,
                  encodedCredential,
                ),
              ];
            case 4:
              completeRegistrationResponse = _a.sent();
              this.result = completeRegistrationResponse.auth_code;
              DeviceUsers.persist(this.username);
              return [3, 6];
            case 5:
              err_1 = _a.sent();
              if (
                (err_1 === null || err_1 === void 0 ? void 0 : err_1.name) === 'NotAllowedError'
              ) {
                throw makeSdkRejection$1(
                  ErrorCode$1.UserCanceledWebAuthnRegistration,
                  'user canceled registration',
                  { err: err_1 },
                );
              }
              throw makeSdkRejection$1(ErrorCode$1.Unknown, 'webauthn registration failed', {
                err: err_1,
              });
            case 6:
              return [2];
          }
        });
      });
    };
    return WebAuthnRegistrationHandler;
  })();

  var approvalDataMaxLength = 10;
  var approvalDataAllowedChars = /^[A-Za-z0-9\-_.]*$/;
  function validateApprovalMaxLength(approvalData) {
    return Object.keys(approvalData).length <= approvalDataMaxLength;
  }
  function validateApprovalAllowedContent(approvalData) {
    var isString = function (val) {
      return typeof val === 'string';
    };
    var isContentAllowed = function (val) {
      return approvalDataAllowedChars.test(val);
    };
    return Object.keys(approvalData).every(function (key) {
      return (
        isString(key) &&
        isString(approvalData[key]) &&
        isContentAllowed(key) &&
        isContentAllowed(approvalData[key])
      );
    });
  }
  function validateApprovalData(approvalData) {
    if (!approvalData) {
      return;
    }
    if (!validateApprovalMaxLength(approvalData) || !validateApprovalAllowedContent(approvalData)) {
      logger.error('Failed validating approval data');
      throw makeSdkRejection$1(
        ErrorCode$1.InvalidApprovalData,
        'Provided approval data should have '.concat(
          approvalDataMaxLength,
          " properties max. Also, it should contain only alphanumeric characters, numbers, and the special characters: '-', '_', '.'",
        ),
      );
    }
  }

  var WebAuthnSdkImpl = (function () {
    function WebAuthnSdkImpl() {
      this._initialized = false;
      this.auth = new WebAuthnSdkImpl$1();
    }
    WebAuthnSdkImpl.prototype.init = function (clientId, options) {
      return __awaiter(this, void 0, void 0, function () {
        var defaultPaths;
        return __generator(this, function (_a) {
          try {
            this._clearSdkSessionState();
            if (options.webauthnApiPaths) {
              defaultPaths = SdkBindIdApiClient.getDefaultPaths();
              if (
                symmetricDifference(
                  Object.keys(options.webauthnApiPaths),
                  Object.keys(defaultPaths),
                ).length
              ) {
                throw makeSdkRejection$1(ErrorCode$1.NotInitialized, 'Invalid custom paths', {
                  customApiPaths: options.webauthnApiPaths,
                });
              }
            }
            SdkBindIdApiClient.init(options);
            if (!clientId) {
              throw makeSdkRejection$1(ErrorCode$1.NotInitialized, 'Invalid clientId', {
                clientId: clientId,
              });
            }
            SdkStorage.set('clientId', clientId);
            this._initialized = true;
          } catch (error) {
            if (isSdkRejection$1(error)) {
              throw error;
            } else {
              throw makeSdkRejection$1(ErrorCode$1.NotInitialized, 'Something went wrong', {
                error: error,
              });
            }
          }
          return [2];
        });
      });
    };
    WebAuthnSdkImpl.prototype.reset = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          this._clearSdkSessionState(true);
          return [2];
        });
      });
    };
    WebAuthnSdkImpl.prototype._clearSdkSessionState = function (retainConfiguration) {
      SdkStorage.clear(retainConfiguration);
      this._initialized = retainConfiguration ? this._initialized : false;
      this._currentRegistrationSession = undefined;
      this._currentAuthenticationSession = undefined;
      this._currentCrossDeviceSessionHandler = undefined;
    };
    WebAuthnSdkImpl.prototype._optionallyStartRestrictedSession = function (
      approvalData,
      redirectUri,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var authSessionId;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              authSessionId = SdkStorage.get('authSessionId');
              if (!(approvalData || !authSessionId)) return [3, 2];
              return [
                4,
                SdkBindIdApiClient.startRestrictedSession(
                  SdkStorage.get('clientId'),
                  undefined,
                  approvalData,
                  redirectUri,
                ),
              ];
            case 1:
              authSessionId = _a.sent().auth_session_id;
              SdkStorage.set('authSessionId', authSessionId);
              _a.label = 2;
            case 2:
              return [2, authSessionId];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.isPlatformAuthenticatorSupported = function () {
      return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [4, PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()];
            case 1:
              return [2, _a.sent()];
            case 2:
              error_1 = _a.sent();
              logger.error(error_1);
              return [2, false];
            case 3:
              return [2];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.isPasskeySupported = function () {
      return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              _a = PublicKeyCredential.isConditionalMediationAvailable;
              if (!_a) return [3, 2];
              return [4, PublicKeyCredential.isConditionalMediationAvailable()];
            case 1:
              _a = _b.sent();
              _b.label = 2;
            case 2:
              return [2, !!_a];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.prepareWebauthnRegistration = function (
      username,
      displayName,
      authSessionId,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var storageAuthSessionId;
        return __generator(this, function (_a) {
          if (!this._initialized) {
            throw makeSdkRejection$1(ErrorCode$1.NotInitialized);
          }
          if (authSessionId) {
            storageAuthSessionId = SdkStorage.get('authSessionId');
            if (storageAuthSessionId && storageAuthSessionId !== authSessionId) {
              SdkStorage.remove('deviceBindingToken');
            }
            SdkStorage.set('authSessionId', authSessionId);
          } else {
            authSessionId = SdkStorage.get('authSessionId');
            if (!authSessionId) {
              throw makeSdkRejection$1(
                ErrorCode$1.InvalidAuthSession,
                'authSessionId was not provided',
              );
            }
          }
          this._currentRegistrationSession = new WebAuthnRegistrationHandler(
            authSessionId,
            username,
            displayName !== null && displayName !== void 0 ? displayName : username,
          );
          return [2, this._currentRegistrationSession.prepare()];
        });
      });
    };
    WebAuthnSdkImpl.prototype._validateRegistrationPreparation = function () {
      return __awaiter(this, void 0, void 0, function () {
        var maxRetries, retryIntervalMilliseconds, retries;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!this._currentRegistrationSession) {
                throw makeSdkRejection$1(
                  ErrorCode$1.MissingPrepareStep,
                  'executeWebauthnRegistration() cannot be called before prepareWebauthnRegistration()',
                );
              }
              maxRetries = 5;
              retryIntervalMilliseconds = 500;
              retries = 0;
              _a.label = 1;
            case 1:
              if (this._currentRegistrationSession.isReady) return [2];
              retries += 1;
              return [4, sleep(retryIntervalMilliseconds)];
            case 2:
              _a.sent();
              _a.label = 3;
            case 3:
              if (retries <= maxRetries) return [3, 1];
              _a.label = 4;
            case 4:
              throw makeSdkRejection$1(
                ErrorCode$1.MissingPrepareStep,
                'executeWebauthnRegistration() cannot be called before prepareWebauthnRegistration() has completed successfully',
              );
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.executeWebauthnRegistration = function (
      allowCrossPlatformAuthenticators,
      registerAsDiscoverable,
    ) {
      if (allowCrossPlatformAuthenticators === void 0) {
        allowCrossPlatformAuthenticators = false;
      }
      if (registerAsDiscoverable === void 0) {
        registerAsDiscoverable = false;
      }
      return __awaiter(this, void 0, void 0, function () {
        var authCode;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!this._initialized) {
                throw makeSdkRejection$1(ErrorCode$1.NotInitialized);
              }
              return [4, this._validateRegistrationPreparation()];
            case 1:
              _a.sent();
              return [
                4,
                this._currentRegistrationSession.execute(
                  allowCrossPlatformAuthenticators,
                  registerAsDiscoverable,
                ),
              ];
            case 2:
              _a.sent();
              authCode = this._currentRegistrationSession.result;
              this._currentRegistrationSession = undefined;
              return [2, authCode];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.prepareWebauthnAuthentication = function (
      username,
      approvalData,
      redirectUri,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var authSessionId;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!this._initialized) {
                throw makeSdkRejection$1(ErrorCode$1.NotInitialized);
              }
              validateApprovalData(approvalData);
              return [4, this._optionallyStartRestrictedSession(approvalData, redirectUri)];
            case 1:
              authSessionId = _a.sent();
              this._currentAuthenticationSession = new WebAuthnAuthenticationHandler(
                authSessionId,
                username,
              );
              return [2, this._currentAuthenticationSession.prepare()];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.executeWebauthnAuthentication = function () {
      return __awaiter(this, void 0, void 0, function () {
        var authCode;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!this._initialized) {
                throw makeSdkRejection$1(ErrorCode$1.NotInitialized);
              }
              if (!this._currentAuthenticationSession) {
                throw makeSdkRejection$1(
                  ErrorCode$1.MissingPrepareStep,
                  'executeWebauthnAuthentication() cannot be called before prepareWebauthnAuthentication() has completed successfully',
                );
              }
              return [4, this._currentAuthenticationSession.execute()];
            case 1:
              _a.sent();
              authCode = this._currentAuthenticationSession.result;
              this._currentAuthenticationSession = undefined;
              return [2, authCode];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.startCrossDeviceFlow = function (
      handlers,
      bindingMessage,
      approvalData,
      redirectUri,
    ) {
      return __awaiter(this, void 0, void 0, function () {
        var authSessionId;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!this._initialized) {
                throw makeSdkRejection$1(ErrorCode$1.NotInitialized);
              }
              validateApprovalData(approvalData);
              this._currentRegistrationSession = undefined;
              this._currentAuthenticationSession = undefined;
              return [
                4,
                SdkBindIdApiClient.startRestrictedSession(
                  SdkStorage.get('clientId'),
                  bindingMessage,
                  approvalData,
                  redirectUri,
                ),
              ];
            case 1:
              authSessionId = _a.sent().auth_session_id;
              SdkStorage.set('authSessionId', authSessionId);
              this._currentCrossDeviceSessionHandler = new CrossDeviceSessionHandler(
                authSessionId,
                handlers,
              );
              return [2, this._currentCrossDeviceSessionHandler.getController()];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.attachDevice = function (authSessionId) {
      return __awaiter(this, void 0, void 0, function () {
        var attachDeviceResponse;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              SdkStorage.set('authSessionId', authSessionId);
              return [4, SdkBindIdApiClient.attachDeviceToSession(authSessionId)];
            case 1:
              attachDeviceResponse = _a.sent();
              return [
                2,
                __assign(
                  {
                    bindingMessage: attachDeviceResponse.binding_info.binding_message,
                    originatingDevice: {
                      osType:
                        attachDeviceResponse.binding_info.originating_device.device_info.os_type,
                      osVersion:
                        attachDeviceResponse.binding_info.originating_device.device_info.os_version,
                      browserType:
                        attachDeviceResponse.binding_info.originating_device.device_info
                          .browser_type,
                      browserVersion:
                        attachDeviceResponse.binding_info.originating_device.device_info
                          .browser_version,
                    },
                  },
                  attachDeviceResponse.binding_info.approval_data && {
                    approvalData: attachDeviceResponse.binding_info.approval_data,
                  },
                ),
              ];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.detachDevice = function () {
      return __awaiter(this, void 0, void 0, function () {
        var authSessionId;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              authSessionId = SdkStorage.get('authSessionId');
              if (!authSessionId) {
                throw makeSdkRejection$1(
                  ErrorCode$1.InvalidAuthSession,
                  'authSessionId was not provided',
                );
              }
              return [4, SdkBindIdApiClient.detachDeviceFromSession(authSessionId)];
            case 1:
              _a.sent();
              return [2];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.getDeviceUsers = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2, DeviceUsers.get()];
        });
      });
    };
    WebAuthnSdkImpl.prototype.preparePasskeyAuthentication = function (approvalData, redirectUri) {
      return __awaiter(this, void 0, void 0, function () {
        var authSessionId;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!this._initialized) {
                throw makeSdkRejection$1(ErrorCode$1.NotInitialized);
              }
              validateApprovalData(approvalData);
              return [4, this._optionallyStartRestrictedSession(approvalData, redirectUri)];
            case 1:
              authSessionId = _a.sent();
              this._currentPasskeyAuthenticationSession = new PasskeyAuthenticationHandler(
                authSessionId,
              );
              return [2, this._currentPasskeyAuthenticationSession.prepare()];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.executePasskeyAuthentication = function (passkeysMediationType) {
      if (passkeysMediationType === void 0) {
        passkeysMediationType = PasskeysMediationType.InputAutofill;
      }
      return __awaiter(this, void 0, void 0, function () {
        var authCode;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!Object.values(PasskeysMediationType).includes(passkeysMediationType)) {
                throw makeSdkRejection$1(
                  ErrorCode$1.InvalidPasskeysMediationType,
                  'passkeysMediationType should be one of '.concat(
                    Object.values(PasskeysMediationType),
                  ),
                );
              }
              if (!this._initialized) {
                throw makeSdkRejection$1(ErrorCode$1.NotInitialized);
              }
              if (!this._currentPasskeyAuthenticationSession) {
                throw makeSdkRejection$1(
                  ErrorCode$1.MissingPrepareStep,
                  'executePasskeyAuthentication() cannot be called before preparePasskeyAuthentication() has completed successfully',
                );
              }
              return [4, this._currentPasskeyAuthenticationSession.execute(passkeysMediationType)];
            case 1:
              _a.sent();
              authCode = this._currentPasskeyAuthenticationSession.result;
              this._currentAuthenticationSession = undefined;
              return [2, authCode];
          }
        });
      });
    };
    WebAuthnSdkImpl.prototype.abortPasskeyAuthentication = function () {
      var _a;
      (_a = this._currentPasskeyAuthenticationSession) === null || _a === void 0
        ? void 0
        : _a.abort();
    };
    WebAuthnSdkImpl.prototype.getDefaultPaths = function () {
      return SdkBindIdApiClient.getDefaultPaths();
    };
    WebAuthnSdkImpl.prototype.getApiPaths = function () {
      return SdkBindIdApiClient.getApiPaths();
    };
    return WebAuthnSdkImpl;
  })();
  globalThis.WebAuthnSdk = new WebAuthnSdkImpl();

  var TsAuthSdk = (function () {
    function TsAuthSdk() {
      this.webAuthn = new WebAuthnSdkImpl();
      this.oauth = new OauthSdkImpl();
      this.passwords = new PasswordsSdkImpl();
      this.saml = new SamlSdkImpl();
    }
    TsAuthSdk.prototype.init = function (clientId, _a) {
      var webAuthn = _a.webAuthn,
        oauth = _a.oauth,
        passwords = _a.passwords,
        saml = _a.saml;
      if (webAuthn) {
        var serverPath = webAuthn.serverPath;
        this.webAuthn.init(clientId, { serverPath: serverPath });
      }
      if (oauth) {
        var authUrl = oauth.authUrl,
          requireMfa = oauth.requireMfa;
        this.oauth.init(clientId, authUrl, { requireMfa: requireMfa });
      }
      if (passwords) {
        var authUrl = passwords.authUrl,
          requireMfa = passwords.requireMfa;
        this.passwords.init(clientId, authUrl, { requireMfa: requireMfa });
      }
      if (saml) {
        var authUrl = saml.authUrl;
        this.saml.init(clientId, authUrl);
      }
    };
    return TsAuthSdk;
  })();
  globalThis.TsAuthSdk = new TsAuthSdk();

  exports.TsAuthSdk = TsAuthSdk;
  exports['default'] = TsAuthSdk;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
})({});
