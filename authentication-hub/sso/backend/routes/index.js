import { Router } from 'express';
import { getUserTokens, logout } from '../lib/management';

const router = Router();

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

// Render home page
router.get(['/', '/home'], async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  const params = new URLSearchParams(req.query);
  res.redirect(`/pages/home.html?${params.toString()}`);
});

// Render verification page
router.get('/complete', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  const params = new URLSearchParams(req.query);
  res.redirect(`/pages/complete.html?${params.toString()}`);
});

// Render login page
router.get('/login', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  res.redirect('/pages/login.html');
});

// Logout user
router.post('/logout', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  try {
    const accessToken = req.session.tokens.accessToken;
    req.session.tokens = undefined;
    req.session.save();
    const result = await logout(accessToken);
    res.send(result);
  } catch (ex) {
    res.send({ error: ex });
  }
});

// The following endpoint is used by views/complete.html when a flow is completed, for token exchange
// SECURITY NOTES: Normally the ID token SHOULD NOT reach the UI, however this is a sample app and we want to display it for clarity.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-6-get-user-tokens
router.post('/fetch-tokens', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log(JSON.stringify(req.body));
  const tokens = await getUserTokens(req.body.authCode);

  // Here we the session, this will automatically set a cookie on the user's browser
  // Transmit does not recommend using the access token directly from the front-end
  // See: https://developer.transmitsecurity.com/guides/user/manage_user_sessions/#step-3-store-session
  // For cookies security recommendations, see: https://developer.transmitsecurity.com/guides/user/how_sessions_work/#session-cookie
  if (tokens.id_token) {
    // TODO: verify tokens signature
    const idToken = parseJwt(tokens.id_token);
    req.session.tokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken,
    };
    req.session.save();
    res.status(200).send({});
  } else {
    res.status(400).send({ error: 'An error occurred' });
  }
});

// Get an authenticated user's saved ID Token or return a not found error
router.get('/me', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log('/ME', req.session.tokens);
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

export default router;
