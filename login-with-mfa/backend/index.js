import express from 'express';
import fetch from 'node-fetch';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import * as querystring from 'querystring';

const router = express.Router();

/**
 * For more information see https://developer.transmitsecurity.com/guides/user/auth_mfa_guide/
 * **/

// In a production server, you would cache the access token,
// and regenerate whenever it expires.
// This parameter emulates this 'cache' with a static variable for simplicity.
let accessToken = null;

// GET signup page
router.get('/', function (req, res) {
  res.redirect('/pages/signup.html');
});

router.post('/create-user', async function (req, res) {
  const username = req?.body?.username;
  const password = req?.body?.password;
  const phone = req?.body?.phone;

  if (!username || !password || !phone) {
    res.status(401).send({
      message: 'Received username, password, or phone is empty',
    });
  } else {
    try {
      accessToken = await common.tokens.getClientCredsToken();
      if (!accessToken) {
        res.status(500).send({ error: 'could not fetch access token' });
      }

      // create the user
      const createUserResponse = await createUser(username, phone, password);

      res.status(createUserResponse.status).send({
        received_username: username,
        ...createUserResponse,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        received_username: req.body.username,
        message: 'Error in the create user flow',
        error,
      });
    }
  }
});

router.post('/login', async function (req, res) {
  const username = req?.body?.username;
  const password = req?.body?.password;

  if (!username || !password) {
    res.status(401).send({
      message: 'Received username or password is empty',
    });
  } else {
    try {
      accessToken = await common.tokens.getClientCredsToken();
      if (!accessToken) {
        res.status(500).send({ error: 'could not fetch access token' });
      }

      // authenticate asking for MFA
      const loginResponse = await loginRequestMFA(username, password);

      if (loginResponse.status === 200) {
        //create a session for the user with their username so that we can lookup their phone number
        //to send an OTP when we get challenged with MFA
        req.session.username = username;
        req.session.save();
      }

      res.status(loginResponse.status).send({
        received_username: username,
        ...loginResponse,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        received_username: req.body.username,
        message: 'Error in the password login flow',
        error,
      });
    }
  }
});

router.post('/verify-sms-otp', async function (req, res) {
  const otpCode = req?.body?.otpCode;
  console.log('received body is', req?.body);

  if (!otpCode) {
    res.status(400).send({
      message: 'Received OTP is empty',
    });
  } else {
    const phoneNumber = req.session.phone;
    try {
      const validateOtpResponse = await validateSmsOTP(phoneNumber, otpCode);
      res.status(validateOtpResponse.status).send({ ...validateOtpResponse.data });
    } catch (error) {
      res.status(500).send({
        received_phone_number: phoneNumber,
        received_otp: otpCode,
        error,
      });
    }
  }
});

router.get('/complete', async function (req, res) {
  if (Object.keys(req.query).length === 0) {
    res.send(`/complete is only intended to be reached through a redirect`);
  }

  console.log(`complete handler received query params:`);
  console.log(req.query);

  if (req.query.error === 'mfa_required') {
    //should probably examine the error_description field to determine what other MFA methods can be used and
    //potentially present to the user we default to SMS OTP in this example

    try {
      const getUserResponse = await getUserByUsername(req.session.username);
      const phone = getUserResponse.result?.phone_number?.value;

      res.redirect('/pages/sms-otp.html');
      if (phone === undefined) {
        const error = {
          error: `Username ${req.session.username} does not have a primary phone number`,
        };
        res.redirect(`/pages/complete.html?${querystring.stringify(error)}`);
        return;
      }

      console.log(`mfa required, sending SMS OTP and redirecting to sms otp page`);
      //const sendOtp = await sendSmsOTP(phone);
      //todo: do something here if issue sending otp
      await sendSmsOTP(phone);

      //save the user's phone number so we can validate the OTP code
      req.session.phone = phone;
      req.session.save();
    } catch (error) {
      res.status(500).send({
        error: error,
      });
    }
  } else {
    res.redirect(`/pages/complete.html?${querystring.stringify(req.query)}`);
  }
});

async function createUser(username, phone, password) {
  const clientToken = await common.tokens.getClientCredsToken();

  const resp = await fetch(common.config.apis.createUser, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({
      username: username,
      phone_number: phone,
      credentials: {
        password: password,
        force_replace: false,
      },
    }),
  });
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return { status, ...data };
}

async function loginRequestMFA(username, password) {
  const clientToken = await common.tokens.getClientCredsToken();

  const resp = await fetch(common.config.apis.passwordLogin, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({
      username: username,
      password: password,
      client_id: process.env.VITE_TS_CLIENT_ID,
      redirect_uri: process.env.TS_REDIRECT_URI,
      require_mfa: true,
    }),
  });
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return { status, ...data };
}

async function getUserByUsername(username) {
  const clientToken = await common.tokens.getClientCredsToken();

  const resp = await fetch(common.config.apis.getUserByUsername(username), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
  });

  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return { status, ...data };
}

async function sendSmsOTP(phoneNumber) {
  const url = common.config.apis.sendOtpSMS;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      redirect_uri: process.env.TS_REDIRECT_URI,
      require_mfa: true,
    }),
  };

  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return { status, data };
}

async function validateSmsOTP(phoneNumber, otpCode) {
  const url = common.config.apis.validateOtpSMS;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      passcode: otpCode,
    }),
  };

  const resp = await fetch(url, options);
  const status = resp.status;
  const data = await resp.json();
  console.log('response is ', { status, data });
  return { status, data };
}

export const indexRouter = router;
