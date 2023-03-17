import { Router } from 'express';
import { login, signUp } from '../lib/passwords';

const router = Router();

// Render verification page
router.get('/complete', async function (req, res) {
  const params = new URLSearchParams(req.query);
  res.redirect(`/pages/complete.html?${params.toString()}`);
});

// Render login page
router.get(['/', '/login'], async function (req, res) {
  const params = new URLSearchParams(req.query);
  res.redirect(`/pages/login.html?${params.toString()}`);
});

// Authenticate a user with a password
router.post('/login', async function (req, res) {
  console.log(JSON.stringify(req.body));
  const { username, password } = req.body;

  const result = await login(username, password);
  res.send(result);
});

// Render signup page
router.get('/signup', async function (req, res) {
  res.redirect('/pages/signup.html');
});

// Create a user with a username and password
router.post('/signup', async function (req, res) {
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

export default router;
