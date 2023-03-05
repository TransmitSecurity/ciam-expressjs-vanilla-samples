import express from 'express'
import fetch from 'node-fetch'
import { common } from '@ciam-expressjs-vanilla-samples/shared'

const router = express.Router()

// The following endpoint uses an API to elevate a cross device session to allow credential registration
// For more information see https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/#step-3-register-credentials
router.post('/authorize-session-user', async function (req, res) {
  try {
    console.log(JSON.stringify(req.body))
    const accessToken = await common.tokens.getClientCredsToken()
    await authorizeAuthnSession(
      accessToken,
      req.body.authSessionId,
      req.body.username,
    )
    res.send({ status: 'ok' })
  } catch(e) {
    console.log('Error while calling /authorize-session-user', e)
    res.status(500).send({error: e})
  }
})


// This function wraps and API call for elevating the auth-session and allows using it for registration.
// The input access token in this sample app is a client credentials token, however could also use access tokens
// that are obtained via user authentication, e.g. password login or email OTP.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/#step-3-register-credentials
async function authorizeAuthnSession(accessToken, authSessionId, username) {
  const url = common.config.apis.webauthnAuthorize
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      client_id: process.env.VITE_TS_CLIENT_ID,
      username: username,
      auth_session_id: authSessionId,
    }),
  }

  // Exception handling done at the route level, for simmplicity sake
  console.log(`calling for ${options.body} with ${options.headers.Authorization}`)
  return await fetch(url, options)
}

export const mobileRouter = router
