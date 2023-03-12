import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();

/**
 * For more information see https://developer.transmitsecurity.com/guides/user/auth_email_otp
 * **/

let accessToken = null;

router.get(['/'], async function (req, res) {
  res.redirect('/pages/otp.html');
});

router.post('/email-otp', async function (req, res) {
  const email = req?.body?.email;

  if (!email) {
    res.send({
      message: 'Received email is empty',
    });
  } else {
    try {
      // fetch access token
      // For more information see https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
      accessToken = await common.tokens.getClientCredsToken();
      if (!accessToken) {
        res.status(401).send({ error: 'could not fetch access token' });
      }

      // send the OTP email
      const emailOtpResponse = await sendEmailOTP(email);
      res.status(emailOtpResponse.status).send({
        received_email: email,
        response: JSON.stringify(emailOtpResponse),
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        received_email: req.body.email,
        message: 'Error in the email-otp flow',
        error,
      });
    }
  }
});

router.post('/verify', async function (req, res) {
  const email = req.body?.email;
  const otpCode = req?.body?.otpCode;
  console.log('received body is', req?.body);

  if (!otpCode || !email || !accessToken) {
    res.status(400).send({
      message: 'Received OTP is empty or there was no previous call to send email',
    });
  } else {
    try {
      const validateOtpResponse = await validateOTP(email, otpCode);
      res.status(validateOtpResponse.status).send({ ...validateOtpResponse.data });
    } catch (error) {
      res.status(500).send({
        received_email: email,
        received_otp: otpCode,
        error,
      });
    }
  }
});

async function sendEmailOTP(email) {
  const url = common.config.apis.sendOtpEmail;
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
  return { status, data };
}

async function validateOTP(email, otpCode) {
  const url = common.config.apis.validateOtpEmail;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      passcode: otpCode,
    }),
  };

  // try / catch performed at the calling level, and transformed to a response
  console.log('about to call ' + JSON.stringify(options));
  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return { status, data };
}

export const otpRouter = router;
