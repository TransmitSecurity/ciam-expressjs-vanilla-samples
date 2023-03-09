import express from 'express'
import fetch from 'node-fetch'
import { common } from '@ciam-expressjs-vanilla-samples/shared'

const router = express.Router()

// Endpoint for proxying auth-session-id and authorizing it for webauthn registration
// The input access token in this sample app is a client credentials token which we generate ad-hoc, however could also use access tokens
// that are obtained via user authentication, e.g. password login or email OTP.
router.post('/authorize-session-user', async function (req, res) {
  try {
    console.log(JSON.stringify(req.body))
    const accessToken = await common.tokens.getClientCredsToken()
    await authorizeAuthnSession(accessToken, req.body.authSessionId, req.body.username)
    res.send({ status: 'ok' })
  } catch (e) {
    console.log('Error while calling /authorize-session-user', e)
    res.status(500).send({ error: e })
  }
})

// Here we wrap the API call for elevating the auth-session and allows using it for registration.
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
