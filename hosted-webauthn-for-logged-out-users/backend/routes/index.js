import express from 'express';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();

router.get(['/'], async function (req, res) {
  if (!req.session?.tokens) {
    res.redirect('/pages/register.html');
  } else {
    res.redirect('/pages/home.html');
  }
});

router.post('/webauthn/register', async function (req, res) {
  try {
    const webauthnUsername = req.body.username;
    const registrationHintUrl = common.config.apis.webauthnRegisterExternalHint;
    const token = await common.tokens.getClientCredsToken();

    // This is your internal user identifier that will be associated to the WebAuthn credential.
    const user_identifier = crypto.randomUUID();

    const request = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_user_id: user_identifier,
        webauthn_identifier: webauthnUsername,
        redirect_uri: `http://localhost:8888/pages/register.html`,
      }),
    };

    const data = await fetch(registrationHintUrl, request);
    const json = await data.json();
    console.log('register response', json);
    if (!data.ok) {
      res.status(500).send({ error: JSON.stringify(json) });
      return;
    }

    const hostedWebauthnRegisterUrl = common.config.apis.hostedPasskeyRegistrationUrl(
      json.register_webauthn_cred_token,
    );
    res.status(200).send({ redirect_uri: hostedWebauthnRegisterUrl });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

router.post('/webauthn/authenticate', async function (req, res) {
  try {
    const webauthnUsername = req.body.username;
    const clientId = process.env.VITE_TS_CLIENT_ID;
    const redirectUri = 'http://localhost:8888/pages/complete.html';

    const uri = common.config.apis.hostedPasskeyAuthenticationUrl(
      webauthnUsername,
      redirectUri,
      clientId,
    );

    res.status(200).send({ redirect_uri: uri });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

export const indexRouter = router;
