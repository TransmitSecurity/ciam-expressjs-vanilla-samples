async function sendEmailOtp(email, handleResponse) {
    const response = await fetch('/email-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

    const data = await response.json()
    console.log("Response from /email-otp", data)
    handleResponse(data);
}

async function verifyOtp(otpCode, handleResponse) {
    const response = await fetch('/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            otpCode: otpCode,
        }),
      });

    const data = await response.json()
    console.log("Response from /complete", data)
    handleResponse(data);
}