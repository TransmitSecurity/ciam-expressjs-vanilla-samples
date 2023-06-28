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

export const indexRouter = router;
