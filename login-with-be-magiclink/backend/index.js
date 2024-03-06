import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import querystring from 'querystring';

const router = express.Router();

/**
 * For more information see https://developer.transmitsecurity.com/guides/user/be_auth_email_magic_link/
 * **/

// In a production server, you would cache the access token,
// and regenerate whenever it expires.
// This parameter emulates this 'cache' with a static variable for simplicity.
let accessToken = null;

// GET signup page
router.get('/', function (req, res) {
  res.redirect('/pages/signup.html');
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

router.post('/send-magic-link', common.utils.rateLimiter(), async function (req, res) {
  const email = req?.body?.email;

  if (!email) {
    res.status(401).send({
      message: 'Received email is empty',
    });
  } else {
    try {
      accessToken = await common.tokens.getClientCredsToken();
      if (!accessToken) {
        return res.status(500).send({ error: 'could not fetch access token' });
      }

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

router.get('/complete', function (req, res) {
  res.redirect(`/pages/complete.html?${querystring.stringify(req.query)}`);
});

router.post('/authenticate', common.utils.rateLimiter(), async function (req, res) {
  try {
    const code = req.body.code;
    const token = await authenticateMagicLinkCode(code);
    const validationResult = await validateToken(token);

    res.send(validationResult);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: 'Error in the token validation',
      error,
    });
  }
});

async function sendMagicLink(email) {
  const url = common.config.apis.sendBackendMagicLink;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      redirect_uri: process.env.TS_REDIRECT_URI,
    }),
  };

  // try / catch performed at the calling level, and transformed to a response
  console.log('about to call ' + JSON.stringify(options));
  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return { status, ...data };
}

async function authenticateMagicLinkCode(code) {
  const url = common.config.apis.authenticateBackendMagicLink;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  };

  // try / catch performed at the calling level, and transformed to a response
  console.log('about to call ' + JSON.stringify(options));
  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return data.access_token;
}

async function createUser(email) {
  if (!accessToken) {
    accessToken = await common.tokens.getClientCredsToken();
  }

  const resp = await fetch(common.config.apis.createUser, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      email,
    }),
  });
  const status = resp.status;
  const data = await resp.json();
  console.log('response of creating user is ', { status, data });
  return { status, ...data };
}

async function validateToken(token) {
  return common.tokens.validateToken(token);
}

export const indexRouter = router;
