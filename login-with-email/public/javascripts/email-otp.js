async function sendEmailOtp(email, handleResponse) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/email-otp');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({email}));

    xhr.onload = function () {
        const emailOtpResponse = JSON.parse(xhr.responseText);
        handleResponse(emailOtpResponse)
    };
}

async function verifyOtp(otpCode, handleResponse) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/verify');
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log('The OTP validation request', otpCode);
    console.log('The OTP validation request', JSON.stringify({otpCode}));

    xhr.send(JSON.stringify({otpCode}));

    xhr.onload = function () {
        const validateOtpResponse = JSON.parse(xhr.responseText);
        console.log('The OTP validation response', xhr.responseText);
        handleResponse(validateOtpResponse)
    };
}