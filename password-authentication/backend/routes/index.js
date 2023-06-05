import { Router } from 'express';
import { login, signUp } from '../lib/passwords';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import { getUser, logout } from '../lib/management.js';

const router = Router();

// Render home page
router.get(['/'], async function (req, res) {
  if (!req.session?.tokens) {
    res.redirect('/pages/login.html');
  } else {
    res.redirect('/pages/home.html');
  }
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

    req.session.user = await getUser(idToken.sub);
    req.session.save();
  }

  res.redirect('/');
});

// Create a user with a username and password
router.post('/signup', common.utils.rateLimiter(), async function (req, res) {
  console.log(JSON.stringify(req.body));
  const { username, password } = req.body;
  const signupResponse = await signUp(username, password);
  console.log('Signup response', signupResponse);

  if (signupResponse.status >= 400) {
    res.send(signupResponse);
  } else {
    const result = await login(username, password);
    res.send(result);
  }
});

// Authenticate a user with a password
router.post('/login', common.utils.rateLimiter(), async function (req, res) {
  console.log(JSON.stringify(req.body));
  const { username, password } = req.body;

  const result = await login(username, password);
  res.send(result);
});

// Get an authenticated user's data
router.get('/user', async function (req, res) {
  console.log('/user', req.session.user);
  if (req.session.user) {
    res.status(200).send(req.session.user);
  } else {
    res.status(404).send(null);
  }
});

// Logout user
router.post('/logout', common.utils.rateLimiter(), async function (req, res) {
  const accessToken = req.session.tokens.accessToken;
  req.session.destroy(err => console.log(err));
  const result = await logout(accessToken);
  res.send(result);
});

export default router;
