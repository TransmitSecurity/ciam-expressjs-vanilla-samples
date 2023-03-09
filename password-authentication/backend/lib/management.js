import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

/**
 * Log the user out from the IdP sesion
 * See: https://developer.transmitsecurity.com/guides/user/manage_user_sessions/#step-5-logout-session
 */
export async function logout(accessToken) {
  const url = common.config.apis.logout;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // TODO add error handling, omitted for sample clarity

  const jsonResponse = await response.json();
  console.log('Logout', jsonResponse);
  return jsonResponse;
}
