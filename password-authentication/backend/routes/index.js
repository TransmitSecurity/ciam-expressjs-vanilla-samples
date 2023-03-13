import { Router } from 'express';
import { loginPassword, signupPassword } from '../lib/passwords';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = Router();

// Render home page
router.get(['/'], async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  res.redirect('/pages/home.html');
});

// The following endpoint is used when redirecting back to the RP site after authentication for token exchange.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-6-get-user-tokens.
router.get('/complete', async function (req, res) {
  const params = new URLSearchParams(req.query);
  const tokens = await common.tokens.getUserTokens(params.get('code'));

  if (tokens.id_token) {
    const idToken = common.tokens.parseJwt(tokens.id_token);
    req.session.tokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken,
    };
    req.session.save();
  }

  res.redirect('/');
});

// Authenticate a user with a password
router.post('/login', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log(JSON.stringify(req.body));
  const result = await loginPassword(req.body.username, req.body.password);

  res.send(result);
});

// Create a user with a username and password
router.post('/signup', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log(JSON.stringify(req.body));
  const { username, password } = req.body;
  const result = await signupPassword(username, password);
  res.send(result);
});

// Get an authenticated user's saved ID Token or return a not found error
// SECURITY NOTES: Normally the ID token SHOULD NOT reach the UI, we send and display it here for clarity.
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

export default router;
