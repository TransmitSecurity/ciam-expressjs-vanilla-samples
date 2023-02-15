var express = require("express");
var router = express.Router();
const fetch = require("node-fetch-commonjs");

/* GET mobile page. */
router.get("/", async function (req, res, next) {
  // TDO add try / catch here
  res.render("mobile", {
    clientId: process.env.TS_CLIENT_ID,
    authSessionId: req.query.aid
  });
});

router.post("/authorize-session-user", async function (req, res, next) {
  // TDO add try / catch here
  console.log(JSON.stringify(req.body));
  const accessToken = await getClientCredentialsToken();
  await authorizeAuthnSession(
    accessToken,
    req.body.authSessionId,
    req.body.username
  );
  res.send({ status: "ok" });
});

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
