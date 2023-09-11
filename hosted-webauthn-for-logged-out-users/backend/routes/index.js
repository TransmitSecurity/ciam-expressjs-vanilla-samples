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

router.get('/complete', async function (req, res) {
  const params = new URLSearchParams(req.query);

  if (params.get('error')) {
    const redirectUri = '/pages/error.html';
    const returnedQueryParams = new URLSearchParams(params);

    res.redirect(`${redirectUri}?${returnedQueryParams}`);
    return;
  }

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

router.get('/user', async function (req, res) {
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

router.post('/webauthn/register', async function (req, res) {
  try {
    const webauthnUsername = req.body.username;
    const registrationHintUrl = common.config.apis.webauthnRegisterExternalHint;
    const token = await common.tokens.getClientCredsToken();
    const registrationRedirectUri = `${req.headers.origin}/pages/register-complete.html`;

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
        redirect_uri: registrationRedirectUri,
      }),
    };

    const data = await fetch(registrationHintUrl, request);
    const json = await data.json();

    if (!data.ok) {
      console.log(json.message);
      throw new Error(json.message);
    }

    const redirectUri = common.config.apis.hostedPasskeyRegistrationUrl(
      json.register_webauthn_cred_token,
    );
    res.status(200).send({ redirect_uri: redirectUri });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

router.post('/webauthn/authenticate', async function (req, res) {
  try {
    const webauthnUsername = req.body.username;
    const clientId = process.env.VITE_TS_CLIENT_ID;
    const authenticationRedirectUri = `${req.headers.origin}/complete`;

    const uri = common.config.apis.hostedPasskeyAuthenticationUrl(
      webauthnUsername,
      authenticationRedirectUri,
      clientId,
    );

    res.status(200).send({ redirect_uri: uri });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

router.post('/webauthn/transaction', async function (req, res) {
  try {
    const clientId = process.env.VITE_TS_CLIENT_ID;
    const clientSecret = process.env.TS_CLIENT_SECRET;
    const authRequestUrl = common.config.apis.authRequest;
    const transactionRedirectUri = `${req.headers.origin}/complete`;
    const { type, payee, amount, currency, method, customData } = req.body;

    const approvalData =
      type === 'custom'
        ? JSON.parse(customData)
        : {
            payee: payee,
            payment_amount: amount,
            payment_currency: currency,
            payment_method: method,
          };

    const claims = {
      id_token: {
        approval_data: {
          type: type,
          data: approvalData,
        },
      },
    };

    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      claims: JSON.stringify(claims),
      scope: 'openid',
      response_type: 'code',
      redirect_uri: transactionRedirectUri,
      // You can add the identifier of the user that should approve the transaction. keeping this parameter
      // undefined will allow the user to pick any available passkey.
      login_hint: undefined,
    };

    const formBody = new URLSearchParams(body).toString();

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    };

    const data = await fetch(authRequestUrl, request);
    const json = await data.json();
    console.log('transaction response', json);
    if (!data.ok) {
      console.log(json.message);
      throw new Error(json.message);
    }

    const redirectUri = common.config.apis.hostedPasskeyTransactionUrl(json.request_uri, clientId);
    res.status(200).send({ redirect_uri: redirectUri });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

export const indexRouter = router;
