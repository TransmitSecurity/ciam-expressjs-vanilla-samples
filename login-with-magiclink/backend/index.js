import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import * as querystring from 'querystring';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.TS_RATE_LIMIT || 10, // 10 requests per minute per IP
  message: 'Too many requests from this IP, please try again in a minute',
});

/**
 * For more information see https://developer.transmitsecurity.com/guides/user/auth_email_magic_link/
 * **/

// In a production server, you would cache the access token,
// and regenerate whenever it expires.
// This parameter emulates this 'cache' with a static variable for simplicity.
let accessToken = null;

// GET login page
router.get('/', function (req, res) {
  res.redirect('/pages/magiclink.html');
});

router.post('/send-magic-link', limiter, async function (req, res) {
  const email = req?.body?.email;

  if (!email) {
    res.status(401).send({
      message: 'Received email is empty',
    });
  } else {
    try {
      accessToken = await common.tokens.getClientCredsToken();
      if (!accessToken) {
        res.status(500).send({ error: 'could not fetch access token' });
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
        received_email: req.body.email,
        message: 'Error in the magic link flow',
        error,
      });
    }
  }
});

router.get('/complete', function (req, res) {
  res.redirect(`/pages/complete.html?${querystring.stringify(req.query)}`);
});

async function sendMagicLink(email) {
  const url = common.config.apis.sendMagicLink;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      redirect_uri: process.env.TS_REDIRECT_URI,
      create_new_user: true,
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

export const indexRouter = router;
