import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

/**
 * Obtain a client access token for API authorization
 * See: https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
 */
async function getClientCredsToken(resource = '', client_id, client_secret) {
  const url = common.config.apis.token;
  const params = {
    client_id: client_id || process.env.VITE_TS_CLIENT_ID,
    client_secret: client_secret || process.env.TS_CLIENT_SECRET,
    grant_type: 'client_credentials',
  };

  console.log('URL:', url);
  console.log('ClientCreds:', params);

  if (resource) params['resource'] = resource;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  });

  // No error handling for the sake of simplicity, assuming the router level catches exceptions
  const clientToken = await response.json();
  console.log('Client token', clientToken);
  return clientToken.access_token;
}

// This function wraps an API call for fetching user access and ID tokens, based on a provide authCode
// The access token is used for authorizing backend to API calls on behalf of the user, the ID token identifies the user.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-6-get-user-tokens
export async function getUserTokens(authCode, client_id, client_secret, redirect_uri) {
  const url = common.config.apis.token;
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    client_id: client_id || process.env.VITE_TS_CLIENT_ID,
    client_secret: client_secret || process.env.TS_CLIENT_SECRET,
    redirect_uri: redirect_uri || process.env.TS_REDIRECT_URI,
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  };
  console.log(JSON.stringify(options));

  // No error handling for the sake of simplicity, assuming the router level catches exceptions
  const resp = await fetch(url, options);
  const data = await resp.json();

  // NOTE: A production implementation should also validate the token signatures via the OIDC JWKS API
  // For more information see https://developer.transmitsecurity.com/openapi/user/oidc/#operation/oidcGetKeys
  console.log(resp.headers, resp.status, data);
  return data;
}

// This function validates the JWT token signature using the OIDC JWKS API
// For more information see https://developer.transmitsecurity.com/guides/user/validate_tokens/
export async function validateToken(token) {
  const jwks = await getJwks();
  const { header } = jwt.decode(token, { complete: true });
  const kid = header.kid;
  const key = jwks.keys.find(key => key.kid === kid);
  const publicKey = jwkToPem(key);

  return jwt.verify(token, publicKey);
}

// This function wraps an API call for fetching the OIDC JWKS
// For more information see https://developer.transmitsecurity.com/openapi/user/oidc/#operation/oidcGetKeys
export async function getJwks() {
  const url = common.config.apis.jwks;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // No error handling for the sake of simplicity, assuming the router level catches exceptions
  const resp = await fetch(url, options);
  const data = await resp.json();

  console.log(resp.headers, resp.status, data);
  return data;
}

export function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const tokenRequest = {
  getClientCredsToken,
  getUserTokens,
  validateToken,
  parseJwt,
};
