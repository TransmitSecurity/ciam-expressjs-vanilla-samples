
function idmApiBaseUrl() {
    return process.env.VITE_TS_IDM_API_BASE || 'https://api.userid.security';
}

export const config = {
    apis: {
        token: `${idmApiBaseUrl()}/oidc/token`,
        sendOtpEmail: `${idmApiBaseUrl()}/v1/auth/otp/email`,
        validateOtpEmail: `${idmApiBaseUrl()}/v1/auth/otp/email/validation`
    }
};