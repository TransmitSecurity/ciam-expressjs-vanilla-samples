import express from 'express';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.TS_RATE_LIMIT || 10, // 10 requests per minute per IP
  message: 'Too many requests from this IP, please try again in a minute',
});

// Endpoint for proxying auth code for token exchange, see more info in common.tokens.getUserTokens()
router.post('/fetch-tokens', limiter, async function (req, res) {
  try {
    console.log(`/fetch-tokens body: ${JSON.stringify(req.body)}`);
    const tokens = await common.tokens.getUserTokens(req.body.authCode);
    res.send(tokens);
  } catch (e) {
    console.log('error during /fetch-tokens ', e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

export const desktopRouter = router;
