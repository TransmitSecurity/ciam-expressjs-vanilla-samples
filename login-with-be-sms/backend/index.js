import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';

const router = express.Router();

/**
 * For more information see https://developer.transmitsecurity.com/guides/user/be_auth_sms_otp/
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
  const { phone } = req.body;
  if (!phone) {
    res.status(401).send({
      message: 'Received phone is empty',
    });
  } else {
    try {
      // create the user
      const createUserResponse = await createUser(phone);

      res.status(createUserResponse.status).send({
        received_phone: phone,
        ...createUserResponse,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        received_phone: phone,
        message: 'Error in the create user flow',
        error,
      });
    }
  }
});

router.post('/send-sms-otp', common.utils.rateLimiter(), async function (req, res) {
  const phone = req?.body?.phone_number;

  if (!phone) {
    res.status(400).send({
      message: 'Received phone is empty',
    });
  } else {
    try {
      // fetch access token
      // For more information see https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
      accessToken = await common.tokens.getClientCredsToken();
      if (!accessToken) {
        return res.status(500).send({ error: 'could not fetch access token' });
      }

      // send the OTP sms
      const smsOtpResponse = await sendSMSOTP(phone);
      res.status(smsOtpResponse.status).send({
        received_phone: phone,
        ...smsOtpResponse,
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

router.post('/authenticate', common.utils.rateLimiter(), async function (req, res) {
  const { phone_number: phone, otpCode } = req?.body ?? {};
  console.log('received body is', req?.body);

  if (!otpCode || !phone || !accessToken) {
    res.status(400).send({
      message: 'Received OTP is empty or there was no previous call to send SMS',
    });
  } else {
    try {
      const token = await authenticateSMSOtp(phone, otpCode);
      const validationResult = await validateToken(token);
      res.send(validationResult);
    } catch (error) {
      res.status(500).send({
        received_phone: phone,
        received_otp: otpCode,
        error,
      });
    }
  }
});

async function sendSMSOTP(phone) {
  const url = common.config.apis.sendBackendOtp;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: 'sms',
      identifier: phone,
      identifier_type: 'phone_number',
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

async function authenticateSMSOtp(phone, otpCode) {
  const url = common.config.apis.authenticateBackendOtp;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      passcode: otpCode,
      identifier: phone,
      identifier_type: 'phone_number',
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

async function createUser(phone) {
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
      phone_number: phone,
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
