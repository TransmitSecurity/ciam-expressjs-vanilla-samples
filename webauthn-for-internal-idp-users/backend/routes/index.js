import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();

router.get(['/'], async function (req, res) {
  if (!req.session?.tokens) {
    res.redirect('/pages/login.html');
  } else {
    res.redirect('/pages/home.html');
  }
});

router.get('/complete', async function (req, res) {
  const params = new URLSearchParams(req.query);
  const tokens = await common.tokens.getUserTokens(params.get('code'));
  console.log('Tokens', tokens);

  if (tokens.id_token) {
    const idToken = common.tokens.parseJwt(tokens.id_token);
    req.session.tokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken,
    };
    req.session.save();
  }

  res.redirect('/pages/home.html');
});

router.post('/token', async function (req, res) {
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

    res.send(json);
  } catch (e) {
    console.log(e);
  }
});

router.post('/register/complete', async function (req, res) {
  try {
    const webauthnEncodedResult = req.body.webauthn_encoded_result;
    const url = common.config.apis.webauthnRegisterComplete;
    const token = req.session.tokens.accessToken;
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
