import express from 'express';
import { common } from '@ciam-expressjs-vanilla-samples/shared';
import {
  authenticatePassword,
  authenticateSMSOtp,
  createUser,
  getUserByUsername,
  logout,
  sendSMSOTP,
} from './auth.js';

const router = express.Router();

/**
 * For more information see https://developer.transmitsecurity.com/guides/user/be_auth_mfa/
 * **/

// GET signup page
router.get('/', function (req, res) {
  res.redirect('/pages/signup.html');
});

router.post('/create-user', common.utils.rateLimiter(), async function (req, res) {
  const username = req?.body?.username;
  const password = req?.body?.password;
  const phone = req?.body?.phone;

  if (!username || !password || !phone) {
    res.status(401).send({
      message: 'Received username, password, or phone is empty',
    });
  } else {
    try {
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

router.post('/login', common.utils.rateLimiter(), async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).send({
      message: 'Received username or password is empty',
    });
  } else {
    try {
      // authenticate
      const loginResponse = await authenticatePassword(username, password);
      console.log('password login response', loginResponse);
      await reply(req, res, loginResponse, async () => {
        await sendSMSOtpAndReply(req, res, username);
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        received_username: username,
        message: 'Error in the password login flow',
        error,
      });
    }
  }
});

router.post('/logout', common.utils.rateLimiter(), async function (req, res) {
  const sessionId = req.session?.tokens?.sessionId;
  if (sessionId) {
    req.session.destroy(err => console.log(err));
    const response = await logout(sessionId);
    console.log('Logout response status', response.status);
    if (response.status !== 204) {
      const jsonResponse = await response.json();
      console.log('Logout response', jsonResponse);
      res.status(response.status).send({ ...jsonResponse });
    } else {
      res.status(204).send({ status: 'success' });
    }
  } else {
    res.status(404).send(null);
  }
});

router.post('/verify-sms-otp', common.utils.rateLimiter(), async function (req, res) {
  const { otpCode } = req.body;

  if (!otpCode) {
    res.status(400).send({
      message: 'Received OTP is empty',
    });
  } else {
    const phoneNumber = req.session.phone;
    try {
      const loginResponse = await authenticateSMSOtp(
        phoneNumber,
        otpCode,
        req.session.tokens.sessionId,
      );
      await reply(req, res, loginResponse);
    } catch (error) {
      res.status(500).send({
        received_phone_number: phoneNumber,
        received_otp: otpCode,
        error,
      });
    }
  }
});

// Get an authenticated user's data
router.get('/user', async function (req, res) {
  console.log('/user', req.session?.tokens?.idToken);
  if (req.session?.tokens?.idToken) {
    res.status(200).send({
      result: {
        ...req.session.tokens.idToken,
      },
    });
  } else {
    res.status(404).send(null);
  }
});

async function sendSMSOtpAndReply(req, res, username) {
  try {
    const getUserResponse = await getUserByUsername(username);
    const phone = getUserResponse.result?.phone_number?.value;

    if (phone === undefined) {
      const error = {
        error: `Username ${username} does not have a primary phone number`,
      };
      res.status(400).send({
        error,
      });
      return;
    }

    console.log(`mfa required, sending SMS OTP and redirecting to sms otp page`);
    await sendSMSOTP(phone);

    //save the user's phone number so we can validate the OTP code
    req.session.phone = phone;
    req.session.save();

    res.status(200).send({
      status: 'SMS OTP sent',
    });
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
}

async function reply(req, res, loginResponse, next) {
  if (loginResponse?.error) {
    res.status(loginResponse.status).send(loginResponse);
  } else {
    const tokens = loginResponse?.response;

    if (tokens?.id_token) {
      const idToken = common.tokens.parseJwt(tokens.id_token);

      req.session.tokens = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        sessionId: tokens.session_id,
        idToken,
      };

      console.log('MFA required?', !req.session.tokens.idToken.amr.includes('mfa'));

      req.session.save();
      if (next) {
        await next();
      } else {
        res.status(loginResponse.status).send({
          status: 'success',
        });
      }
    }
  }
}

export const indexRouter = router;
