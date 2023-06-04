import { randomUUID } from 'crypto';
import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();
let clientCredsToken;

router.get(['/'], async function (req, res) {
  res.redirect('/pages/validate.html');
});

router.post('/authenticate/complete', async function (req, res) {
  try {
    const webauthnEncodedResult = req.body.webauthn_encoded_result;
    const url = common.config.apis.webauthnAuthenticateCompleteExternal;
    const token = await getClientCredsToken();
    const request = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webauthn_encoded_result: webauthnEncodedResult,
      }),
    };

    const data = await fetch(url, request);
    const json = await data.json();
    console.log('Complete response', json);

    res.send(json);
  } catch (e) {
    console.log(e);
  }
});

router.post('/register/complete', async function (req, res) {
  try {
    const webauthnEncodedResult = req.body.webauthn_encoded_result;
    const url = common.config.apis.webauthnRegisterCompleteExternal;
    const token = await getClientCredsToken();
    const user_identifier = randomUUID();
    const request = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_identifier: user_identifier,
        webauthn_encoded_result: webauthnEncodedResult,
      }),
    };

    const data = await fetch(url, request);
    const json = await data.json();
    console.log('register response', json);

    res.send(json);
  } catch (e) {
    console.log(e);
  }
});

// Get a client credentials token
async function getClientCredsToken() {
  if (!clientCredsToken) {
    clientCredsToken = await common.tokens.getClientCredsToken();
  }

  return clientCredsToken;
}

export const indexRouter = router;
