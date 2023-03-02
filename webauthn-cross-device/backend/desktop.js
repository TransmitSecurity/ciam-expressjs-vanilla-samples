import express from 'express'
import { common } from '@ciam-expressjs-vanilla-samples/shared'

const router = express.Router()

// The following endpoint is used by views/desktop.ejs when a flow is completed, for token exchange
// SECURITY NOTES: Normally the ID token SHOULD NOT reach the UI, however this is a sample app and we want to display it for clarity.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-6-get-user-tokens
router.post('/fetch-tokens', async function (req, res) {
  try {
    console.log(`/fetch-tokens body: ${JSON.stringify(req.body)}`)
    const tokens = await common.tokens.getUserTokens(req.body.authCode)
    res.send(tokens)
  } catch (e) {
    console.log('error during /fetch-tokens ', e)
    res.status(500).send({ error: JSON.stringify(e) })
  }
})

export const desktopRouter = router
