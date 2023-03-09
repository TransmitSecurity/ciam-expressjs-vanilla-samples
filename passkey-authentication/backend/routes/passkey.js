import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();

router.get('/start-auth-session', async function (req, res) {
  const email = req.session.tokens.idToken.email;
  const accessToken = req.session.tokens.accessToken;

  if (!accessToken) {
    throw new Error('Access token missing from session');
  }

  const url = common.config.apis.webauthnStartWithAuthorization;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email,
      client_id: process.env.VITE_TS_CLIENT_ID,
    }),
  };

  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();

  console.log('Auth session response is ', { status, data });

  res.status(status).json(data);
});

export const passkeyRouter = router;
