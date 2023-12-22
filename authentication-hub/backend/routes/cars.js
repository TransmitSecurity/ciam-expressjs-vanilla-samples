import { Router } from 'express';
import { hasUserSessions } from '../lib/management';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const carsRouter = Router();

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

// Render home page
carsRouter.get(['/', '/home'], async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log('==== REQUEST URL: ', req.url);
  const params = new URLSearchParams(req.query);
  if (params.has('uid') && !req.session.carTokens) {
    params.append('silentLogin', 'true');
  }
  res.redirect(`/pages/cars/home.html?${params.toString()}`);
});

// Render verification page
carsRouter.get('/complete', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  const params = new URLSearchParams(req.query);
  res.redirect(`/pages/cars/complete.html?${params.toString()}`);
});

// Render login page
carsRouter.get('/login', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  res.redirect('/pages/cars/login.html');
});

// Logout user
carsRouter.post('/logout', common.utils.rateLimiter(), async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  try {
    req.session.carTokens = undefined;
    req.session.save();

    const params = new URLSearchParams({
      client_id: process.env.VITE_TS_CLIENT_ID_SSOCARS,
      post_logout_redirect_uri: req.headers.origin + req.baseUrl,
    });

    const url = `${common.config.apis.sessionEnd}?${params.toString()}`;
    res.status(200).send({ url });
  } catch (ex) {
    res.send({ error: ex });
  }
});

// The following endpoint is used by views/complete.html when a flow is completed, for token exchange
// SECURITY NOTES: Normally the ID token SHOULD NOT reach the UI, however this is a sample app and we want to display it for clarity.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-6-get-user-tokens
carsRouter.post('/fetch-tokens', common.utils.rateLimiter(), async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log(JSON.stringify(req.body));
  const tokens = await common.tokens.getUserTokens(
    req.body.authCode,
    process.env.VITE_TS_CLIENT_ID_SSOCARS,
    process.env.TS_CLIENT_SECRET_SSOCARS,
    process.env.VITE_TS_REDIRECT_URI_SSOCARS,
  );

  // Here we the session, this will automatically set a cookie on the user's browser
  // Transmit does not recommend using the access token directly from the front-end
  // See: https://developer.transmitsecurity.com/guides/user/manage_user_sessions/#step-3-store-session
  // For cookies security recommendations, see: https://developer.transmitsecurity.com/guides/user/how_sessions_work/#session-cookie
  if (tokens.id_token) {
    // TODO: verify tokens signature
    const idToken = parseJwt(tokens.id_token);
    req.session.carTokens = {
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
carsRouter.get('/user-info', async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  console.log('/user-info', req.session.carTokens);
  if (req.session.carTokens) {
    const hasSessions = await hasUserSessions(
      req.session.carTokens.idToken.sub,
      process.env.VITE_TS_CLIENT_ID_SSOCARS,
      process.env.TS_CLIENT_SECRET_SSOCARS,
    );

    if (hasSessions) {
      res.status(200).send({
        idToken: req.session.carTokens.idToken,
      });
      return;
    }
  }

  req.session.carTokens = undefined;
  req.session.save();
  res.status(404).send({
    idToken: null,
  });
});

export default carsRouter;
