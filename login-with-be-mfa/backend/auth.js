import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const tokenCache = {};

async function getAccessToken() {
  if (tokenCache?.token === undefined || tokenCache.expiry < new Date().getTime()) {
    tokenCache.token = await common.tokens.getClientCredsToken();

    //tokens are good for 3600 seconds, if getting close get a new one
    tokenCache.expiry = new Date().getTime() + 3590 * 1000;
  }
  return tokenCache.token;
}

export async function createUser(username, phone, password) {
  const clientToken = await getAccessToken();
  const resp = await fetch(common.config.apis.createUser, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({
      username: username,
      phone_number: phone,
      credentials: {
        password: password,
        force_replace: false,
      },
    }),
  });
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return { status, ...data };
}

export async function authenticatePassword(username, password) {
  const clientToken = await getAccessToken();

  const response = await fetch(common.config.apis.passwordBackendAuthentication, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const jsonResponse = await response.json();

  return {
    status: response.status,
    response: jsonResponse,
    error: response.status !== 200,
  };
}

/**
 * Log the user out from the IdP session
 * See:https://developer.transmitsecurity.com/openapi/user/backend-sessions/#operation/logout
 */
export async function logout(sessionId) {
  const clientToken = await getAccessToken();
  const url = common.config.apis.backendLogout;

  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });
}

export async function getUserByUsername(username) {
  const clientToken = await getAccessToken();
  const resp = await fetch(common.config.apis.getUserByUsername(username), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
  });

  const status = resp.status;
  const data = await resp.json();
  console.log('get user response is ', { status, data });
  return { status, ...data };
}

export async function sendSMSOTP(phone) {
  const clientToken = await getAccessToken();
  const url = common.config.apis.sendBackendOtp;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: 'sms',
      identifier: phone,
      identifier_type: 'phone_number',
    }),
  };

  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  return { status, ...data };
}

export async function authenticateSMSOtp(phone, otpCode, sessionId) {
  const clientToken = await getAccessToken();
  const url = common.config.apis.authenticateBackendOtp;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      passcode: otpCode,
      identifier: phone,
      identifier_type: 'phone_number',

      // add the authentication to the same session to allow for MFA
      session_id: sessionId,
    }),
  };

  const response = await fetch(url, options);
  const jsonResponse = await response.json();

  return {
    status: response.status,
    response: jsonResponse,
    error: response.status !== 200,
    error_message: Array.isArray(jsonResponse?.message)
      ? jsonResponse?.message[0]
      : jsonResponse?.message,
  };
}
