import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

// In a production server, you would cache the access token,
// and regenerate whenever it expires.
// This parameter emulates this 'cache' with a static variable for simplicity.
const tokenCache = {};

async function getAccessToken() {
  if (tokenCache?.token === undefined || tokenCache.expiry < new Date().getTime()) {
    tokenCache.token = await common.tokens.getClientCredsToken();

    //tokens are good for 3600 seconds, if getting close get a new one
    tokenCache.expiry = new Date().getTime() + 3590 * 1000;
  }
  return tokenCache.token;
}

/**
 * Log the user out from the IdP session
 * See:https://developer.transmitsecurity.com/openapi/user/backend-sessions/#operation/logout
 */
export async function logout(sessionId) {
  const url = common.config.apis.backendLogout;

  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });
}

export async function createUser(email) {
  const resp = await fetch(common.config.apis.createUser, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    body: JSON.stringify({
      email,
    }),
  });
  const status = resp.status;
  const data = await resp.json();
  console.log('response of creating user is ', { status, data });
  return { status, ...data };
}

export async function sendMagicLink(email) {
  const url = common.config.apis.sendBackendMagicLink;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      redirect_uri: process.env.TS_REDIRECT_URI,
    }),
  };

  console.log('about to call ' + JSON.stringify(options));
  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return { status, ...data };
}

export async function authenticateMagicLinkCode(code) {
  const url = common.config.apis.authenticateBackendMagicLink;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  };

  console.log('about to call ' + JSON.stringify(options));
  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return {
    status,
    error: status !== 200,
    response: data,
  };
}

export async function authenticateWithSession(sessionId) {
  const url = common.config.apis.backendSessionAuthentication;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  };

  console.log('about to call ' + JSON.stringify(options));
  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return {
    status,
    error: status !== 200,
    response: data,
  };
}

export async function refreshBackendToken(refreshToken) {
  const url = common.config.apis.backendRefreshToken;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  };

  console.log('about to call ' + JSON.stringify(options));
  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return {
    status,
    error: status !== 200,
    response: data,
  };
}
