function baseUrl() {
  return process.env.VITE_TS_API_BASE || 'https://api.transmitsecurity.io';
}

function serviceProviderId() {
  return process.env.TS_SERVICE_PROVIDER_ID || '';
}

export const config = {
  apis: {
    auth: `${baseUrl()}/cis/oidc/auth`,
    token: `${baseUrl()}/oidc/token`,
    jwks: `${baseUrl()}/cis/oidc/jwks`,
    logout: `${baseUrl()}/cis/v1/auth/logout`,

    createUser: `${baseUrl()}/cis/v1/users`,
    getUser: userId => `${baseUrl()}/cis/v1/users/${userId}`,
    getUserByUsername: userName => `${baseUrl()}/cis/v1/users/username/${userName}`,

    passwordLogin: `${baseUrl()}/cis/v1/auth/password/login`,

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

    hostedIDVSessionUrl: `${baseUrl()}/verify/api/v1/verification`,
    hostedIDVVerifyUrl: `${baseUrl()}/verify/app`,

    getRiskRecommendation: query => `${baseUrl()}/risk/v1/recommendation?${query}`,

    samlIdpUrl: `${baseUrl()}/cis/v1/serviceprovider/saml2/sso/${serviceProviderId()}`,
  },
};
