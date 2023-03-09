function idmApiBaseUrl() {
  return process.env.VITE_TS_IDM_API_BASE || 'https://api.userid.security'
}

function webauthnApiBaseUrl() {
  return process.env.VITE_TS_WEBAUTHN_API_BASE || 'https://webauthn.identity.security'
}

export const config = {
  apis: {
    token: `${idmApiBaseUrl()}/oidc/token`,
    logout: `${idmApiBaseUrl()}/v1/auth/logout`,

    passwordLogin: `${idmApiBaseUrl()}/v1/auth/password/login`,
    passwordRegister: `${idmApiBaseUrl()}/v1/auth/password/register`,
    passwordResetValidate: `${idmApiBaseUrl()}/v1/auth/password/reset/password/validate`,
    passwordReset: `${idmApiBaseUrl()}/v1/auth/password/reset`,

    sendOtpEmail: `${idmApiBaseUrl()}/v1/auth/otp/email`,
    validateOtpEmail: `${idmApiBaseUrl()}/v1/auth/otp/email/validation`,

    sendOtpSMS: `${idmApiBaseUrl()}/v1/auth/otp/sms`,
    validateOtpSMS: `${idmApiBaseUrl()}/v1/auth/otp/sms/validation`,

    webauthnAuthorize: `${webauthnApiBaseUrl()}/v1/auth-session/authorize`,
    webauthnStartWithAuthorization: `${webauthnApiBaseUrl()}/v1/auth-session/start-with-authorization`,
  },
}
