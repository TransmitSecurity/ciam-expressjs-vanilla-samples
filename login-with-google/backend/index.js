import express from 'express';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import querystring from 'querystring';

const router = express.Router();

/**
 * For more information see https://developer.transmitsecurity.com/guides/user/auth_google/
 * **/

// GET login page
router.get('/', function (req, res) {
  res.redirect('/pages/google-login.html');
});

router.get('/google-login', common.utils.rateLimiter(), async function (req, res) {
  try {
    const googleLoginResponse = await googleLogin();

    res.status(googleLoginResponse.status).send({
      ...googleLoginResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in the google-login flow',
      error,
    });
  }
});

router.get('/complete', function (req, res) {
  res.redirect(`/pages/complete.html?${querystring.stringify(req.query)}`);
});

async function googleLogin() {
  const googleLoginUrl = common.config.apis.googleLogin;

  const queryParams = new URLSearchParams({
    client_id: process.env.VITE_TS_CLIENT_ID,
    redirect_uri: process.env.TS_REDIRECT_URI,
    create_new_user: true,
  });

  const url = `${googleLoginUrl}?${queryParams.toString()}`;
  console.log('about to call ' + url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const status = response.status;
  const data = await response.json();

  console.log('response is ', { status, data });
  return { status, ...data };
}
export const indexRouter = router;
