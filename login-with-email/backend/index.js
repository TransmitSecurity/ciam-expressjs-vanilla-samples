import express from 'express'
import fetch from 'node-fetch'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/pages/email-otp.html')
})

router.post('/email-otp', async function (req, res) {
  const email = req?.body?.email

  if (!email) {
    res.send({
      message: 'Received email is empty',
    })
  } else {
    try {
      // fetch access token, and save both token and email on session, for the OTP call later
      const accessTokenResponse = await getClientCredentialsToken()
      if (accessTokenResponse.status == 200) {
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

router.get('/complete', function (req, res, next) {
  if (req.query.code) {
    res.send(`Login completed with code: ${req.query.code}`)
  } else {
    res.send(`Login completed with error: ${req.query.error}`)
  }
})

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
