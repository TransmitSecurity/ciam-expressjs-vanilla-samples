import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

export async function signUp(username, password) {
  const clientToken = await common.tokens.getClientCredsToken();

  const response = await fetch(common.config.apis.createUser, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({
      username,
      credentials: {
        password,
        force_replace: false,
      },
    }),
  });

  const jsonResponse = await response.json();

  return {
    status: response.status,
    response: jsonResponse,
    error: response.status !== 200,
  };
}

export async function login(username, password) {
  const clientToken = await common.tokens.getClientCredsToken();

  const response = await fetch(common.config.apis.passwordBackendAuthentication, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({
      username,
      password,

      // request an ID token with the username as a claim
      // For more information see: https://developer.transmitsecurity.com/openapi/id_token_reference/
      claims: {
        id_token: {
          username: null,
        },
      },
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
  const clientToken = await common.tokens.getClientCredsToken();
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
