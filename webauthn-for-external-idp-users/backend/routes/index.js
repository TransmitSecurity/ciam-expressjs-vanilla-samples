import { randomUUID } from 'crypto';
import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();
let clientCredsToken;

router.get(['/'], async function (req, res) {
  res.redirect('/pages/authenticate.html');
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

    res.status(data.status).send(json);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

router.post('/register/complete', async function (req, res) {
  try {
    const webauthnEncodedResult = req.body.webauthn_encoded_result;
    const url = common.config.apis.webauthnRegisterCompleteExternal;
    const token = await getClientCredsToken();

    // This is your internal user identifier that will be associated to the WebAuthn credential.
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

    res.status(data.status).send(json);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

// Get and cash a client credentials token
// Usually client credential tokens are valid for 1 hour, you will need to refresh them
async function getClientCredsToken() {
  if (!clientCredsToken) {
    clientCredsToken = await common.tokens.getClientCredsToken();
  }

  return clientCredsToken;
}

export const indexRouter = router;
