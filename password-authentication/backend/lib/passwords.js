import fetch from 'node-fetch'
import { common } from '@ciam-expressjs-vanilla-samples/shared'


/*
 * Authenticate a user with a username and password thanks to Transmit's APIs
 * See https://developer.transmitsecurity.com/openapi/user/passwords/#operation/login
 */
export async function loginPassword(username, password) {
  // Retrieve client token, ideally saved and fetched when expired
  // Here we fetch it everytime to keep things simple
  const clientToken = await common.tokens.getClientCredsToken()

  // Payload
  // We add a claim to get the username in the ID Token
  const data = {
    username,
    password,
    client_id: process.env.VITE_TS_CLIENT_ID,
    redirect_uri: process.env.TS_REDIRECT_URI,
    claims: {
      id_token: {
        username: null,
      },
    },
  }

  // Log user
  const response = await fetch(common.config.apis.passwordLogin, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify(data),
  })
  const jsonResponse = await response.json()
  return {
    status: response.status,
    response: jsonResponse,
    error: response.status !== 200,
  }
}

/*
 * Create a new user with a username and password thanks to Transmit's APIs
 * See https://developer.transmitsecurity.com/openapi/user/passwords/#operation/registerPassword
 */
export async function signupPassword(username, password) {
  const url = common.config.apis.passwordRegister

  // Retrieve client token, ideally saved and fetched when expired
  // Here we fetch it everytime to keep things simple
  const clientToken = await common.tokens.getClientCredsToken()

  // TODO add error handling, omitted for sample clarity

  // Prepare request
  const credentials = {
    username,
    password,
  }

  // Create user
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify(credentials),
  })
  const jsonResponse = await response.json()

  if (response.status !== 200) {
    // Fail here if there was an error
    return {
      status: response.status,
      response: jsonResponse,
      error: response.status !== 200,
    }
  } else {
    // A new user is always created with a temporary password
    // To make the password permanent, we reset it to the same password
    return await resetByOldPassword(username, password, password, clientToken)
  }
}

/**
 * Update a password with the knowledge of the existing password
 */
async function resetByOldPassword(username, oldPassword, newPassword, clientToken) {
  // Reset the password to the same password
  // Get the reset token first
  const resetTokenResult = await getResetTokenByOldPassword(username, oldPassword, clientToken)

  if (resetTokenResult.status !== 200) {
    return resetTokenResult
  }

  // Now use the token to perform the reset
  return await resetPassword(resetTokenResult.response.result, newPassword, clientToken)
}

/**
 * Retrieve a reset token by providing the user's password
 */
async function getResetTokenByOldPassword(username, password, clientToken) {
  const data = {
    username,
    password,
    client_id: process.env.VITE_TS_CLIENT_ID,
  }

  const response = await fetch(common.config.apis.passwordResetValidate, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify(data),
  })

  const jsonResponse = await response.json()

  return {
    status: response.status,
    response: jsonResponse,
    error: response.status == 200 ? null : jsonResponse.message,
  }
}

/**
 * Reset a password with a new password and a reset token
 * @param {string} resetToken Token used to change the password
 * @param {string} password New password
 */
async function resetPassword(resetToken, password, clientToken) {
  const data = {
    reset_token: resetToken,
    new_password: password,
    redirect_uri: process.env.TS_REDIRECT_URI,
  }

  const response = await fetch(common.config.apis.passwordReset, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify(data),
  })
  const jsonResponse = await response.json()

  return {
    status: response.status,
    response: jsonResponse,
    error: response.status == 200 ? null : jsonResponse.message,
  }
}
