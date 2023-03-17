import { Router } from 'express';
import { loginPassword, signupPassword } from '../lib/passwords';

const router = Router();

// Render verification page
router.get('/complete', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  const params = new URLSearchParams(req.query);
  res.redirect(`/pages/complete.html?${params.toString()}`);
});

// Render login page
router.get(['/', '/login'], async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  const params = new URLSearchParams(req.query);
  res.redirect(`/pages/login.html?${params.toString()}`);
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
  const { username, password } = req.body;
  const result = await signupPassword(username, password);
  res.send(result);
});

export default router;
