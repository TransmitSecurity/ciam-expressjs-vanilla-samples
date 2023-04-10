import { Router } from 'express';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = Router();

router.get(['/saml/authn'], async function (req, res) {
  if (req.query.SAMLRequest) {
    req.session.samlRequest = req.query.SAMLRequest;
    res.redirect('@ciam-expressjs-vanilla-samples/login-with-sms/pages/sms-otp.html');
  } else {
    res.send(`No SAML request`);
  }
});

router.get('/complete', async function (req, res) {
  if (req.query.code) {
    const params = new URLSearchParams(req.query);
    const tokens = await common.tokens.getUserTokens(params.get('code'));

    if (tokens.access_token) {
      const samlIdpUrl = common.config.apis.samlIdpUrl;
      const url = `${samlIdpUrl}?SAMLRequest=${req.session.samlRequest}`;
      res.set(`Authorization: Bearer ${tokens.access_token}`);
      res.redirect(302, url);
    }
  } else {
    res.send(`Login with SMS completed with error: ${req.query.error}`);
  }
});

export const indexRouter = router;
