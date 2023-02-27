import express from "express";
import { utils } from "./utils.js";
import fetch from "node-fetch";

const router = express.Router();

// The following endpoint is used by views/mobile.ejs during a registration flow
// It uses an API to elevate a cross device session to allow credential registration
// For more information see https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/#step-3-register-credentials
router.post("/start-authorized-session", async function (req, res) {
  // TODO add error handling, omitted for sample clarity
  const accessToken = await utils.getClientCredentialsToken();
  const sessionRes = await startAuthorizedAuthnSession(
    accessToken,
    req.body.username
  );
  const sessionJson = await sessionRes.json();

  res.send({ auth_session_id: sessionJson.auth_session_id });
});

router.post("/exchange-code", async function (req, res) {
  const code = req.body.code;
  const accessToken = await utils.exchangeCode(code);

  res.send({ access_token: accessToken });
});

// This function wraps and API call for elevating the auth-session and allows using it for registration.
// The input access token in this sample app is a client credentials token, however could also use access tokens
// that are obtained via user authentication, e.g. password login or email OTP.
// For more information see https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/#step-3-register-credentials
async function startAuthorizedAuthnSession(accessToken, username) {
  const url =
    "https://webauthn.identity.security/v1/auth-session/start-with-authorization";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      client_id: process.env.VITE_TS_CLIENT_ID,
      username: username,
    }),
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

export const passkeyRouter = router;
