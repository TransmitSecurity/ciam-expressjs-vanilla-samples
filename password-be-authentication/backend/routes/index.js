import { Router } from 'express';
import { login, signUp, logout } from '../lib/passwords';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = Router();

// Render home page
router.get(['/'], async function (req, res) {
  if (!req.session?.tokens) {
    res.redirect('/pages/login.html');
  } else {
    res.redirect('/pages/home.html');
  }
});

// Create a user with a username and password
router.post('/signup', common.utils.rateLimiter(), async function (req, res) {
  const { username, password } = req.body;
  const signupResponse = await signUp(username, password);
  console.log('Signup response', signupResponse);

  if (signupResponse.status >= 400) {
    res.send(signupResponse);
  } else {
    const loginResponse = await login(username, password);
    await reply(req, res, loginResponse);
  }
});

// Authenticate a user with a password
router.post('/login', common.utils.rateLimiter(), async function (req, res) {
  const { username, password } = req.body;

  const loginResponse = await login(username, password);
  await reply(req, res, loginResponse);
});

// Get an authenticated user's data
router.get('/user', async function (req, res) {
  console.log('/user', req.session?.tokens?.idToken);
  if (req.session?.tokens?.idToken) {
    res.status(200).send({
      result: req.session?.tokens?.idToken,
    });
  } else {
    res.status(404).send(null);
  }
});

// Logout user
router.post('/logout', common.utils.rateLimiter(), async function (req, res) {
  const sessionId = req.session?.tokens?.sessionId;
  if (sessionId) {
    req.session.destroy(err => console.log(err));
    const response = await logout(sessionId);
    console.log('Logout response status', response.status);
    if (response.status !== 204) {
      const jsonResponse = await response.json();
      console.log('Logout response', jsonResponse);
      res.status(response.status).send({ ...jsonResponse });
    } else {
      res.status(204).send({ status: 'success' });
    }
  } else {
    res.status(404).send(null);
  }
});

async function reply(req, res, loginResponse) {
  if (loginResponse?.error) {
    res.status(loginResponse.status).send(loginResponse);
  } else {
    const tokens = loginResponse?.response;

    if (tokens?.id_token) {
      const idToken = common.tokens.parseJwt(tokens.id_token);

      req.session.tokens = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        sessionId: tokens.session_id,
        idToken,
      };

      req.session.save();
    }

    res.status(loginResponse.status).send({
      status: 'success',
    });
  }
}

export default router;
