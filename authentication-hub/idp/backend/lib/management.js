import { userBaseUrl } from './endpoints';
import fetch from 'node-fetch';

/**
 * Obtain a client access token for API authorization
 * See: https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
 */
export async function getClientToken() {
  const url = `${userBaseUrl}/oidc/token`;
  const params = {
    client_id: process.env.VITE_TS_CLIENT_ID,
    client_secret: process.env.TS_CLIENT_SECRET,
    grant_type: 'client_credentials',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  });

  // TODO add error handling, omitted for sample clarity

  const clientToken = await response.json();
  console.log('Client token', clientToken);
  return clientToken.access_token;
}
