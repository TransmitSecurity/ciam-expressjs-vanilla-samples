import express from 'express'
import fetch from 'node-fetch'
const router = express.Router()

// GET login page
router.get('/', function (req, res, next) {
  res.redirect('/pages/email-otp.html')
})

// The following endpoint is used by pages/email-otp.html during a login flow
// It uses an API to send and email with the OTP code to the user
// For more information see https://developer.transmitsecurity.com/guides/user/auth_email_otp/#step-3-send-email-otp
router.post('/email-otp', async function (req, res) {
  const email = req?.body?.email

  if (!email) {
    res.send({
      message: 'Received email is empty',
    })
  } else {
    try {
      // fetch access token
      // For more information see https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
      const accessTokenResponse = await getClientCredentialsToken()
      if (accessTokenResponse.status == 200) {
        // Save both token and email on a temp session, used during the OTP validation call later
        req.session.accessToken = accessTokenResponse.data.access_token
        req.session.email = email
        req.session.save()
      } else {
        res.status(accessTokenResponse.status).send(accessTokenResponse)
      }

      // send the OTP email
      const emailOtpResponse = await sendEmailOTP(email, req.session.accessToken)
      res.status(emailOtpResponse.status).send({
        received_email: email,
        response: JSON.stringify(emailOtpResponse),
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        received_email: req.body.email,
        message: 'Error in the email-otp flow',
        error,
      })
    }
  }
})

// The following endpoint is used by pages/email-otp.html during a login flow
// It uses an API to validate the OTP code entered by the user
// For more information see hhttps://developer.transmitsecurity.com/guides/user/auth_email_otp/#step-4-validate-email-otp
router.post('/verify/:code?', async function (req, res) {
  ///${encodeURIComponent(otpCode)}`
  const email = req.session.email
  const otpCode = req?.body?.otpCode
  const accessToken = req.session.accessToken
  console.log('received body is', req?.body)

  if (!otpCode || !email || !accessToken) {
    res.status(400).send({
      message: 'Received OTP is empty or there was no previos call to send email on this session',
    })
  } else {
    try {
      const validateOtpResponse = await validateOTP(email, otpCode, accessToken)
      res.status(validateOtpResponse.status).send({ ...validateOtpResponse.data })
    } catch (error) {
      res.status(400).send({
        received_email: email,
        received_otp: otpCode,
        error,
      })
    }
  }
})

// The following endpoint is the OIDC completion endpoint, called by pages/email-otp.html to finalize the login flow
// Typically this would perform a token exchange and set a session as described in https://developer.transmitsecurity.com/guides/user/how_sessions_work/
// For more information see https://developer.transmitsecurity.com/guides/user/auth_email_otp/#step-5-obtain-user-token
router.get('/complete', function (req, res, next) {
  if (req.query.code) {
    res.send(`Login completed with code: ${req.query.code}`)
  } else {
    res.send(`Login completed with error: ${req.query.error}`)
  }
})

// For more information see https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
async function getClientCredentialsToken() {
  const url = 'https://api.userid.security/oidc/token'
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.VITE_TS_CLIENT_ID,
    client_secret: process.env.TS_CLIENT_SECRET,
  })
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  }

  // try / catch performed at the calling level, and transformed to a response
  console.log('about to call ' + JSON.stringify(options))
  const resp = await fetch(url, options)
  const status = resp.status
  const data = await resp.json()
  console.log('response is ', { status, data })
  return { status, data }
}

// For more information see https://developer.transmitsecurity.com/guides/user/auth_email_otp/#step-3-send-email-otp
async function sendEmailOTP(email, accessToken) {
  const url = 'https://api.userid.security/v1/auth/otp/email'
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
  }

  // try / catch performed at the calling level, and transformed to a response
  console.log('about to call ' + JSON.stringify(options))
  const resp = await fetch(url, options)
  const status = resp.status
  const data = await resp.json()
  console.log('response is ', { status, data })
  return { status, data }
}

// For more information see hhttps://developer.transmitsecurity.com/guides/user/auth_email_otp/#step-4-validate-email-otp
async function validateOTP(email, otpCode, accessToken) {
  const url = 'https://api.userid.security/v1/auth/otp/email/validation'
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
  }

  // try / catch performed at the calling level, and transformed to a response
  console.log('about to call ' + JSON.stringify(options))
  const resp = await fetch(url, options)
  const status = resp.status
  const data = await resp.json()
  console.log('response is ', { status, data })
  return { status, data }
}

export const indexRouter = router
