function baseUrl() {
  return process.env.VITE_TS_API_BASE || 'https://api.transmitsecurity.io';
}

function serviceProviderId() {
  return process.env.TS_SERVICE_PROVIDER_ID || '';
}

export const config = {
  apis: {
    auth: `${baseUrl()}/cis/oidc/auth`,
    authRequest: `${baseUrl()}/cis/oidc/request`,
    token: `${baseUrl()}/oidc/token`,
    jwks: `${baseUrl()}/cis/oidc/jwks`,
    logout: `${baseUrl()}/cis/v1/auth/logout`,
    backendLogout: `${baseUrl()}/cis/v1/auth/session/logout`,
    sessionAuthenticate: `${baseUrl()}/cis/v1/auth/session/authenticate`,
    backendRefreshToken: `${baseUrl()}/cis/v1/auth/token/refresh`,

    backendSessionAuthentication: `${baseUrl()}/cis/v1/auth/session/authenticate`,

    createUser: `${baseUrl()}/cis/v1/users`,
    getUser: userId => `${baseUrl()}/cis/v1/users/${userId}`,
    getUserByUsername: userName => `${baseUrl()}/cis/v1/users/username/${userName}`,

    passwordLogin: `${baseUrl()}/cis/v1/auth/password/login`,
    passwordBackendAuthentication: `${baseUrl()}/cis/v1/auth/password/authenticate`,

    sendOtpEmail: `${baseUrl()}/cis/v1/auth/otp/email`,
    validateOtpEmail: `${baseUrl()}/cis/v1/auth/otp/email/validation`,

    sendBackendOtp: `${baseUrl()}/cis/v1/auth/otp/send`,
    authenticateBackendOtp: `${baseUrl()}/cis/v1/auth/otp/authenticate`,

    sendOtpSMS: `${baseUrl()}/cis/v1/auth/otp/sms`,
    validateOtpSMS: `${baseUrl()}/cis/v1/auth/otp/sms/validation`,

    sendMagicLink: `${baseUrl()}/cis/v1/auth/links/email`,

    sendBackendMagicLink: `${baseUrl()}/cis/v1/auth/link/email/send`,
    authenticateBackendMagicLink: `${baseUrl()}/cis/v1/auth/link/email/authenticate`,

    googleLogin: `${baseUrl()}/cis/v1/auth/google`,

    webauthnAuthorize: `${baseUrl()}/cis/v1/auth-session/authorize`,
    webauthnStartWithAuthorization: `${baseUrl()}/cis/v1/auth-session/start-with-authorization`,
    webauthnToken: `${baseUrl()}/cis/v1/auth/webauthn/authenticate`,
    webauthnRegister: `${baseUrl()}/cis/v1/auth/webauthn/register`,
    webauthnRegisterExternal: `${baseUrl()}/cis/v1/auth/webauthn/external/register`,
    webauthnRegisterExternalHint: `${baseUrl()}/cis/v1/auth/webauthn/external/register/hosted/hint`,

    webauthnCrossDeviceRegisterExternalInit: `${baseUrl()}/cis/v1/auth/webauthn/cross-device/external/register/init`,
    webauthnCrossDeviceRegisterInit: `${baseUrl()}/cis/v1/auth/webauthn/cross-device/register/init`,
    webauthnCrossDeviceRegister: `${baseUrl()}/cis/v1/auth/webauthn/cross-device/register`,

    hostedIDVSessionUrl: `${baseUrl()}/verify/api/v1/verification`,
    hostedIDVVerifyUrl: `${baseUrl()}/verify/app`,
    hostedPasskeyRegistrationUrl: registerWebauthnCredToken =>
      `${baseUrl()}/cis/hosted/passkey/passkey-registration?register_webauthn_cred_token=${registerWebauthnCredToken}`,
    hostedPasskeyAuthenticationUrl: (username, redirectUri, clientId) =>
      `${baseUrl()}/cis/oidc/auth?response_type=code&client_id=${clientId}&login_hint=${encodeURIComponent(
        username,
      )}&redirect_uri=${redirectUri}&scope=openid+email`,
    hostedPasskeyTransactionUrl: (requestUri, clientId) =>
      `${baseUrl()}/cis/oidc/auth?request_uri=${requestUri}&client_id=${clientId}&scope=openid+email`,

    getRiskRecommendation: query => `${baseUrl()}/risk/v1/recommendation?${query}`,

    samlIdpUrl: `${baseUrl()}/cis/v1/serviceprovider/saml2/sso/${serviceProviderId()}`,
  },
};
