function baseUrl(useApiGateway) {
  if (process.env.VITE_TS_API_BASE) {
    if (process.env.VITE_TS_API_BASE === 'http://localhost') {
      // On local dev environment don't need the API gateway prefix
      return process.env.VITE_TS_API_BASE;
    }
  }

  const pathPrefix = useApiGateway ? '/cis' : '';

  return (process.env.VITE_TS_API_BASE || 'https://api.transmitsecurity.io') + pathPrefix;
}

export const config = {
  apis: {
    token: `${baseUrl()}/oidc/token`,
    logout: `${baseUrl(true)}/v1/auth/logout`,

    createUser: `${baseUrl(true)}/v1/users`,
    getUser: userId => `${baseUrl(true)}/v1/users/${userId}`,

    passwordLogin: `${baseUrl(true)}/v1/auth/password/login`,

    sendOtpEmail: `${baseUrl(true)}/v1/auth/otp/email`,
    validateOtpEmail: `${baseUrl(true)}/v1/auth/otp/email/validation`,

    sendOtpSMS: `${baseUrl(true)}/v1/auth/otp/sms`,
    validateOtpSMS: `${baseUrl(true)}/v1/auth/otp/sms/validation`,

    webauthnAuthorize: `${baseUrl(true)}/v1/auth-session/authorize`,
    webauthnStartWithAuthorization: `${baseUrl(true)}/v1/auth-session/start-with-authorization`,

    hostedIDVSessionUrl: `${baseUrl()}/verify/api/v1/verification`,
    hostedIDVVerifyUrl: `${baseUrl()}/verify/app`,

    getRiskRecommendation: query => `${baseUrl()}/risk/v1/recommendation?${query}`,
  },
};
