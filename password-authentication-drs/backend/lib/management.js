import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

/**
 * Get the user data from the IDP service
 */
export async function getUser(userId) {
  const clientToken = await common.tokens.getClientCredsToken();

  const response = await fetch(common.config.apis.getUser(userId), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
  });

  return response.json();
}

/**
 * Log the user out from the IdP session
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

  const jsonResponse = await response.json();
  console.log('Logout', jsonResponse);
  return jsonResponse;
}
