import express from 'express'
import { common } from '@ciam-expressjs-vanilla-samples/shared'

const router = express.Router()

// Endpoint for proxying auth code for token exchange, see more info in common.tokens.getUserTokens()
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
