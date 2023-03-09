import express from 'express';
import fetch from 'node-fetch';
import escape from 'escape-html';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();

/**
 * For more information see https://developer.transmitsecurity.com/guides/user/auth_sms_otp
 * **/

// In a production server, you would cache the access token,
// and regenerate whenever it expires.
// This parameter emulates this 'cache' with a static variable for simplicity.
let accessToken = null;

// GET login page
router.get('/', function (req, res) {
  res.redirect('/pages/sms-otp.html');
});

router.post('/sms-otp', async function (req, res) {
  const phone = req?.body?.phone;

  if (!phone) {
    res.send({
      message: 'Received phone is empty',
    });
  } else {
    try {
      // fetch access token
      // For more information see https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
      accessToken = await common.tokens.getClientCredsToken();
      if (!accessToken) {
        res.status(500).send({ error: 'could not fetch access token' });
      }

      // send the OTP SMS
      const smsOtpResponse = await sendSmsOTP(phone);
      res.status(smsOtpResponse.status).send({
        received_phone: phone,
        response: JSON.stringify(smsOtpResponse),
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        received_phone: phone,
        message: 'Error in the sms-otp flow',
        error,
      });
    }
  }
});

router.post('/verify', async function (req, res) {
  const phone = req.body?.phone;
  const otpCode = req?.body?.otpCode;
  console.log('received body is', req?.body);

  if (!otpCode || !phone || !accessToken) {
    res.status(400).send({
      message: 'Received OTP is empty or there was no previous call to send SMS',
    });
  } else {
    try {
      const validateOtpResponse = await validateOTP(phone, otpCode);
      res.status(validateOtpResponse.status).send({ ...validateOtpResponse.data });
    } catch (error) {
      res.status(500).send({
        received_phone: phone,
        received_otp: otpCode,
        error,
      });
    }
  }
});

router.get('/complete', function (req, res) {
  if (req.query.code) {
    res.send(`Login completed with code: ${escape(req.query.code)}`);
  } else {
    res.send(`Login completed with error: ${escape(req.query.error)}`);
  }
});

async function sendSmsOTP(phone) {
  const url = common.config.apis.sendOtpSMS;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: phone,
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

async function validateOTP(phone, otpCode) {
  const url = common.config.apis.validateOtpSMS;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: phone,
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

export const indexRouter = router;
