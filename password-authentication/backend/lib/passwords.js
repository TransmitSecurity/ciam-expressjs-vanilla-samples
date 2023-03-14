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

  const response = await fetch(common.config.apis.passwordLogin, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({
      username,
      password,
      client_id: process.env.VITE_TS_CLIENT_ID,
      redirect_uri: process.env.TS_REDIRECT_URI,
    }),
  });

  const jsonResponse = await response.json();

  return {
    status: response.status,
    response: jsonResponse,
    error: response.status !== 200,
  };
}
