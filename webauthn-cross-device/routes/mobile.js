var express = require("express");
var router = express.Router();
const fetch = require("node-fetch-commonjs");

// Render mobile page
router.get("/", async function (req, res, next) {
  // TODO add error handling, ommited for sample clarity
  res.render("mobile", {
    clientId: process.env.TS_CLIENT_ID,
    authSessionId: req.query.aid
  });
});

// The following endpoint is used by views/mobile.ejs during a registration flow
// It uses an API to elevate a cross device session to allow credential registration
// For more information see https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/#step-3-register-credentials
router.post("/authorize-session-user", async function (req, res, next) {
  // TODO add error handling, ommited for sample clarity
  console.log(JSON.stringify(req.body));
  const accessToken = await getClientCredentialsToken();
  await authorizeAuthnSession(
    accessToken,
    
    req.body.authSessionId,
    req.body.username
  );
  res.send({ status: "ok" });
});

// This function wraps and API call for fetching client credential tokens. 
// A client credential token is used for authorizing backend to API calls using the client ID and client secret.
// For more information see https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
async function getClientCredentialsToken() {
  const url = "https://api.userid.security/oidc/token";
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.TS_CLIENT_ID,
    client_secret: process.env.TS_CLIENT_SECRET
  });
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  };

  try {
    const resp = await fetch(url, options);
    const data = await resp.json();
    console.log(resp.headers, resp.status, data);
    return data.access_token;
  } catch (e) {
    console.log(e);
  }
}

// This function wraps and API call for elevating the auth-session and allows using it for registration. 
// The input access token in this sample app is a client credentials token, however could also use access tokens
// that are obtained via user authentication, e.g. password login or email OTP.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/#step-3-register-credentials
async function authorizeAuthnSession(accessToken, authSessionId, username) {
  const url = "https://webauthn.identity.security/v1/auth-session/authorize";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      client_id: process.env.TS_CLIENT_ID,
      username: username,
      auth_session_id: authSessionId
    })
  };

  try {
    console.log(
      `calling for ${options.body} with ${options.headers.Authorization}`
    );
    return await fetch(url, options);
  } catch (e) {
    console.log(e);
  }
}

module.exports = router;
