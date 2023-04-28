function idmApiBaseUrl() {
  return process.env.VITE_TS_IDM_API_BASE || 'https://api.transmitsecurity.io/cis';
}

function webauthnApiBaseUrl() {
  return process.env.VITE_TS_WEBAUTHN_API_BASE || 'https://webauthn.identity.security';
}

function serviceProviderId() {
  return process.env.TS_SERVICE_PROVIDER_ID || '';
}

export const config = {
  apis: {
    token: `${idmApiBaseUrl()}/oidc/token`,
    logout: `${idmApiBaseUrl()}/v1/auth/logout`,

    createUser: `${idmApiBaseUrl()}/v1/users`,
    getUser: userId => `${idmApiBaseUrl()}/v1/users/${userId}`,

    passwordLogin: `${idmApiBaseUrl()}/v1/auth/password/login`,

    sendOtpEmail: `${idmApiBaseUrl()}/v1/auth/otp/email`,
    validateOtpEmail: `${idmApiBaseUrl()}/v1/auth/otp/email/validation`,

    sendOtpSMS: `${idmApiBaseUrl()}/v1/auth/otp/sms`,
    validateOtpSMS: `${idmApiBaseUrl()}/v1/auth/otp/sms/validation`,

    webauthnAuthorize: `${webauthnApiBaseUrl()}/v1/auth-session/authorize`,
    webauthnStartWithAuthorization: `${webauthnApiBaseUrl()}/v1/auth-session/start-with-authorization`,

    samlIdpUrl: `${idmApiBaseUrl()}/v1/serviceprovider/saml2/sso/${serviceProviderId()}`,
  },
};
