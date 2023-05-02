function baseUrl() {
  return process.env.VITE_TS_API_BASE || 'https://api.transmitsecurity.io';
}

export const config = {
  apis: {
    auth: `${baseUrl()}/cis/oidc/auth`,
    token: `${baseUrl()}/oidc/token`,
    logout: `${baseUrl()}/cis/v1/auth/logout`,

    createUser: `${baseUrl()}/cis/v1/users`,
    getUser: userId => `${baseUrl()}/cis/v1/users/${userId}`,

    passwordLogin: `${baseUrl()}/cis/v1/auth/password/login`,

    sendOtpEmail: `${baseUrl()}/cis/v1/auth/otp/email`,
    validateOtpEmail: `${baseUrl()}/cis/v1/auth/otp/email/validation`,

    sendOtpSMS: `${baseUrl()}/cis/v1/auth/otp/sms`,
    validateOtpSMS: `${baseUrl()}/cis/v1/auth/otp/sms/validation`,

    webauthnAuthorize: `${baseUrl()}/cis/v1/auth-session/authorize`,
    webauthnStartWithAuthorization: `${baseUrl()}/cis/v1/auth-session/start-with-authorization`,

    hostedIDVSessionUrl: `${baseUrl()}/verify/api/v1/verification`,
    hostedIDVVerifyUrl: `${baseUrl()}/verify/app`,

    getRiskRecommendation: query => `${baseUrl()}/risk/v1/recommendation?${query}`,
  },
};
