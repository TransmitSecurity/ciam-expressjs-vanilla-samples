import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

export async function getRiskRecommendation(actionToken, userId = null) {
  const clientToken = await common.tokens.getClientCredsToken('https://risk.identity.security');

  const query = new URLSearchParams({
    action_token: actionToken,
    user_id: userId,
  }).toString();

  const response = await fetch(common.config.apis.getRiskRecommendation(query), {
    method: 'get',
    headers: {
      Authorization: `Bearer ${clientToken}`,
    },
  });

  const jsonResponse = await response.json();

  return {
    status: response.status,
    response: jsonResponse,
    error: response.status !== 200,
  };
}
