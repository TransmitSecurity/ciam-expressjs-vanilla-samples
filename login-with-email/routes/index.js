const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

// This is step 1
router.get("/verify/:code", (req, res) => {
    /*const step1Error = 
    'Please uncomment the code for Step 1 - https://developer.transmitsecurity.com/guides/user/auth_email_otp/#step-1-create-redirect-uri';
    throw Exeception(step1Error);*/

    const code = req.params.code;
    console.log(`The code is: ${code}`);
    res.send(`Verification code: ${code}`);
});

router.post("/email-otp", async function (req, res, next) {

    //throw 'Please uncomment the code for Step 3 - https://developer.transmitsecurity.com/guides/user/auth_email_otp/#step-3-send-email-otp';
    try {

        let startEmailFlow = async (accessTokenResponse) => {
            if (accessTokenResponse) {
                console.log(`The access-token response is ${JSON.stringify(accessTokenResponse)}`)

                await sendEmailOTP(accessTokenResponse).then((response) => {
                    console.log(`The email-otp response is ${JSON.stringify(response.data)}`)
                }).catch((error) => {
                    console.error(`The email-otp error is ${error}`)
                })
            }
        };
        
        await getAccessToken().then(startEmailFlow).catch((error) => {
            console.error(`The access token error is ${error}`)
        })

        res.send({received_email: req.body.email});

    } catch (error) {
    }
});

async function getAccessToken() {
    const url = 'https://api.userid-stg.io/oidc/token';
    const clientId = 'QMgQyKgMZHUOdlQhVMt0x';
    const clientSecret = '181f3319-de0f-433c-8426-4dc8d54d7732';
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
            console.log(`The access token response is ${accessToken}`)
            return accessToken;
        }

        return null;
    } catch (e) {

        const errorLog = `There was a problem with the access token request ${e}`;
        console.log(errorLog)
        return errorLog
    }
}

async function sendEmailOTP(bearerToken) {
    const url = 'https://api.userid-stg.io/v1/auth/otp/email';
    const data = {
        email: 'hila.partuk@transmitsecurity.com',
        redirect_uri: 'http://localhost:3000/verify',
        create_new_user: true,
    };
    const config = {
        headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": 'application/json',
        },
    };

    try {
        return await axios.post(url, data, config);
    } catch (e) {
        const errorLog = `There was a problem with the email-otp request ${{error: e}}`;
        console.log(errorLog)
        return errorLog
    }
}

module.exports = router;
