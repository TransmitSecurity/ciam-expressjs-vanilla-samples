import express from 'express';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();

router.get(['/'], async function (req, res) {
  res.redirect('/pages/transaction.html');
});

router.post('/webauthn/register', async function (req, res) {
  try {
    const webauthnUsername = req.body.username;
    const registrationHintUrl = common.config.apis.webauthnRegisterExternalHint;
    const token = await common.tokens.getClientCredsToken();
    const registrationRedirectUri = `${req.headers.origin}/pages/complete.html`;

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

router.post('/webauthn/transaction', async function (req, res) {
  try {
    const clientId = process.env.VITE_TS_CLIENT_ID;
    const clientSecret = process.env.TS_CLIENT_SECRET;
    const authRequestUrl = common.config.apis.authRequest;
    const transactionRedirectUri = `${req.headers.origin}/pages/complete.html`;
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
    console.log('register response', json);
    if (!data.ok) {
      res.status(500).send({ error: JSON.stringify(json) });
      return;
    }

    const hostedWebauthnRegisterUrl = common.config.apis.hostedPasskeyTransactionUrl(
      json.request_uri,
      clientId,
    );
    res.status(200).send({ redirect_uri: hostedWebauthnRegisterUrl });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

export const indexRouter = router;
