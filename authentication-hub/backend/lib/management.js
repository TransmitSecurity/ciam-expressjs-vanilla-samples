import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const SSO_GROUP_CLIENT_IDS = [
  process.env.VITE_TS_CLIENT_ID_SSOAIR,
  process.env.VITE_TS_CLIENT_ID_SSOCARS,
];

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
 * Check if user has sessions
 */
export async function hasUserSessions(userId, client_id, client_secret) {
  const clientToken = await common.tokens.getClientCredsToken(null, client_id, client_secret);

  const response = await fetch(common.config.apis.getUserSessions(userId), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
  });

  const result = await response.json();
  const sessions = result?.result;
  console.log('Sessions', sessions);

  if (
    sessions?.length > 0 &&
    sessions.some(session => SSO_GROUP_CLIENT_IDS.includes(session.client_id))
  ) {
    return true;
  }

  return false;
}

/**
 * Log the user out from the IdP session
 * See: https://developer.transmitsecurity.com/guides/user/manage_user_sessions/#step-5-logout-session
 */
export async function logout(accessToken) {
  const response = await fetch(common.config.apis.logout, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const jsonResponse = await response.json();
  console.log('Logout', jsonResponse);
  return jsonResponse;
}
