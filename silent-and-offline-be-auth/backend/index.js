import express from 'express';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import {
  authenticateMagicLinkCode,
  authenticateWithSession,
  createUser,
  logout,
  refreshBackendToken,
  sendMagicLink,
} from './auth';

const router = express.Router();

// GET signup page
router.get(['/'], async function (req, res) {
  if (!req.session?.tokens) {
    res.redirect('/pages/signup.html');
  } else {
    res.redirect('/pages/complete.html');
  }
});

router.post('/create-user', common.utils.rateLimiter(), async function (req, res) {
  const { email } = req.body;
  if (!email) {
    res.status(401).send({
      message: 'Received email is empty',
    });
  } else {
    try {
      // create the user
      const createUserResponse = await createUser(email);

      res.status(createUserResponse.status).send({
        received_email: email,
        ...createUserResponse,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        received_email: email,
        message: 'Error in the create user flow',
        error,
      });
    }
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

// Get an authenticated user's data
router.get('/user', async function (req, res) {
  console.log('/user', req.session?.tokens?.idToken);
  if (req.session?.tokens?.idToken) {
    res.status(200).send({
      id_token: {
        ...req.session.tokens.idToken,
      },
      session_id: req.session?.tokens?.sessionId,
    });
  } else {
    res.status(401).send({
      message: 'No user found',
    });
  }
});

// Send magic link
router.post('/send-magic-link', common.utils.rateLimiter(), async function (req, res) {
  const email = req?.body?.email;

  if (!email) {
    res.status(401).send({
      message: 'Received email is empty',
    });
  } else {
    try {
      // send the magic link
      const magicLinkResponse = await sendMagicLink(email);
      res.status(magicLinkResponse.status).send({
        received_email: email,
        ...magicLinkResponse,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        received_email: email,
        message: 'Error in the magic link flow',
        error,
      });
    }
  }
});

// magic link callback
router.get('/complete', async function (req, res) {
  const { code } = req.query;

  if (!code) {
    res.redirect('/pages/complete.html?error=No code was received');
  }

  try {
    const { response, error } = await authenticateMagicLinkCode(code);

    if (error) {
      res.redirect(`/pages/complete.html?error=${response.message}`);
    } else {
      await validateToken(response.access_token);

      storeTokens(req, res, { response }, async () => {
        res.redirect(`/pages/complete.html`);
      });
    }
  } catch (error) {
    res.redirect(`/pages/complete.html?error=${error.message}`);
  }
});

// Perform backend refresh token flow
router.post('/refresh-token', common.utils.rateLimiter(), async function (req, res) {
  try {
    if (!req.session?.tokens?.refreshToken) {
      res.status(401).send({
        message: 'No refresh token found',
      });
      return;
    }

    const { response, error } = await refreshBackendToken(req.session.tokens.refreshToken);

    if (error) {
      res.status(500).send({
        message: 'Error in the refresh token flow',
        error,
      });
    } else {
      await validateToken(response.access_token);

      await storeTokens(req, res, { response }, async () => {
        res.status(200).send({
          message: 'Refresh token flow completed successfully',
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in the refresh token flow',
      error,
    });
  }
});

// Perform session authentication flow
router.post('/session-auth', common.utils.rateLimiter(), async function (req, res) {
  try {
    if (!req.session?.tokens?.sessionId) {
      res.status(401).send({
        message: 'No session id found',
      });
      return;
    }

    const { response, error } = await authenticateWithSession(req.session.tokens.sessionId);

    if (error) {
      res.status(500).send({
        message: 'Error in the session authentication flow',
        error,
      });
    } else {
      await validateToken(response.access_token);

      await storeTokens(req, res, { response }, async () => {
        res.status(200).send({
          message: 'Session authentication flow completed successfully',
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in the session authentication flow',
      error,
    });
  }
});

async function storeTokens(req, res, loginResponse, next) {
  const tokens = loginResponse?.response;

  if (tokens?.id_token) {
    const idToken = common.tokens.parseJwt(tokens.id_token);

    req.session.tokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      sessionId: tokens.session_id || req.session?.tokens?.sessionId,
      idToken,
    };

    req.session.save();
  }

  await next();
}

async function validateToken(token) {
  return common.tokens.validateToken(token);
}

export const indexRouter = router;
