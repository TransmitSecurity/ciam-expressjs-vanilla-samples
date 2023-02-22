const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();

let accessToken = null;
let email = null;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post("/complete/:code?", async function (req, res) {

    ///${encodeURIComponent(otpCode)}`
    const otpCode = req?.body?.otpCode;
    console.log('received body is', req?.body)
    
    if (!otpCode) {
        res.send({
            message: 'Received OTP is empty',
        });
    } else {
        try {
            const validateOtpResponse = await validateOTP(otpCode)
            res.send({
                received_email: email,
                received_otp: otpCode,
                response: validateOtpResponse
            });

        } catch (error) {
            res.send({
                received_email: email,
                received_otp: otpCode,
                error
            });
        }
    }

    /*const code = req.params.code;
    console.log(`The code is: ${code}`);
    res.send({code});*/
});

router.post("/email-otp", async function (req, res) {
    email = req?.body?.email;

    if (!email) {
        res.send({
            message: 'Received email is empty',
        });
    } else {
        try {
            const emailOtpResponse = await startEmailOtpFlow()
            res.send({
                received_email: req.body.email,
                message: emailOtpResponse?.message,
                status: emailOtpResponse?.status
            });

        } catch (error) {
            res.send({
                received_email: req.body.email,
                message: 'Error in the email-otp flow',
                error
            });
        }
    }
});

async function startEmailOtpFlow() {
    const accessTokenResponse = await getAccessToken();

    if (accessTokenResponse) {
        accessToken = accessTokenResponse;

        const emailOtpResponse = await sendEmailOTP();

        if (emailOtpResponse) {

            return {
                message: emailOtpResponse.message,
                status: 200
            }
        }
    }

    return null;
}

async function getAccessToken() {
    const url = 'https://api.userid.security/oidc/token';
    const clientId = process.env.TS_CLIENT_ID;
    const clientSecret = process.env.TS_CLIENT_SECRET;
    const requestUrlEncodedParams = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': clientId,
        'client_secret': clientSecret
    });
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const config = {
        method: 'post',
        url,
        headers,
        data: requestUrlEncodedParams
    };

    try {
        const response = await axios(config)
        const accessToken = response?.data?.access_token;

        if (accessToken) {
            console.log('The access-token request succeeded.', accessToken);
            return accessToken;
        }

    } catch (e) {
        console.error('There was a problem with the access token request', {e})
    }

    return null;
}

async function sendEmailOTP() {
    const url = 'https://api.userid.security/v1/auth/otp/email';
    const data = {
        email,
        redirect_uri: process.env.TS_REDIRECT_URI,
        create_new_user: true,
    };
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": 'application/json',
        },
    };

    try {
        const emailOtpResponse = await axios.post(url, data, config);

        if (emailOtpResponse?.data) {
            console.log('The email-otp request succeeded', emailOtpResponse.data)
            return emailOtpResponse.data;
        }
    } catch (e) {
        console.error('There was a problem with the email-otp request', {error: e})
    }

    return null
}

async function validateOTP(otpCode) {
    const url = 'https://api.userid.security/v1/auth/otp/email/validation';
    const data = {
        email,
        passcode: otpCode,
    };
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": 'application/json',
        },
    };

    try {
        const validateOtpResponse = await axios.post(url, data, config);

        if (validateOtpResponse?.data) {
            console.log('The validate-otp request succeeded', validateOtpResponse.data)
            return validateOtpResponse.data;
        }
    } catch (e) {
        console.error('There was a problem with the validate-otp request', {error: e})
    }

    return null
}

module.exports = router;
