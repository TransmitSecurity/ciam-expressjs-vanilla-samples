var express = require("express");
var router = express.Router();

// Render desktop page
router.get("/", async function (req, res, next) {
  // TODO add error handling, ommited for sample clarity
  res.render("desktop", {
    clientId: process.env.TS_CLIENT_ID,
    appId: process.env.TS_APP_ID
  });
});

// The following endpoint is used by views/desktop.ejs when a flow is completed, for token exchange
// SECURITY NOTES: Normally the ID token SHOULD NOT reach the UI, however this is a sample app and we want to display it for clarity.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-6-get-user-tokens
router.post("/fetch-tokens", async function (req, res, next) {
  // TODO add error handling, ommited for sample clarity
  console.log(JSON.stringify(req.body));
  const tokens = await getUserTokens(req.body.authCode);
  res.send(tokens);
});

// This function wraps and API call for fetching user access and ID tokens, based on a provide authCode 
// The access token is used for authorizing backend to API calls on behalf of the user, the ID token identifies the user.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-6-get-user-tokens
async function getUserTokens(authCode) {
  const url = "https://api.userid.security/oidc/token";
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    client_id: process.env.TS_CLIENT_ID,
    client_secret: process.env.TS_CLIENT_SECRET,
    redirect_uri: process.env.TS_REDIRECT_URI
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  };
  console.log(JSON.stringify(options));

  try {
    const resp = await fetch(url, options);
    const data = await resp.json();

    // NOTE: A production implementation should also validate the token signatures via the OIDC JWKS API
    // For more information see https://developer.transmitsecurity.com/openapi/user/oidc/#operation/oidcGetKeys
    console.log(resp.headers, resp.status, data);
    return data;
  } catch (e) {
    console.log(e);
  }
}

module.exports = router;
