async function sendEmailOtp(email, handleResponse) {
  const response = await fetch('/send-email-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  });

  const status = response.status;
  const data = await response.json();
  console.log('Response from /send-email-otp', { status, data });
  handleResponse({ status, data });
}

async function authenticateOtp(email, otpCode, handleResponse) {
  const response = await fetch('/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      otpCode: otpCode,
    }),
  });

  const status = response.status;
  const data = await response.json();
  console.log('Response from /authenticate', { status, data });
  handleResponse({ status, data });
}
