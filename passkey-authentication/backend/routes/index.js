import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.TS_RATE_LIMIT || 10, // 10 requests per minute per IP
  message: 'Too many requests from this IP, please try again in a minute',
});

router.get(['/'], async function (req, res) {
  if (!req.session?.tokens) {
    res.redirect('/pages/login.html');
  } else {
    res.redirect('/pages/home.html');
  }
});

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

  res.redirect('/pages/home.html');
});

// Get an authenticated user's saved ID Token or return a not found error
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
router.post('/logout', limiter, async function (req, res) {
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

export const indexRouter = router;
