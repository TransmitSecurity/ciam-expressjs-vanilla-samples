import { Router } from 'express'
import { loginPassword, signupPassword } from '../lib/passwords'
import { getUserTokens, logout } from '../lib/management'

const router = Router()

// Render home page
router.get(['/', '/home'], async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  res.redirect('/pages/home.html');
});

// Render verification page
router.get('/verify', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  const params = new URLSearchParams(req.query)
  res.redirect(`/pages/verify.html?${params.toString()}`);
});


// Render login page
router.get('/login', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  res.redirect('/pages/login.html');
});

// Logout user
router.post('/logout', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  const result = await logout(req.header('Authorization'));
  res.send(result);
});

// Authenticate a user with a password
router.post('/login', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log(JSON.stringify(req.body));
  const result = await loginPassword(req.body.username, req.body.password);
  res.send(result);
});

// Render signup page
router.get('/signup', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  res.redirect('/pages/signup.html');
});

// Create a user with a username and password
router.post('/signup', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log(JSON.stringify(req.body));
  const { username, password } = req.body
  const result = await signupPassword(username, password);
  res.send(result)
});

// The following endpoint is used by views/verify.ejs when a flow is completed, for token exchange
// SECURITY NOTES: Normally the ID token SHOULD NOT reach the UI, however this is a sample app and we want to display it for clarity.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-6-get-user-tokens
router.post('/fetch-tokens', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log(JSON.stringify(req.body));
  const tokens = await getUserTokens(req.body.authCode);
  res.send(tokens);
});

export default router;
