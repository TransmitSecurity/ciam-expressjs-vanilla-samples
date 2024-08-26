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
    const webauthnEncodedResult = req.body.webauthn_encoded_result;
    const url = common.config.apis.webauthnToken;
    const token =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCIsImtpZCI6IkNwVE00aUdsaU1va2xnYWZ2RFhBNFRiY2xjeW55RF93TWdqT2ZoaUNVVUUifQ.eyJ0aWQiOiJ0cmFuc21pdHNlY3VyaXR5IiwiYXBwX25hbWUiOiJGbGV4SUQgQXBwIiwiYXBwX2lkIjoiT2tpYWwwUHZiamE5NzgycG9KaGc5Iiwicm9sZXMiOlsiQWRtaW4iXSwianRpIjoiWkl0elZtdVFTRlBka3RaQ3o0Q3ZGIiwic3ViIjoia3A5ODFucS50cmFuc21pdHNlY3VyaXR5LnRyYW5zbWl0IiwiaWF0IjoxNzE2Nzk5NDc4LCJleHAiOjE3MTY4MDMwNzgsImNsaWVudF9pZCI6ImtwOTgxbnEudHJhbnNtaXRzZWN1cml0eS50cmFuc21pdCIsImlzcyI6Imh0dHBzOi8vdXNlcmlkLWRldi5pbyIsImF1ZCI6Imh0dHBzOi8vaWRvLmlkZW50aXR5LnNlY3VyaXR5L2lmNWpjNDZkcng4OXVxNWEycTVleDlncDB4aGdjeHp6In0.sVVsZ9124IFg78rcQA-21DcVqqmvK0S4d9bzC3PfZWb8x8Uu6QJphWUBhLFIRgALqwdM7CsrEkneeDhwfmIMdyEyXg4kOFK7hxvrK2I-3hyMWvs5AexIptLe79CeUfaR7CtgXx_Vpz5kdV1PuCYgR2MZwo9ujFjWXUprkwuIVtXAsfbD05rLLBAUWtRXIDu3DIfq_QACFkBQsuOa2mzcCZt5WDFYuNx1Z7H1L8twIG0DuPlzoUC02DEhyyZALHCAG4Xp7Fn5-rSGG6jDLdcZi21Esv7GIUAypCaWXFJQOR2RApWNdakwh1sKzDmhBLazUJsD7iqPaLjslUGWETyrLg'; //await common.tokens.getClientCredsToken();
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

    res.status(data.status).send(json);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: JSON.stringify(e) });
  }
});

router.post('/webauthn/register', async function (req, res) {
  try {
    const webauthnEncodedResult = req.body.webauthn_encoded_result;
    const url = common.config.apis.webauthnRegisterExternal;
    const token = await common.tokens.getClientCredsToken();

    /**
      In a production code the user should be authenticated with a 3rd part IDP before using client credentials to
      register webauthn credentials. Otherwise, we have no proof of user identity.
    **/

    // This is your internal user identifier that will be associated to the WebAuthn credential.
    const user_identifier = crypto.randomUUID();
    const user_email = `${user_identifier}@gmail.com`;

    const request = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_user_id: user_identifier,
        user_email: user_email,
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
