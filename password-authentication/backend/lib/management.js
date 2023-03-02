import { userBaseUrl, userUrl } from './endpoints'
import fetch from 'node-fetch'

/**
 * Obtain a client access token for API authorization
 * See: https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
 */
export async function getClientToken() {
  const url = `${userBaseUrl}/oidc/token`
  const params = {
    client_id: process.env.VITE_TS_CLIENT_ID,
    client_secret: process.env.TS_CLIENT_SECRET,
    grant_type: 'client_credentials',
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  })

  // TODO add error handling, omitted for sample clarity

  const clientToken = await response.json()
  console.log('Client token', clientToken)
  return clientToken.access_token
}

// This function wraps an API call for fetching user access and ID tokens, based on a provide authCode
// The access token is used for authorizing backend to API calls on behalf of the user, the ID token identifies the user.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-6-get-user-tokens
export async function getUserTokens(authCode) {
  const url = `${userBaseUrl}/oidc/token`
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    client_id: process.env.VITE_TS_CLIENT_ID,
    client_secret: process.env.TS_CLIENT_SECRET,
    redirect_uri: process.env.TS_REDIRECT_URI,
  })

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  }
  console.log(JSON.stringify(options))

  try {
    const resp = await fetch(url, options)
    const data = await resp.json()

    // NOTE: A production implementation should also validate the token signatures via the OIDC JWKS API
    // For more information see https://developer.transmitsecurity.com/openapi/user/oidc/#operation/oidcGetKeys
    console.log(resp.headers, resp.status, data)
    return data
  } catch (e) {
    console.log(e)
  }
}

/**
 * Log the user out from the IdP sesion
 * See: https://developer.transmitsecurity.com/guides/user/manage_user_sessions/#step-5-logout-session
 */
export async function logout(accessToken) {
  const url = `${userUrl}/auth/logout`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  // TODO add error handling, omitted for sample clarity

  const jsonResponse = await response.json()
  console.log('Logout', jsonResponse)
  return jsonResponse
}
