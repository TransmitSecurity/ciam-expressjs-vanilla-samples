import express from 'express';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();

router.get(['/'], async function (req, res) {
  if (!req.session?.tokens) {
    res.redirect('/pages/login.html');
  } else {
    res.redirect('/pages/home.html');
  }
});

// Get an authenticated user's saved ID Token or return a not found error
router.get('/user', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log('/user', req.session.tokens);
  if (req.session.tokens) {
    res.status(200).send({
      idToken: req.session.tokens.idToken,
    });
  } else {
    res.status(404).send({
      idToken: null,
    });
  }
});

router.post('/token', async function (req, res) {
  try {
    const sessionId = req.body.session_id;
    const url = common.config.apis.sessionAuthenticate;
    const token = await common.tokens.getClientCredsToken();
    const request = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    };

    const data = await fetch(url, request);
    const json = await data.json();
    console.log('Token response', json);

    if (json.id_token) {
      const idToken = common.tokens.parseJwt(json.id_token);
      req.session.tokens = {
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        idToken,
      };
      req.session.save();
    }

    res.status(data.status).send(json);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

router.post('/webauthn/authenticate', async function (req, res) {
  try {
    const webauthnEncodedResult = req.body.webauthn_encoded_result;
    const url = common.config.apis.webauthnToken;
    const token = await common.tokens.getClientCredsToken();
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

    res.status(data.status).send(json);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

router.get('/webauthn/register/init', async function (req, res) {
  const token = await common.tokens.getClientCredsToken();

  // This is your internal user identifier that will be associated to the WebAuthn credential.
  const user_identifier = crypto.randomUUID();

  // This is the username that will be displayed to the user during the WebAuthn registration process.
  const webauthnUsername = 'Or.Gaizer';

  const url = common.config.apis.webauthnCrossDeviceRegisterExternalInit;
  const request = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      external_user_id: user_identifier,
      username: webauthnUsername,
    }),
  };

  const data = await fetch(url, request);
  const json = await data.json();
  console.log('register response', json);

  res.status(data.status).send(json);
});

router.post('/webauthn/register', async function (req, res) {
  try {
    const webauthnEncodedResult = req.body.webauthn_encoded_result;
    const url = common.config.apis.webauthnCrossDeviceRegister;
    const token = await common.tokens.getClientCredsToken();

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
    console.log('register response', json);

    res.status(data.status).send(json);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

// Logout user
router.post('/logout', async function (req, res) {
  const accessToken = req.session.tokens.accessToken;
  const url = common.config.apis.logout;

  req.session.tokens = undefined;
  req.session.save();

  const data = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await data.json();
  console.log('Logout', json);

  res.send(json);
});

export const indexRouter = router;
