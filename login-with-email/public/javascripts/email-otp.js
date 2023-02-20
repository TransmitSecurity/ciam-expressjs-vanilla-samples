
async function sendEmailOtp(email, handleResponse) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/email-otp");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({email}));
    
    xhr.onload = function () {
        const emailOtpResponse = JSON.parse(xhr.responseText);
        handleResponse(emailOtpResponse)
    };
}
