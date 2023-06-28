import express from 'express';
import querystring from 'querystring';

const router = express.Router();

/**
 * For more information see https://developer.transmitsecurity.com/guides/user/auth_google/
 * **/

// GET login page
router.get('/', function (req, res) {
  res.redirect('/pages/google-login.html');
});

router.get('/complete', function (req, res) {
  res.redirect(`/pages/complete.html?${querystring.stringify(req.query)}`);
});

router.get('/google-url', function (req, res) {
  res.send({
    url: 'blaaaaaaaaaa',
  });

  /*
      const googleLoginUrl = common.config.apis.googleLogin;
  
      const queryParams = new URLSearchParams({
          client_id: process.env.VITE_TS_CLIENT_ID,
          redirect_uri: process.env.TS_REDIRECT_URI,
          create_new_user: true,
      });
  
      const url = `${googleLoginUrl}?${queryParams.toString()}`;
      console.log('about to call ' + url);
  */
});

export const indexRouter = router;
