/* eslint-disable */
export var tsPlatform = (function (exports) {
  'use strict';

  function bindMethods(agent, methods) {
    return Object.entries(methods).reduce(
      (result, [key, value]) => ({
        ...result,
        [key]: Agent.isPrototypeOf(value)
          ? new value(agent.slug)
          : typeof value === 'function'
          ? value.bind(agent)
          : typeof value === 'object' && !Array.isArray(value) && !!value
          ? bindMethods(agent, value)
          : value,
      }),
      {},
    );
  }
  class Agent {
    constructor(slug) {
      this.slug = slug;
    }
    static create(method) {
      return class extends Agent {
        constructor(slug) {
          super(slug);
          Object.assign(this, bindMethods(this, method(this)));
        }
      };
    }
  }

  var agent$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Agent: Agent,
  });

  const events$1 = new Map();
  function on(eventName, method) {
    var _a;
    if (events$1.has(eventName)) {
      (_a = events$1.get(eventName)) === null || _a === void 0 ? void 0 : _a.push(method);
    } else {
      events$1.set(eventName, [method]);
    }
  }
  function off(eventName, method) {
    const eventArray = events$1.get(eventName);
    if (!eventArray) {
      return;
    }
    const methodIndex = eventArray.indexOf(method);
    if (methodIndex === -1) {
      return;
    }
    eventArray.splice(methodIndex, 1);
  }
  function emit(eventName, eventData) {
    var _a;
    (_a = events$1.get(eventName)) === null || _a === void 0
      ? void 0
      : _a.forEach(callbackMethod => callbackMethod(eventData));
  }

  const MODULE_INITIALIZED = Symbol('MODULE_INITIALIZED');

  var events = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    MODULE_INITIALIZED: MODULE_INITIALIZED,
    emit: emit,
    off: off,
    on: on,
  });

  let initConfig = null;
  function getInitConfig() {
    return initConfig;
  }
  function setInitConfig(config) {
    initConfig = config;
  }

  var moduleMetadata = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getInitConfig: getInitConfig,
    get initConfig() {
      return initConfig;
    },
    setInitConfig: setInitConfig,
  });

  function initialize(params) {
    setInitConfig(params);
    emit(MODULE_INITIALIZED, undefined);
  }

  var mainEntry = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    initialize: initialize,
  });

  function safeParse(string) {
    if (!string) return {};
    try {
      return JSON.parse(string);
    } catch (e) {
      return {};
    }
  }
  /** @return tuple of `[value, newObject]`
   * `value` is `object.path[0].path[1]` etc. while every node in the way is guaranteed to be an object
   * `newObject` for given `object` will be itself while the full path to `value` added to it if wasn't already exists
   *
   * @note - the original `object` might be modified, but you should always use the returned `newObject` for
   *  case the original one was a premitive or an array.
   */
  function safeGetObject(object, path) {
    const newObject = !object || typeof object !== 'object' || Array.isArray(object) ? {} : object;
    return [
      path.reduce((object, key) => {
        if (key in object) {
          const next = object[key];
          if (next !== null && typeof next === 'object' && !Array.isArray(next)) {
            return next;
          }
        }
        const newValue = {};
        object[key] = newValue;
        return newValue;
      }, newObject),
      newObject,
    ];
  }
  function safeHas(object, path) {
    let currentObject = object;
    return path.every(key => {
      if (
        !currentObject ||
        typeof currentObject !== 'object' ||
        Array.isArray(currentObject) ||
        !(key in currentObject)
      ) {
        return false;
      }
      currentObject = currentObject[key];
      return true;
    }, object);
  }

  const COMMON_STORAGE_KEY = 'tsec';
  const GENERAL_ID_KEY = 'general';
  function getClientKey(isGeneral) {
    return isGeneral ? GENERAL_ID_KEY : initConfig.clientId;
  }
  function getStoredObject(sessionOnly) {
    const storage = sessionOnly ? sessionStorage : localStorage;
    return safeParse(storage.getItem(COMMON_STORAGE_KEY));
  }
  function setStoredObject(sessionOnly, callback) {
    const storage = sessionOnly ? sessionStorage : localStorage;
    const storedObject = getStoredObject(sessionOnly);
    const newValue = callback(storedObject);
    storage.setItem(COMMON_STORAGE_KEY, JSON.stringify(newValue));
  }
  /**
   * Storage module handles local storage and session storgae for multyple modules in
   * same storage key, with JSON serialization. It stores data in 'tsec' key, as an
   * object with that structure:
   * { [moduleSlug]: { [clientId | 'general']: { [key]: value } } }
   */
  function setValue(key, value, options = {}) {
    const idKey = getClientKey(!!options.isGeneral);
    setStoredObject(!!options.sessionOnly, storedObject => {
      const [lastLevel, newObject] = safeGetObject(storedObject, [this.slug.toString(), idKey]);
      lastLevel[key] = value;
      return newObject;
    });
  }
  function removeValue(key, options = {}) {
    const idKey = getClientKey(!!options.isGeneral);
    setStoredObject(!!options.sessionOnly, storedObject => {
      const [lastLevel, newObject] = safeGetObject(storedObject, [this.slug.toString(), idKey]);
      delete lastLevel[key];
      return newObject;
    });
  }
  function getValue(key, options = {}) {
    const idKey = getClientKey(!!options.isGeneral);
    const storedObject = getStoredObject(!!options.sessionOnly);
    const [lastLevel] = safeGetObject(storedObject, [this.slug.toString(), idKey]);
    return lastLevel[key];
  }
  function hasValue(key, options = {}) {
    const idKey = getClientKey(!!options.isGeneral);
    const storedObject = getStoredObject(!!options.sessionOnly);
    return safeHas(storedObject, [this.slug.toString(), idKey, key]);
  }

  var storage = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    COMMON_STORAGE_KEY: COMMON_STORAGE_KEY,
    GENERAL_ID_KEY: GENERAL_ID_KEY,
    getValue: getValue,
    hasValue: hasValue,
    removeValue: removeValue,
    setValue: setValue,
  });

  const ASYMMETRIC_ENCRYPTION_ALGORITHM = 'RSA-OAEP';
  const ASYMMETRIC_SIGN_ALGORITHM = 'RSA-PSS';
  const generateKeyPair = async (algorithm, usages) => {
    return await window.crypto.subtle.generateKey(
      {
        name: algorithm,
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
      },
      false, // setting the private key non-extractable
      usages,
    );
  };
  const generateRSAKeyPair = async () => {
    return await generateKeyPair(ASYMMETRIC_ENCRYPTION_ALGORITHM, ['encrypt', 'decrypt']);
  };
  const generateRSASignKeyPair = async () => {
    return await generateKeyPair(ASYMMETRIC_SIGN_ALGORITHM, ['sign']);
  };
  const encryptAssymetric = async (data, key) => {
    return await window.crypto.subtle.encrypt(
      {
        name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
      },
      key,
      data,
    );
  };
  const decryptAssymetric = async (data, key) => {
    return new Uint8Array(
      await window.crypto.subtle.decrypt(
        {
          name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
        },
        key,
        data,
      ),
    );
  };
  const signAssymetric = async (privateKey, message) => {
    const encoded = new TextEncoder().encode(message);
    const signature = await window.crypto.subtle.sign(
      {
        name: ASYMMETRIC_SIGN_ALGORITHM,
        saltLength: 32,
      },
      privateKey,
      encoded,
    );
    return signature;
  };
  const verifyAssymetric = async (publicKey, message, signature) => {
    const encoded = new TextEncoder().encode(message);
    const isValid = await window.crypto.subtle.verify(
      ASYMMETRIC_SIGN_ALGORITHM,
      publicKey,
      signature,
      encoded,
    );
    return isValid;
  };

  /**
   * @param slug - product name (like 'drs'/'idv' or 'platform' for a global platform shared storage)
   * @param dbName - database name, concatinated later after clientId
   * @param dbVersion - our own database versioning, note that for any table addition/deletion dbVersion must be bumped - DON'T CHANGE IT IF NOT REALLY NECESSARY.
   * @description The database different situations are covered here:
      - database wasn't created yet on the user's browser
      - database was created, but currently closed before we use it
      - database is already opened by another module (extension / this sdk), and requested indexedDB.open with the same version
      - database is already opened with different version by another module - pending (promise) until the previous transaction will be closed - then executing
   */
  class IndexedDBClient {
    constructor(slug, dbName, dbVersion) {
      this.slug = slug;
      this.dbName = dbName;
      this.dbVersion = dbVersion;
    }
    queryObjectStore(objectStoreName, queryStore, options = {}) {
      // One of those databases is supported in any device/browser
      const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;
      // making the database clientId related, so multiple sdks with different clientIds could work in parallel
      const openRequest = indexedDB.open(
        `${this.slug}:${initConfig.clientId}:${this.dbName}`,
        this.dbVersion || 1,
      ); // Opening (or creating) the database
      openRequest.onupgradeneeded = () => {
        var _a;
        const db = openRequest.result;
        if (
          ((_a = db === null || db === void 0 ? void 0 : db.objectStoreNames) === null ||
          _a === void 0
            ? void 0
            : _a.contains) &&
          !db.objectStoreNames.contains(objectStoreName)
        ) {
          // if there's no `tableName` store
          db.createObjectStore(objectStoreName, { keyPath: 'key' });
        }
      };
      openRequest.onsuccess = () => {
        // Start a new transaction
        const db = openRequest.result;
        const transaction = db.transaction(
          objectStoreName,
          (options === null || options === void 0 ? void 0 : options.operation) || 'readwrite',
        );
        const store = transaction.objectStore(objectStoreName);
        queryStore(store);
        // Closing the db when the transaction is done
        transaction.oncomplete = () => {
          db.close();
        };
      };
    }
    put(tableName, key, object) {
      return new Promise((res, rej) => {
        this.queryObjectStore(tableName, objectStore => {
          const request = objectStore.put({ key, value: object });
          request.onsuccess = () => {
            res(request.result);
          };
          request.onerror = err => {
            rej('Failed adding item to objectStore, err: ' + err);
          };
        });
      });
    }
    get(tableName, key) {
      return new Promise((res, rej) => {
        this.queryObjectStore(tableName, objectStore => {
          const request = objectStore.get(key);
          request.onsuccess = () => {
            var _a;
            if (request.result) {
              // since it can trigger 'request.onsuccess' also when the objectStore exist but no such item found (`request.result` would be undefined)
              res((_a = request.result) === null || _a === void 0 ? void 0 : _a.value);
            } else {
              res(undefined);
            }
          };
          request.onerror = err => {
            rej('Failed adding item to objectStore, err: ' + err);
          };
        });
      });
    }
    getAll(tableName, count) {
      return new Promise((res, rej) => {
        this.queryObjectStore(tableName, objectStore => {
          const request = objectStore.getAll(null, count);
          request.onsuccess = () => {
            if (request.result) {
              const itemsList = request.result;
              if (itemsList === null || itemsList === void 0 ? void 0 : itemsList.length) {
                res(
                  itemsList.map(item => (item === null || item === void 0 ? void 0 : item.value)),
                );
              } else {
                res(itemsList);
              }
            } else {
              res([]);
            }
          };
          request.onerror = err => {
            rej('Failed getting items, err: ' + err);
          };
        });
      });
    }
    delete(tableName, key) {
      return new Promise((res, rej) => {
        this.queryObjectStore(tableName, objectStore => {
          const request = objectStore.delete(key);
          request.onsuccess = () => {
            res();
          };
          request.onerror = err => {
            rej(`Failed deleting key: '${key}' from objectStore, err: ` + err);
          };
        });
      });
    }
    clear(tableName) {
      return new Promise((res, rej) => {
        this.queryObjectStore(tableName, objectStore => {
          const request = objectStore.clear();
          request.onsuccess = () => {
            res();
          };
          request.onerror = err => {
            rej('Failed clearing objectStore, err: ' + err);
          };
        });
      });
    }
  }

  const PLATFORM_GLOBAL_SLUG = 'platform';
  const DEFAULT_KEYSTORE_NAME = 'identifiers_store';
  const DEFAULT_DATABASE_NAME = 'ts_crypto_binding';
  const DEFAULT_DB_VERSION = 1;
  const PLATFORM_GLOBAL_KEYS_DB_VERSION = 1; // Change this only when the platform db-version changes, it will effect all products
  /**
   * @param keysType - the purpose of the keys, will use different key generator
   * @param options - typeof CryptoBindingOptions
   */
  class CryptoBinding {
    constructor(agent, keysType = 'sign', options) {
      var _a, _b, _c, _d;
      this.agent = agent;
      this.keysType = keysType;
      this.options = options;
      const isGlobal = !((_a = this.options) === null || _a === void 0 ? void 0 : _a.productScope);
      this.keysDatabaseName =
        isGlobal || !((_b = this.options) === null || _b === void 0 ? void 0 : _b.indexedDBName)
          ? DEFAULT_DATABASE_NAME
          : this.options.indexedDBName;
      this.dbVersion = isGlobal
        ? PLATFORM_GLOBAL_KEYS_DB_VERSION
        : ((_c = this.options) === null || _c === void 0 ? void 0 : _c.dbVersion) ||
          DEFAULT_DB_VERSION;
      this.keysStoreName =
        isGlobal || !((_d = this.options) === null || _d === void 0 ? void 0 : _d.keysStoreName)
          ? DEFAULT_KEYSTORE_NAME
          : this.options.keysStoreName;
      this.indexedDBClient = new IndexedDBClient(
        isGlobal ? PLATFORM_GLOBAL_SLUG : agent.slug,
        this.keysDatabaseName,
        this.dbVersion,
      );
    }
    getKeysRecordKey() {
      return `${this.keysType}_keys`;
    }
    arrayBufferToBase64(arrayBuffer) {
      return window.btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    }
    async getPKRepresentations(publicKey) {
      const exportedKey = await crypto.subtle.exportKey('spki', publicKey);
      return { arrayBufferKey: exportedKey, base64Key: this.arrayBufferToBase64(exportedKey) };
    }
    async generateKeyPair() {
      if (this.keysType == 'sign') {
        return await generateRSASignKeyPair();
      }
      return await generateRSAKeyPair();
    }
    async calcKeyIdentifier(publicKeyExported) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', publicKeyExported);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
    async extractKeysData() {
      const recordKey = this.getKeysRecordKey();
      let keysData = await this.indexedDBClient.get(this.keysStoreName, recordKey);
      if (!keysData) {
        const keys = await this.generateKeyPair();
        const { arrayBufferKey, base64Key } = await this.getPKRepresentations(keys.publicKey);
        this.publicKeyBase64 = base64Key;
        this.keyIdentifier = await this.calcKeyIdentifier(arrayBufferKey);
        keysData = {
          ...keys,
          keyIdentifier: this.keyIdentifier,
        };
        await this.indexedDBClient.put(this.keysStoreName, recordKey, keysData);
      }
      if (!this.publicKeyBase64) {
        // in case `keysData` is already stored in db before this function invokation, but this is the the first extraction
        const { base64Key } = await this.getPKRepresentations(keysData.publicKey);
        this.publicKeyBase64 = base64Key;
        this.keyIdentifier = keysData.keyIdentifier;
      }
      return keysData;
    }
    async getPublicData() {
      if (!this.publicKeyBase64 || !this.keyIdentifier) {
        await this.extractKeysData();
      }
      return { publicKey: this.publicKeyBase64, keyIdentifier: this.keyIdentifier };
    }
    async sign(message) {
      if (this.keysType == 'sign') {
        const { privateKey } = await this.extractKeysData();
        const signatureBuffer = await signAssymetric(privateKey, message);
        return this.arrayBufferToBase64(signatureBuffer);
      }
      throw new Error("keysType must be 'sign' in order to use sign keys");
    }
    async encrypt(data) {
      if (this.keysType == 'encrypt') {
        const { privateKey } = await this.extractKeysData();
        const encrypted = await encryptAssymetric(data, privateKey);
        return encrypted;
      }
      throw new Error("keysType must be 'encrypt' in order to use encryption keys");
    }
    async clearKeys() {
      const recordKey = this.getKeysRecordKey();
      await this.indexedDBClient.delete(this.keysStoreName, recordKey);
    }
  }
  function createCryptoBinding(keysType = 'sign', options) {
    return new CryptoBinding(this, keysType, options);
  }

  var crypto$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createCryptoBinding: createCryptoBinding,
    decryptAssymetric: decryptAssymetric,
    encryptAssymetric: encryptAssymetric,
    generateRSAKeyPair: generateRSAKeyPair,
    generateRSASignKeyPair: generateRSASignKeyPair,
    signAssymetric: signAssymetric,
    verifyAssymetric: verifyAssymetric,
  });

  var indexedDB = /*#__PURE__*/ Object.freeze({
    __proto__: null,
  });

  const agent = Agent.create(agent => {
    class TsError extends Error {
      constructor(errorCode, message) {
        super(`${agent.slug}-${errorCode} ${message}`);
      }
    }
    class TsInternalError extends TsError {
      constructor(errorCode) {
        super(errorCode, 'Internal error');
      }
    }
    return { TsError, TsInternalError };
  });

  var utils = Agent.create(() => ({
    exceptions: agent,
    ...agent$1,
  }));

  class SdkLogger {
    constructor(agent, middlewares = []) {
      this.agent = agent;
      this.middlewares = middlewares;
      this.logs = [];
    }
    info(message, fields) {
      this.pushLog(3, message, fields);
    }
    warn(message, fields) {
      this.pushLog(4, message, fields);
    }
    error(message, fields) {
      this.pushLog(5, message, fields);
    }
    pushLog(severity, message, fields = {}) {
      this.logs.push({
        timestamp: Date.now(),
        module: this.agent.slug,
        severity,
        fields,
        message,
      });
      const middlewareReturnValues = this.middlewares.map(middleware => middleware(this));
      Promise.all(middlewareReturnValues).catch(() => {
        /* ignore */
      });
    }
  }
  function createSdkLogger(middlewares = []) {
    return new SdkLogger(this, middlewares);
  }

  function consoleMiddleware(logger) {
    const log = logger.logs[logger.logs.length - 1];
    console.log(`${log.severity} ${log.message}`, log.fields);
  }

  var logger$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    consoleMiddleware: consoleMiddleware,
    createSdkLogger: createSdkLogger,
  });

  function calculateJsonSize(json) {
    return encodeURI(JSON.stringify(json)).split(/%..|./).length - 1;
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * format URL fragments to ensure correct path, so when both `api/action/something` and  `/api/action/something` are valid inputs
   * @param path partial URL
   * @param search optional search params
   * @returns string
   */
  function urlFragmentFormat(path, search) {
    if (!(path === null || path === void 0 ? void 0 : path.trim())) return '';
    if (isValidUrl(path)) return path;
    const mockDom = 'http://mock.com';
    const mockURL = new URL(mockDom);
    mockURL.search = (search === null || search === void 0 ? void 0 : search.toString()) || '';
    mockURL.pathname = path;
    const res = mockURL.href.replace(mockDom, '');
    return res;
  }

  const REQUEST_HEADERS = {
    'Content-Type': 'application/json',
    'X-TS-client-time': new Date().toUTCString(),
    'X-TS-ua': navigator.userAgent,
  };
  function init(method, body, headers) {
    var _a;
    const size = calculateJsonSize(body || {});
    const sizeHeader = {
      'X-TS-body-size': String(size),
    };
    return {
      method,
      headers: {
        ...sizeHeader,
        ...REQUEST_HEADERS,
        ...(headers || {}),
      },
      body: (_a = body && JSON.stringify(body || {})) !== null && _a !== void 0 ? _a : undefined,
    };
  }
  // implementation of HTTP fetch API. supports POST/GET and returns a promise of a result/failure.
  // full structure for response/failure TBD.
  function httpFetchBuilder(path, httpMethod, body, params, headers) {
    const reqUrl = urlFragmentFormat(path, params);
    const requestInit = init(httpMethod, body, headers);
    return fetch(reqUrl, requestInit);
  }
  async function fetchRequest(path, httpMethod, body, params, headers) {
    let response;
    if (httpMethod === 'GET' || httpMethod === 'DELETE') {
      response = await httpFetchBuilder(path, httpMethod, body, params, headers);
    } else {
      response = await httpFetchBuilder(path, httpMethod, body, params, headers);
    }
    // when debugging, check the response status code and response body
    // console.log('response: ', response);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response;
  }
  /**
   * constructs a `GET` request
   * @param path API path
   * @param params request parameters
   * @returns a promise of the response body if successful and throw an error if failed
   */
  async function httpGet(path, params, headers) {
    const httpRequest = await fetchRequest(path, 'GET', undefined, params, headers);
    return { data: await httpRequest.json(), ...httpRequest, headers: httpRequest.headers };
  }
  /**
   * constructs a `POST` request
   * @param path API path
   * @param data content of the request
   * @param params request parameters
   * @returns a promise of the response body if successful and throw an error if failed
   */
  async function httpPost(path, data, params, headers) {
    const httpRequest = await fetchRequest(path, 'POST', data, params, headers);
    return { data: await httpRequest.json(), ...httpRequest, headers: httpRequest.headers };
  }
  /**
   * constructs a `PUT` request
   * @param path API path
   * @param data content of the request
   * @param params request parameters
   * @returns a promise of the response body if successful and throw an error if failed
   */
  async function httpPut(path, data, params, headers) {
    const httpRequest = await fetchRequest(path, 'PUT', data, params, headers);
    return { data: await httpRequest.json(), ...httpRequest, headers: httpRequest.headers };
  }
  /**
   * constructs a `DELETE` request
   * @param path API path
   * @param body content of the request
   * @param params request parameters
   * @returns a promise of the response body if successful and throw an error if failed
   */
  async function httpDelete(path, headers) {
    const httpRequest = await fetchRequest(path, 'DELETE', undefined, undefined, headers);
    return { data: await httpRequest.json(), ...httpRequest, headers: httpRequest.headers };
  }

  var http = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    httpDelete: httpDelete,
    httpGet: httpGet,
    httpPost: httpPost,
    httpPut: httpPut,
    init: init,
  });

  var Common = Agent.create(() => ({
    events,
    moduleMetadata,
    mainEntry,
    utils,
    storage,
    crypto: crypto$1,
    indexedDB,
    logger: logger$1,
    http,
  }));

  const common = new Common('ido');
  const getTime = () => new Date().getTime();

  var IdoJourneyState;
  (function (IdoJourneyState) {
    IdoJourneyState['Active'] = 'Active';
    IdoJourneyState['Success'] = 'Journey Ended with Success';
    IdoJourneyState['Rejected'] = 'Journey Ended with Rejection';
    IdoJourneyState['Aborted'] = 'Journey aborted by client';
  })(IdoJourneyState || (IdoJourneyState = {}));
  var IdoJourneyType;
  (function (IdoJourneyType) {
    IdoJourneyType['Stateless'] = 'Userless journey';
  })(IdoJourneyType || (IdoJourneyType = {}));

  /**
   * @enum
   * @description The enum for the log levels.
   */
  var LogLevel;
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
  var ErrorCode;
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
  var ClientResponseOptionType;
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
     * @description Client response option type for client failure in the Journey.
     */
    ClientResponseOptionType['Fail'] = 'action_failure';
    /**
     * @description Client response option type for custom branch in the Journey, used for custom branching.
     */
    ClientResponseOptionType['Custom'] = 'custom';
  })(ClientResponseOptionType || (ClientResponseOptionType = {}));
  /**
   * @deprecated
   * @enum
   * @description The enum for the Journey step types.
   */
  var IdoServiceResponseType;
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
  var IdoJourneyActionType;
  (function (IdoJourneyActionType) {
    /**
     * @description `journeyStepId` for a Rejection action.
     */
    IdoJourneyActionType['Rejection'] = 'action:rejection';
    /**
     * @description `journeyStepId` for a Rejection action.
     */
    IdoJourneyActionType['Success'] = 'action:success';
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
     *    "allow_cross_platform_authenticators": <true|false>
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
    /**
       * @description `journeyStepId` for Authentication action.
       * Part of the response received in `idoServiceResponse`:
       * ```json
       * {
       *  "data": {
       *    "methods": [{
       *      "type": "webauthn"
       *     }],
       *    "username": "<USERNAME>",
       *    },
       * }
       * ```
       *
       * Data to send with `submitClientResponse`:
       *
       * Webauthn success:
       * ```json
       *  submitClientResponse(ClientResponseOptionType.ClientInput, {
       *    "type": "webauthn",
       *    "webauthn_encoded_result": "<WEBAUTHN_ENCODED_RESULT_FROM_SDK>"
       *  });
       * ```
    
       * Webauthn cancel
       * ```json
       *  submitClientResponse(ClientResponseOptionType.Cancel, {});
       * ```
       *
       * Webauthn fail (data with escape option)
       * ```json
       *  submitClientResponse(ClientResponseOptionType.Fail, {
       *    "type": "webauthn"
       *  });
       * ```
       */
    IdoJourneyActionType['Authentication'] = 'transmit_platform_authentication';
  })(IdoJourneyActionType || (IdoJourneyActionType = {}));

  class IdoSdkLogger {
    constructor(logLevel = LogLevel.Info) {
      this.logLevel = logLevel;
    }
    setLogLevel(logLevel) {
      if (logLevel < LogLevel.Debug || logLevel > LogLevel.Error) {
        this.error('Invalid log level');
      } else {
        this.logLevel = logLevel;
      }
    }
    debug(message) {
      if (this.logLevel <= LogLevel.Debug) {
        console.debug(`[DEBUG] ${message}`);
      }
    }
    info(message) {
      if (this.logLevel <= LogLevel.Info) {
        console.info(`[INFO] ${message}`);
      }
    }
    warning(message) {
      if (this.logLevel <= LogLevel.Warning) {
        console.warn(`[WARNING] ${message}`);
      }
    }
    error(message) {
      if (this.logLevel <= LogLevel.Error) {
        console.error(`[ERROR] ${message}`);
      }
    }
  }

  const generateRandomString = (length = 32) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += characters.charAt(randomValues[i] % charactersLength);
    }
    return result;
  };
  const get = (object, path, defaultValue) => {
    if (!object || typeof object !== 'object') {
      return defaultValue;
    }
    const pathArray = Array.isArray(path) ? path : path.split('.');
    let result = object;
    for (let i = 0; i < pathArray.length; i++) {
      const key = pathArray[i];
      result = result[key];
      if (result === undefined) {
        return defaultValue;
      }
    }
    return result;
  };
  const mapJsonReplacer = (_, value) => {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()),
      };
    } else {
      return value;
    }
  };
  const mapJsonReviver = (_, value) => {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  };
  const CRYPTO_DEVICE_JOURNEY_PARAM_FIELD = 'ts:idosdk:device';
  const DEFAULT_POLLING_TIMEOUT = 3; // seconds
  const DEFAULT_APPLICATION_ID = 'default_application';
  const logger = new IdoSdkLogger();
  const CRYPTO_BINDING_FIELD_UPDATE_MAP = {
    [IdoJourneyActionType.CryptoBindingRegistration]: 'input',
    [IdoJourneyActionType.CryptoBindingValidation]: 'input',
    [IdoJourneyActionType.RegisterDeviceAction]: 'data',
    [IdoJourneyActionType.ValidateDeviceAction]: 'data',
  };

  const BASE_PATH = 'api/v2/';
  const ENDPOINTS_SCHEMA = {
    login: {
      path: 'auth/login',
    },
    bind: {
      path: 'auth/bind',
    },
    policy: {
      path: 'auth/login',
    },
    userless: {
      path: 'auth/anonymous_invoke',
    },
    assert: {
      path: 'auth/assert',
    },
    logout: {
      path: 'auth/logout',
    },
    poll: {
      path: 'auth/poll',
    },
    debug: {
      path: 'auth/create_debug_token',
    },
  };
  const BODY_SCHEMA = {
    headers: {
      mandatory: true,
      dummy: [
        {
          type: 'flow_id',
          flow_id: '337BFFE6BEE7D694B8FA41F42B00742CA537DC398F79369A3A60E04D0EB2E8E1',
        },
      ],
    },
    data: {
      mandatory: true,
      dummy: {
        collection_result: {
          metadata: {
            timestamp: getTime(),
          },
          content: {},
        },
        policy_request_id: 'LoginWithMenu',
        params: {},
      },
      large_dummy: {
        metadata: {
          timestamp: 1679422144431,
        },
        content: {
          device_details: {
            logged_users: 1,
            persistence_mode: 'persistent',
            device_id: '8951bd7b67a959e7b12b5018816f9ce4',
            os_type: 'Mac OS',
            os_version: '10.15.7',
            device_model: 'Chrome 111.0.0.0',
          },
          location: {
            enabled: false,
          },
          capabilities: {
            fido2_user_verifying_platform_authenticator_available: true,
            audio_acquisition_supported: true,
            finger_print_supported: false,
            image_acquisition_supported: false,
            persistent_keys_supported: true,
            face_id_key_bio_protection_supported: false,
            fido_client_present: false,
            fido2_client_present: true,
            dyadic_present: false,
            installed_plugins: [],
          },
          collector_state: {
            accounts: 'disabled',
            devicedetails: 'active',
            contacts: 'disabled',
            owner: 'disabled',
            software: 'disabled',
            location: 'disabled',
            locationcountry: 'disabled',
            bluetooth: 'disabled',
            externalsdkdetails: 'active',
            hwauthenticators: 'active',
            capabilities: 'active',
            fidoauthenticators: 'disabled',
            largedata: 'active',
            localenrollments: 'active',
            devicefingerprint: 'active',
            apppermissions: 'disabled',
          },
          local_enrollments: {},
        },
        fp2: {
          user_agent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
          webdriver: true,
          language: 'en-US',
          color_depth: 30,
          device_memory: 8,
          pixel_ratio: 2,
          hardware_concurrency: 12,
          screen_resolution: [1680, 1050],
          available_screen_resolution: [1680, 1025],
          timezone_offset: 240,
          timezone: 'America/New_York',
          session_storage: true,
          local_storage: true,
          indexed_db: true,
          add_behavior: false,
          open_database: true,
          cpu_class: 'not available',
          platform: 'MacIntel',
          do_not_track: 'not available',
          plugins: [
            [
              'PDF Viewer',
              'Portable Document Format',
              [
                ['application/pdf', 'pdf'],
                ['text/pdf', 'pdf'],
              ],
            ],
            [
              'Chrome PDF Viewer',
              'Portable Document Format',
              [
                ['application/pdf', 'pdf'],
                ['text/pdf', 'pdf'],
              ],
            ],
            [
              'Chromium PDF Viewer',
              'Portable Document Format',
              [
                ['application/pdf', 'pdf'],
                ['text/pdf', 'pdf'],
              ],
            ],
            [
              'Microsoft Edge PDF Viewer',
              'Portable Document Format',
              [
                ['application/pdf', 'pdf'],
                ['text/pdf', 'pdf'],
              ],
            ],
            [
              'WebKit built-in PDF',
              'Portable Document Format',
              [
                ['application/pdf', 'pdf'],
                ['text/pdf', 'pdf'],
              ],
            ],
          ],
          canvas: [
            'canvas winding:yes',
            'canvas fp:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB9AAAADICAYAAACwGnoBAAAAAXNSR0IArs4c6QAAIABJREFUeF7s3XeYXVW9//H3Omdaeu+FGgiE9BDAgmIBQRRQ4eIP0JCQmdC8YgHrZRQLAooSSjIpRMpVCZciiIAiKhoIpEMoUtILKaS3KWf/nu8+e0/2nDkzc+bMmckMfNbz8Ejm7L3W2q8zwT8++/tdjlY+PLz+wAhgKHA0MBjoB/QEDq9j+6uAzcAGYDXwFvA6sMzh1of3eHjtgWHA8ZH/7Qa0q+Mfu3VfHf9sA14Flof/63B7q/fn5fY5cAefo5V/hdqeBCQgAQlIQAISkIAEJCABCUhAAhKQgAQkIAEJSEACEpCABCQggTYh4FrbLj2844BPAh8FTg4C81xucyewBygAeuRy4uhcrwF/6sx7Tw3lwMKT6LDtNDr7T2Sxf26GvRjwAvBP4G84Z0tmNLxivIwufJ9d5Mpodb/v7zNiPY4EJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkIAE2rRAqwgUPbyTgC8AnwMsQG+TYz7wEPAYUGeaPQr4MPCh4BWBQTl7VFvSln4I52wrdQ4F6Dkz10QSkIAEJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkMD7SOCQBegenlV/XwpMCtqzt0nWrcDdwKygR3yjH+IU4LPBqwPWqD43w8J029IcnLMt1hgK0HODrFkkIAEJSEACEpCABCQgAQlIQAISkIAEJCABCUhAAhKQgAQkIIH3l0D9AXppaR6lpZX+I0f/vQkGHt5w4EqgJJNprNf4GnYzgA7EcWxhPz0pyuTWjK7ZxgG6UehfW0mCchK0J6/Be18G7gCmN3ilPYER5jd4JacDnw/CdDvpPXXsPQDxOBQ2vL/IrdOAO3HOtuwPC9C3056uHDyiveHNte0rttCRXmW7c/PCSH1/F+r6LJt72ja5di8BCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkIAEJCCBNidQO1CcNPNo4lU/Ak7AeTvwXAc8twbnHUdl3jhmT9qVzVN6eFZf/W3g4kzvf43tXMW/6EIBf2Ud/+YcRvAgD3E653F4ptOkve6fbOBbvEARcZ7lc3ydefyW//AHPsWZ1N1XfRlwM3Bfg6sngEWA5dZ2lHsjOtPb+wHWzN7C9C8DO3fD3Bdg4Ttw3blwZO8GV09zwb3ALUyZftyR3pbfn83L/IY/ZDNPm7vnGYbyKa6BWGI40y5/JesHmDTzMPIqLwGOwnPjgd9QVlLmzze5bAKxxEA8Z9+Y/ZpcR1nJarK5J+sN6kYJSEACEpCABCQgAQlIQAISkIAEJCABCUhAAhKQgAQkIAEJSKApAjUD9MllZ+K8J/DcNLZ3/W/mXlBOaWmMDX2/h+duIBHry8zJ7zZmQQ+vF3B9UHXemFv5DE9QwvF+oD2L15nAMfyOt/3wvEcOqtBLeI632MEznM1G9tKP+3iCM9MG6JuAHwdV55k/hIXoM4PDzhsRoEcXOAGYAHxmG9w2tykBejjrHeNLrrvyZFa1ugB9PV1ZS1fGszJz4gyutGr7uYyluPD8IqZ+7UAGt6S/ZHLZTJx3P2Ulz/qBufPuJq+yH55rT2XeLGYUn+Z3aljfbwUwl7KSb5DNPVlvUDdKQAISkIAEJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAJNETgYoF9+Zzeq4quAFfTfMJrSUkt/D47JZc/iuYnMnGzhYEbDw7sK+CnQOaMbUi7qzN0NVoRnM294z38zD6tyf5qz2EE5XZmTNkC/Hfi+FYJntZidkN7ICvR06/TfBX1+B788F07LqgK9eta8kmv4CBt4thVVoO8jnzP4b67mWc5nYVbSDd3kymhaC/eSaU+SiC1hRvF3KJ4+FHgN532RRGwjzvs35QXdmHPpdoqn3w+Mo6zkWLK5p6EH0ecSkIAEJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkECzCBwMFIunX+6fle25S5lRPKfWapfNOI5YYj0wFRjmH/+diC3Eeb8hlojjuespK3ma4um39NhUOOL5x88teKRy5cfWsofx9OYuXuUIOvFTTuQJVnMfb/lnmc/k1Fpnmr/Bdn7CYu7jTT7NQAbRgV9wEovYwu94iy9zNKczkASeP6+1Y99DJcfSlR8yhnbEeYxVzOYNJnIsv+YVzmAgP2AMv+Zl/swaulHA62ynH+15MhKg38h4/sMO/sVGPs3R/IfR/IUYYDXo9u7APvDPDv8Y0A74D/AOcDzwFrANOBGqW8yHAfoQ8IPh7UBfwDrap+a5Nu/rwA7ACqUtKG8PWFZrnfN/B+3PhQsLoO+L0KcSThqS/OfNjfDnRfCpkbBtF7z4Fpx0DCx8GzZuh48Ng9NtTTt9/hpgC0f564xlLOuYzT104ABv+d/Vx/xK8G104G7mMMDfc3JUEqOEi1nCIE7jDW7hQd6hJ5O5hE/xOt/lz2yiE9/jPJYxgE/yOpfzDwbzHj/lLJ7jaH++…brB0xZVAGAtqpyy+87fNf4HUyf1sNzSz83GXvYnYKXM6qTDBVhJ29tL7uzrJF+rcOC5Dy8Hq5efB1QGSkNdigBLnWXzB/zn10h7RWRj1hcaCpHOK7cB1fwKc4cvBQCWL6UDjnPuTG//1SRguT7Vqy8CqoAWMXRFBQBWRaE0X3bu9kH/avgtoVv6ndkDVJq9tRY7wErc8bOvknxFBt+/csByS787LgGqxK1PMj2AlaStg6TOvmLQv3JLv9f+FVAlbnnS6QGspO0VOXerbBaF/PoNfwNUiVttIj2AlbjNZ2+W9l2XgVXiNptJD2CZsZpEUUC/AgBLv4dkgAJmFABYZqwmURTQrwDA0u8hGaCAGQUAlhmrSRQF9CsAsPR7SAYoYEYBgGXGahJFAf0K/B9qEBa1B23aowAAAABJRU5ErkJggg==',
            'extensions:ANGLE_instanced_arrays;EXT_blend_minmax;EXT_color_buffer_half_float;EXT_disjoint_timer_query;EXT_float_blend;EXT_frag_depth;EXT_shader_texture_lod;EXT_texture_compression_rgtc;EXT_texture_filter_anisotropic;EXT_sRGB;KHR_parallel_shader_compile;OES_element_index_uint;OES_fbo_render_mipmap;OES_standard_derivatives;OES_texture_float;OES_texture_float_linear;OES_texture_half_float;OES_texture_half_float_linear;OES_vertex_array_object;WEBGL_color_buffer_float;WEBGL_compressed_texture_s3tc;WEBGL_compressed_texture_s3tc_srgb;WEBGL_debug_renderer_info;WEBGL_debug_shaders;WEBGL_depth_texture;WEBGL_draw_buffers;WEBGL_lose_context;WEBGL_multi_draw',
            'webgl aliased line width range:[1, 1]',
            'webgl aliased point size range:[1, 8191]',
            'webgl alpha bits:8',
            'webgl antialiasing:yes',
            'webgl blue bits:8',
            'webgl depth bits:24',
            'webgl green bits:8',
            'webgl max anisotropy:16',
            'webgl max combined texture image units:32',
            'webgl max cube map texture size:16384',
            'webgl max fragment uniform vectors:1024',
            'webgl max render buffer size:16384',
            'webgl max texture image units:16',
            'webgl max texture size:16384',
            'webgl max varying vectors:32',
            'webgl max vertex attribs:16',
            'webgl max vertex texture image units:16',
            'webgl max vertex uniform vectors:1024',
            'webgl max viewport dims:[16384, 16384]',
            'webgl red bits:8',
            'webgl renderer:WebKit WebGL',
            'webgl shading language version:WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
            'webgl stencil bits:0',
            'webgl vendor:WebKit',
            'webgl version:WebGL 1.0 (OpenGL ES 2.0 Chromium)',
            'webgl unmasked vendor:Google Inc. (ATI Technologies Inc.)',
            'webgl unmasked renderer:ANGLE (ATI Technologies Inc., AMD Radeon Pro 560X OpenGL Engine, OpenGL 4.1)',
            'webgl vertex shader high float precision:23',
            'webgl vertex shader high float precision rangeMin:127',
            'webgl vertex shader high float precision rangeMax:127',
            'webgl vertex shader medium float precision:23',
            'webgl vertex shader medium float precision rangeMin:127',
            'webgl vertex shader medium float precision rangeMax:127',
            'webgl vertex shader low float precision:23',
            'webgl vertex shader low float precision rangeMin:127',
            'webgl vertex shader low float precision rangeMax:127',
            'webgl fragment shader high float precision:23',
            'webgl fragment shader high float precision rangeMin:127',
            'webgl fragment shader high float precision rangeMax:127',
            'webgl fragment shader medium float precision:23',
            'webgl fragment shader medium float precision rangeMin:127',
            'webgl fragment shader medium float precision rangeMax:127',
            'webgl fragment shader low float precision:23',
            'webgl fragment shader low float precision rangeMin:127',
            'webgl fragment shader low float precision rangeMax:127',
            'webgl vertex shader high int precision:0',
            'webgl vertex shader high int precision rangeMin:31',
            'webgl vertex shader high int precision rangeMax:30',
            'webgl vertex shader medium int precision:0',
            'webgl vertex shader medium int precision rangeMin:31',
            'webgl vertex shader medium int precision rangeMax:30',
            'webgl vertex shader low int precision:0',
            'webgl vertex shader low int precision rangeMin:31',
            'webgl vertex shader low int precision rangeMax:30',
            'webgl fragment shader high int precision:0',
            'webgl fragment shader high int precision rangeMin:31',
            'webgl fragment shader high int precision rangeMax:30',
            'webgl fragment shader medium int precision:0',
            'webgl fragment shader medium int precision rangeMin:31',
            'webgl fragment shader medium int precision rangeMax:30',
            'webgl fragment shader low int precision:0',
            'webgl fragment shader low int precision rangeMin:31',
            'webgl fragment shader low int precision rangeMax:30',
          ],
          webgl_vendor_and_renderer:
            'Google Inc. (ATI Technologies Inc.)~ANGLE (ATI Technologies Inc., AMD Radeon Pro 560X OpenGL Engine, OpenGL 4.1)',
          ad_block: false,
          has_lied_languages: false,
          has_lied_resolution: false,
          has_lied_os: false,
          has_lied_browser: false,
          touch_support: [0, false, false],
          fonts: [
            'Andale Mono',
            'Arial',
            'Arial Black',
            'Arial Hebrew',
            'Arial Narrow',
            'Arial Rounded MT Bold',
            'Arial Unicode MS',
            'Comic Sans MS',
            'Courier',
            'Courier New',
            'Geneva',
            'Georgia',
            'Helvetica',
            'Helvetica Neue',
            'Impact',
            'LUCIDA GRANDE',
            'Microsoft Sans Serif',
            'Monaco',
            'Palatino',
            'Tahoma',
            'Times',
            'Times New Roman',
            'Trebuchet MS',
            'Verdana',
            'Wingdings',
            'Wingdings 2',
            'Wingdings 3',
          ],
          fonts_flash: 'swf object not loaded',
          audio: '124.04347657808103',
          enumerate_devices: [
            'id=;gid=;audioinput;',
            'id=;gid=;videoinput;',
            'id=;gid=;audiooutput;',
          ],
        },
      },
      policy_request_id: 'LoginWithMenu',
      params: {},
    },
  };
  const FIELDS_TO_EXTRACT_FROM_DATA = [{ 'control_flow.0': ['assertion_id', 'type'] }];

  class IdoSdkError extends Error {
    constructor(description, errorCode) {
      logger.error(`[ERROR] ${description}`);
      super(description);
      this.description = description;
      this.errorCode = errorCode;
    }
  }

  var JourneyState;
  (function (JourneyState) {
    JourneyState['JsonRejection'] = 'Json Rejection';
    JourneyState['TextRejection'] = 'Text Rejection';
    JourneyState['UpdateAction'] = 'Update Action';
    JourneyState['NextAction'] = 'Next Action';
    JourneyState['JourneyEnd'] = 'Journey End';
  })(JourneyState || (JourneyState = {}));
  var IdoJourneyResponseState;
  (function (IdoJourneyResponseState) {
    IdoJourneyResponseState['Pending'] = 'pending';
    IdoJourneyResponseState['Completed'] = 'completed';
    IdoJourneyResponseState['Rejected'] = 'rejected';
  })(IdoJourneyResponseState || (IdoJourneyResponseState = {}));
  var IdoActionType;
  (function (IdoActionType) {
    IdoActionType['Form'] = 'form';
    IdoActionType['Rejection'] = 'rejection';
    IdoActionType['Information'] = 'information';
    IdoActionType['DebugBreak'] = 'debug_break';
    IdoActionType['WaitForTicket'] = 'wait_for_ticket';
    IdoActionType['DrsTriggerAction'] = 'transmit_acp';
    IdoActionType['IdentityVerification'] = 'kyc';
    IdoActionType['WebAuthnRegistration'] = 'transmit_platform_web_authn_registration';
  })(IdoActionType || (IdoActionType = {}));

  class IdoAPI {
    constructor(serverUrl) {
      this.urlBaseString = serverUrl + '/' + BASE_PATH;
    }
    convertHttpResponseToRawServiceResponse(httpResponse) {
      const { status, statusText, body } = httpResponse;
      const { error_code, error_message, headers, data } = body;
      const aggregatedData = this.buildAggregatedData(data);
      return {
        status,
        statusText,
        error_code,
        error_message,
        headers,
        data: aggregatedData,
      };
    }
    buildAggregatedData(data) {
      switch (data === null || data === void 0 ? void 0 : data.state) {
        case IdoJourneyResponseState.Pending:
          FIELDS_TO_EXTRACT_FROM_DATA.forEach(extractionField => {
            const [[fieldName, fieldsToExtract]] = Object.entries(extractionField);
            // Check if the extraction field exists in the "data" property
            const fieldData = get(data, fieldName);
            if (fieldData) {
              const extractedData = {};
              // Extract the specified fields from the extraction field
              fieldsToExtract.forEach(field => {
                if (field in fieldData) {
                  extractedData[field] = fieldData[field];
                }
              });
              // Assign the extracted data to the parent "data" property
              data = {
                ...data,
                ...extractedData,
              };
            }
          });
          break;
        case IdoJourneyResponseState.Rejected:
          data.type = IdoActionType.Rejection;
          break;
      }
      return data;
    }
    /**
     * @param {String} endpoint
     * @param {Array} headers
     * @param {String} payload
     * @returns {Promise}
     * @throws {Error}
     * @throws {TypeError}
     * @throws {SyntaxError}
     * @throws {URIError}
     * @throws {RangeError}
     * @throws {ReferenceError}
     * @throws {EvalError}
     * @throws {InternalError}
     */
    async sendRequest(endpoint, query_params, payload) {
      if (!(this.urlBaseString.toString().length > BASE_PATH.length && endpoint)) {
        throw new Error('bad input');
      }
      const url = new URL(this.urlBaseString);
      url.pathname += endpoint;
      console.log(`Got Full URL: ${url.toString()}`);
      Object.keys(query_params).map(key => {
        return url.searchParams.append(key, query_params[key]);
      });
      const body = JSON.stringify(payload);
      console.log(`Request body: ${body}`);
      return fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-type': 'application/json;charset=UTF-8' },
        body,
      }).then(response =>
        response
          .json()
          .then(body =>
            this.convertHttpResponseToRawServiceResponse({
              ...response,
              body,
            }),
          )
          .catch(_error => {
            throw new IdoSdkError(
              'Error occurred while retrieving response from server',
              ErrorCode.NetworkError,
            );
          }),
      );
    }
  }

  class MissingResponseError extends Error {
    constructor() {
      super('Missing response data');
    }
  }
  class MissingJourneyTypePath extends Error {
    constructor(journeyType) {
      super(`Missing path for ${journeyType} journey type`);
    }
  }

  class IdoJourney {
    constructor(journeyType, journeyId, additionalParams) {
      this.journeyType = journeyType;
      this.journeyId = journeyId;
      this.additionalParams = additionalParams;
      if (!(this.journeyType && this.journeyId)) {
        throw Error('Journey Id must be provided');
      }
      this.state = IdoJourneyState.Active;
    }
    invocationData() {
      const data = BODY_SCHEMA.data.dummy;
      data['policy_request_id'] = this.journeyId;
      data['params'] = this.additionalParams;
      return data;
    }
    path() {
      switch (this.journeyType) {
        case IdoJourneyType.Stateless:
          return ENDPOINTS_SCHEMA.userless.path;
        default:
          throw new MissingJourneyTypePath(this.journeyType);
      }
    }
    complete() {
      if (this.isCompletedState()) {
        throw Error(
          `Cannot complete an already completed journey. Current state: ${this.state.toString()}`,
        );
      }
      this.challenge = undefined;
      this.state = IdoJourneyState.Success;
    }
    reject() {
      if (this.isCompletedState()) {
        throw Error(
          `Cannot complete an already completed journey. Current state: ${this.state.toString()}`,
        );
      }
      this.challenge = undefined;
      this.state = IdoJourneyState.Rejected;
    }
    abort() {
      if (this.isCompletedState()) {
        throw Error(
          `Cannot complete an already completed journey. Current state: ${this.state.toString()}`,
        );
      }
      this.challenge = undefined;
      this.state = IdoJourneyState.Aborted;
    }
    active() {
      if (this.isCompletedState()) {
        throw Error(`Cannot run a completed journey. Current state: ${this.state.toString()}`);
      }
      this.state = IdoJourneyState.Active;
    }
    isCompletedState() {
      return (
        this.state === IdoJourneyState.Success ||
        this.state === IdoJourneyState.Rejected ||
        this.state === IdoJourneyState.Aborted
      );
    }
  }

  const FIELDS_TO_REMOVE_FROM_CONTROL_FLOW = [
    'assertion_id',
    'type',
    'escapes',
    'form_id',
    'vendor_name',
  ];
  const FIELDS_TO_REMOVE_FROM_DATA = [
    ...FIELDS_TO_REMOVE_FROM_CONTROL_FLOW,
    'challenge',
    'assertion_error_code',
    'assertion_error_message',
    'assertions_complete',
    'state',
    'control_flow',
    'failure_data',
    'rejection_data',
  ];
  const ESCAPE_OPTIONS_MAP = {
    [ClientResponseOptionType.Cancel]: ClientResponseOptionType.Cancel,
    [ClientResponseOptionType.Fail]: ClientResponseOptionType.Fail,
  };

  const CLIENT_INPUT_UPDATE_REQUIRED_STATUS_CODE = 16;
  class IdoServiceResponseHelper {
    constructor(rawResponse) {
      var _a, _b, _c;
      this.rawResponse = rawResponse;
      const [{ escapes, form_id }] =
        (_b = (_a = rawResponse.data) === null || _a === void 0 ? void 0 : _a.control_flow) !==
          null && _b !== void 0
          ? _b
          : [{}];
      this.escapes = escapes;
      this.data = (_c = rawResponse.data) !== null && _c !== void 0 ? _c : {};
      this.formId = form_id;
    }
    generateServiceResponse(actionType) {
      const type = this.getType();
      return {
        type,
        journeyStepId: this.getJourneyStepId(actionType),
        data: this.getData(),
        clientResponseOptions: this.getClientResponseActions(),
        rejectionReason: this.rejectionReason,
      };
    }
    getActionType() {
      return this.data.type;
    }
    getChallenge() {
      return this.data.challenge;
    }
    getAssertionId() {
      return this.data.assertion_id;
    }
    getJourneyState() {
      var _a, _b;
      let state;
      if (this.rawResponse.status >= 400) {
        state = JourneyState.TextRejection;
      } else if (this.data.assertion_error_code && this.data.assertion_error_code !== 0) {
        state =
          this.data.state == IdoJourneyResponseState.Pending
            ? JourneyState.UpdateAction
            : JourneyState.JsonRejection;
      } else if (
        this.data.assertions_complete &&
        this.data.state == IdoJourneyResponseState.Completed
      ) {
        state = JourneyState.JourneyEnd;
      } else {
        if (
          (_b = (_a = this.rawResponse) === null || _a === void 0 ? void 0 : _a.data) === null ||
          _b === void 0
            ? void 0
            : _b.control_flow
        ) {
          state = JourneyState.NextAction;
        } else {
          state = JourneyState.UpdateAction;
        }
      }
      return state;
    }
    getType() {
      let responseType = IdoServiceResponseType.JourneyRejection;
      if (this.data.assertions_complete) {
        responseType = IdoServiceResponseType.JourneySuccess;
      } else if (!this.data.assertions_complete && this.data.assertion_error_code) {
        responseType = IdoServiceResponseType.JourneyRejection;
      } else if (this.data.state === IdoJourneyResponseState.Pending) {
        responseType = IdoServiceResponseType.ClientInputRequired;
      } else if (this.data.assertion_error_code == CLIENT_INPUT_UPDATE_REQUIRED_STATUS_CODE) {
        responseType = IdoServiceResponseType.ClientInputUpdateRequired;
      } else if (this.rawResponse.error_code === 4001) {
        responseType = IdoServiceResponseType.JourneyRejection;
      }
      return responseType;
    }
    getData() {
      var _a, _b;
      const [controlFlowData] = (_a = this.data.control_flow) !== null && _a !== void 0 ? _a : [{}];
      const { data: internalData, ...restData } =
        (_b = this.data) !== null && _b !== void 0 ? _b : {};
      const { json_data, ...data } =
        internalData !== null && internalData !== void 0 ? internalData : {};
      this.removeFields(controlFlowData, FIELDS_TO_REMOVE_FROM_CONTROL_FLOW);
      this.data = {
        ...restData,
        ...controlFlowData,
        ...(json_data && { json_data }),
        ...(Object.keys(data).length && { data }),
      };
      this.removeFields(this.data, FIELDS_TO_REMOVE_FROM_DATA);
      return this.data;
    }
    removeFields(data, fieldsToRemove) {
      for (const field of fieldsToRemove) {
        if (field in data) {
          delete data[field];
        }
      }
    }
    getJourneyStepId(actionType) {
      const serviceResponseType = this.getType();
      if (serviceResponseType === IdoServiceResponseType.JourneyRejection) {
        this.rejectionReason = this.rawResponse.error_message;
        return IdoJourneyActionType.Rejection;
      } else if (serviceResponseType === IdoServiceResponseType.JourneySuccess) {
        return IdoJourneyActionType.Success;
      }
      switch (actionType) {
        case IdoActionType.Form:
          return this.formIdToStepId() || this.formId || actionType;
        case IdoActionType.Information:
          return IdoJourneyActionType.Information;
        case IdoActionType.DebugBreak:
          return IdoJourneyActionType.DebugBreak;
        case IdoActionType.WaitForTicket:
          return IdoJourneyActionType.WaitForAnotherDevice;
        case IdoActionType.Rejection:
          return IdoJourneyActionType.Rejection;
        case IdoActionType.DrsTriggerAction:
          return IdoJourneyActionType.DrsTriggerAction;
        case IdoActionType.IdentityVerification:
          return IdoJourneyActionType.IdentityVerification;
        case IdoActionType.WebAuthnRegistration:
          return IdoJourneyActionType.WebAuthnRegistration;
        default:
          return actionType || '';
      }
    }
    formIdToStepId() {
      return this.formId;
    }
    getClientResponseActions() {
      var _a;
      const clientResponseActions = new Map([
        [
          ClientResponseOptionType.ClientInput,
          {
            type: ClientResponseOptionType.ClientInput,
            id: 'client_input',
            label: 'Client Input',
          },
        ],
      ]);
      (_a = this.escapes) === null || _a === void 0
        ? void 0
        : _a.forEach(({ id, display_name: label }) => {
            var _a;
            const type =
              (_a = ESCAPE_OPTIONS_MAP[id]) !== null && _a !== void 0
                ? _a
                : ClientResponseOptionType.Custom;
            clientResponseActions.set(id, {
              type,
              id,
              label,
            });
          });
      return clientResponseActions;
    }
  }

  class IdoSdk {
    constructor() {
      this.flowId = '';
      this.getIdentifier = (response, identifier) => {
        var _a;
        const identifierValue =
          (_a = response.headers.find(header => identifier in header)) === null || _a === void 0
            ? void 0
            : _a[identifier];
        logger.debug(`Getting identifier ${identifier} from response, value: ${identifierValue}`);
        return identifierValue;
      };
    }
    async init(clientId, options) {
      if (!clientId || !options) {
        throw new IdoSdkError('Invalid initialization configuration', ErrorCode.InvalidInitOptions);
      }
      const { applicationId, serverPath, logLevel, pollingTimeout } = options;
      if (!applicationId || !serverPath) {
        throw new IdoSdkError('Invalid initialization options', ErrorCode.InvalidInitOptions);
      }
      logger.setLogLevel(logLevel !== null && logLevel !== void 0 ? logLevel : LogLevel.Info);
      this.pollingTimeout =
        pollingTimeout !== null && pollingTimeout !== void 0
          ? pollingTimeout
          : DEFAULT_POLLING_TIMEOUT;
      this.clientId = clientId;
      this.serverPath = serverPath;
      this.applicationId =
        applicationId !== null && applicationId !== void 0 ? applicationId : DEFAULT_APPLICATION_ID;
      this.api = new IdoAPI(this.serverPath);
      logger.info('IdoSdk initialized successfully');
    }
    async startJourney(journeyId, options) {
      const { additionalParams, flowId } = options !== null && options !== void 0 ? options : {};
      this.flowId = flowId !== null && flowId !== void 0 ? flowId : generateRandomString();
      this.journey = new IdoJourney(IdoJourneyType.Stateless, journeyId, additionalParams);
      return this.invokeJourney(this.journey);
    }
    async submitClientResponse(clientResponseOptionId, data) {
      var _a, _b, _c, _d, _e;
      if (!this.journey) {
        throw new IdoSdkError(
          'Error occurred while trying to submit client response since no journey is active',
          ErrorCode.NoActiveJourney,
        );
      }
      const bodyData = {
        assertion_id: (_a = this.journey) === null || _a === void 0 ? void 0 : _a.assertionId,
        action: (_b = this.journey) === null || _b === void 0 ? void 0 : _b.actionType,
        assert: 'action',
        input: data,
      };
      if (!(data === null || data === void 0 ? void 0 : data.fch)) {
        // add unsigned challenge
        bodyData.fch = (_c = this.journey) === null || _c === void 0 ? void 0 : _c.challenge;
      }
      if (clientResponseOptionId === ClientResponseOptionType.ClientInput) {
        switch (
          (_d = this.lastServiceResponse) === null || _d === void 0 ? void 0 : _d.journeyStepId
        ) {
          case IdoJourneyActionType.CryptoBindingRegistration:
          case IdoJourneyActionType.RegisterDeviceAction:
          case IdoJourneyActionType.CryptoBindingValidation:
          case IdoJourneyActionType.ValidateDeviceAction:
            await this.handleCryptoBindingStep(bodyData);
            break;
          case IdoJourneyActionType.WaitForAnotherDevice:
            return await this.handleWaitForAnotherDeviceAction(bodyData);
          case IdoJourneyActionType.DrsTriggerAction:
          case IdoJourneyActionType.IdentityVerification:
          case IdoJourneyActionType.WebAuthnRegistration:
          case IdoJourneyActionType.Authentication:
            this.handleDataAction(bodyData, data);
            break;
        }
      } else {
        this.handleClientResponseOption(clientResponseOptionId, data, bodyData);
      }
      try {
        const response = await ((_e = this.api) === null || _e === void 0
          ? void 0
          : _e.sendRequest(ENDPOINTS_SCHEMA.assert.path, this.getQueryParams(), {
              headers: this.getInternalHeaders(),
              data: bodyData,
            }));
        if (!response) {
          throw new MissingResponseError();
        }
        const serviceResponse = this.handleServiceResponse(response);
        return serviceResponse;
      } catch (error) {
        this.rejectJourney();
        throw error;
      }
    }
    handleClientResponseOption(clientResponseOptionId, data, bodyData) {
      delete bodyData.input;
      bodyData.assert = 'escape';
      bodyData.data = {
        escape_id: clientResponseOptionId,
        escape_params: data,
      };
    }
    async handleCryptoBindingStep(bodyData) {
      const cryptoBinding = common.crypto.createCryptoBinding('sign');
      const cryptoBindingField = await this.handleCryptoBindingFieldValue(cryptoBinding);
      this.handleCryptoBindingActionPayload(bodyData, cryptoBindingField);
    }
    handleCryptoBindingActionPayload(bodyData, cryptoBindingField) {
      const updateProperty =
        CRYPTO_BINDING_FIELD_UPDATE_MAP[this.lastServiceResponse.journeyStepId];
      bodyData[updateProperty] = {
        ...bodyData[updateProperty],
        [CRYPTO_DEVICE_JOURNEY_PARAM_FIELD]: cryptoBindingField,
      };
    }
    handleDataAction(bodyData, data) {
      delete bodyData.input;
      bodyData.assert = 'data';
      bodyData.data = data;
    }
    async handleCryptoBindingFieldValue(cryptoBinding) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j;
      switch (
        (_a = this.lastServiceResponse) === null || _a === void 0 ? void 0 : _a.journeyStepId
      ) {
        case IdoJourneyActionType.CryptoBindingRegistration:
        case IdoJourneyActionType.RegisterDeviceAction:
          const { keyIdentifier, publicKey } =
            (_b = await cryptoBinding.getPublicData()) !== null && _b !== void 0 ? _b : {};
          return {
            platform_device_id: keyIdentifier,
            platform_device_key: publicKey,
          };
        case IdoJourneyActionType.CryptoBindingValidation:
        case IdoJourneyActionType.ValidateDeviceAction:
          // getPublicData is expected to create a new key here, or load an existing key if one was previously created
          // (e.g. if DRS SDK was activated before the IDO SDK - this could happen)
          // In any case the public key is sent to the server side, which will use it in future validation steps.
          const { keyIdentifier: platform_device_id } =
            (_c = await cryptoBinding.getPublicData()) !== null && _c !== void 0 ? _c : {};
          const signature = await cryptoBinding.sign(
            (_g =
              (_f =
                (_e =
                  (_d = this.lastServiceResponse) === null || _d === void 0 ? void 0 : _d.data) ===
                  null || _e === void 0
                  ? void 0
                  : _e.app_data) === null || _f === void 0
                ? void 0
                : _f.challenge) !== null && _g !== void 0
              ? _g
              : (_j =
                  (_h = this.lastServiceResponse) === null || _h === void 0 ? void 0 : _h.data) ===
                  null || _j === void 0
              ? void 0
              : _j.device_challenge,
          );
          return {
            platform_device_id,
            signature,
          };
      }
    }
    async handleWaitForAnotherDeviceAction(body) {
      var _a, _b, _c, _d;
      const response = await ((_a = this.api) === null || _a === void 0
        ? void 0
        : _a.sendRequest(ENDPOINTS_SCHEMA.poll.path, this.getQueryParams(), {
            headers: this.getInternalHeaders(),
            data: {
              polling_timeout: this.pollingTimeout,
              ticket_id:
                (_b = this.lastServiceResponse) === null || _b === void 0
                  ? void 0
                  : _b.data.raw_ticket_id,
              type: 'ticket',
            },
          }));
      if (
        ((_c = response === null || response === void 0 ? void 0 : response.data) === null ||
        _c === void 0
          ? void 0
          : _c.change_detected) === true
      ) {
        const assertResponse = await ((_d = this.api) === null || _d === void 0
          ? void 0
          : _d.sendRequest(ENDPOINTS_SCHEMA.assert.path, this.getQueryParams(), {
              headers: this.getInternalHeaders(),
              data: body,
            }));
        if (!assertResponse) {
          throw new MissingResponseError();
        }
        const serviceResponse = this.handleServiceResponse(assertResponse);
        return serviceResponse;
      }
      return this.lastServiceResponse;
    }
    handleServiceResponse(response) {
      var _a, _b, _c;
      const idoServiceResponseHelper = new IdoServiceResponseHelper(response);
      this.handleJourneyState(idoServiceResponseHelper.getJourneyState());
      // We update the journey state object with data from the incoming message. however - the incoming message
      // may be sparse and not contain all the fields. Specifically true when assertion_code == 16 (continue current action)
      // For this reason we are only updating the fields that are present in the response.
      this.journey.assertionId =
        (_a = idoServiceResponseHelper.getAssertionId()) !== null && _a !== void 0
          ? _a
          : this.journey.assertionId;
      this.journey.actionType =
        (_b = idoServiceResponseHelper.getActionType()) !== null && _b !== void 0
          ? _b
          : this.journey.actionType;
      this.journey.challenge =
        (_c = idoServiceResponseHelper.getChallenge()) !== null && _c !== void 0
          ? _c
          : this.journey.challenge;
      const serviceResponse = idoServiceResponseHelper.generateServiceResponse(
        this.journey.actionType,
      );
      this.handleJourneySuccessToken(serviceResponse);
      this.lastServiceResponse = serviceResponse;
      return serviceResponse;
    }
    handleJourneySuccessToken(serviceResponse) {
      if (serviceResponse.type === IdoServiceResponseType.JourneySuccess) {
        serviceResponse.token = serviceResponse.data.token;
        delete serviceResponse.data.token;
      }
    }
    serializeState() {
      if (!this.lastServiceResponse) {
        throw new IdoSdkError(
          'Error occurred while trying to serialize state since no journey is active',
          ErrorCode.NoActiveJourney,
        );
      }
      return btoa(
        JSON.stringify(
          {
            journey: this.journey,
            serviceResponse: this.lastServiceResponse,
          },
          mapJsonReplacer,
        ),
      );
    }
    restoreFromSerializedState(serializedState) {
      var _a;
      const { journey, serviceResponse } =
        (_a = JSON.parse(atob(serializedState), mapJsonReviver)) !== null && _a !== void 0
          ? _a
          : {};
      if (!journey || !serviceResponse) {
        throw new IdoSdkError('Invalid serialized state', ErrorCode.InvalidState);
      }
      this.lastServiceResponse = serviceResponse;
      this.journey = new IdoJourney(
        IdoJourneyType.Stateless,
        journey.journeyId,
        journey.additionalParams,
      );
      this.journey.assertionId = journey.assertionId;
      this.journey.actionType = journey.actionType;
      this.journey.challenge = journey.challenge;
      this.journey.userId = journey.userId;
      this.journey.deviceId = journey.deviceId;
      this.journey.sessionId = journey.sessionId;
      this.flowId = journey.flowId;
      return serviceResponse;
    }
    getInternalHeaders() {
      var _a;
      const payloadInternalHeaders = [];
      if ((_a = this.journey) === null || _a === void 0 ? void 0 : _a.userId) {
        payloadInternalHeaders.push({ type: 'uid', uid: this.journey.userId });
      }
      if (this.flowId) {
        payloadInternalHeaders.push({ type: 'flow_id', flow_id: this.flowId });
      }
      return payloadInternalHeaders;
    }
    getQueryParams() {
      var _a, _b;
      const queryParams = {
        clientId: this.clientId,
        aid: this.applicationId,
        locale: window.navigator.language || 'en-US',
      };
      if ((_a = this.journey) === null || _a === void 0 ? void 0 : _a.deviceId) {
        queryParams['did'] = this.journey.deviceId;
      }
      if ((_b = this.journey) === null || _b === void 0 ? void 0 : _b.sessionId) {
        queryParams['sid'] = this.journey.sessionId;
      }
      return queryParams;
    }
    async invokeJourney(journey) {
      var _a;
      const body = {
        data: journey.invocationData(),
        headers: this.getInternalHeaders(),
      };
      try {
        const response = await ((_a = this.api) === null || _a === void 0
          ? void 0
          : _a.sendRequest(journey.path(), this.getQueryParams(), body));
        if (!response) {
          throw new MissingResponseError();
        }
        journey.userId = this.getIdentifier(response, 'uid');
        journey.sessionId = this.getIdentifier(response, 'session_id');
        journey.deviceId = this.getIdentifier(response, 'device_id');
        journey.active();
        const serviceResponse = this.handleServiceResponse(response);
        return serviceResponse;
      } catch (error) {
        this.rejectJourney();
        throw error;
      }
    }
    handleJourneyState(journeyState) {
      switch (journeyState) {
        case JourneyState.TextRejection:
        case JourneyState.JsonRejection:
          this.rejectJourney();
          break;
        case JourneyState.JourneyEnd:
          this.completeJourney();
          break;
        case JourneyState.NextAction:
          // TBD
          break;
        case JourneyState.UpdateAction:
          // TBD
          break;
        default:
          throw Error(`Unhandled service response state: ${journeyState}`);
      }
    }
    completeJourney() {
      var _a;
      (_a = this.journey) === null || _a === void 0 ? void 0 : _a.complete();
    }
    rejectJourney() {
      var _a;
      (_a = this.journey) === null || _a === void 0 ? void 0 : _a.reject();
    }
    async generateDebugPin() {
      var _a, _b;
      if (!this.journey) {
        throw new IdoSdkError(
          'Error occurred while trying to generate debug pin since no journey is active',
          ErrorCode.NoActiveJourney,
        );
      }
      const response = await ((_a = this.api) === null || _a === void 0
        ? void 0
        : _a.sendRequest(ENDPOINTS_SCHEMA.debug.path, this.getQueryParams(), {
            headers: this.getInternalHeaders(),
            data: {},
          }));
      if (!response || !((_b = response.data) === null || _b === void 0 ? void 0 : _b.debug_pin)) {
        throw new MissingResponseError();
      }
      return response.data.debug_pin;
    }
  }

  const instance = new IdoSdk();
  common.events.on(common.events.MODULE_INITIALIZED, async () => {
    var _a;
    const config = common.moduleMetadata.getInitConfig();
    if (
      !((_a = config === null || config === void 0 ? void 0 : config.ido) === null || _a === void 0
        ? void 0
        : _a.serverPath)
    ) {
      return;
    }
    const { clientId, ido } = config;
    await instance.init(clientId, ido);
  });

  exports.ido = instance;
  exports.initialize = initialize;

  return exports;
})({});
