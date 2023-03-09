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

  const status = response.status;
  const data = await response.json();
  console.log('Response from /email-otp', { status, data });
  handleResponse({ status, data });
}

async function verifyOtp(email, otpCode, handleResponse) {
  const response = await fetch('/verify', {
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
  console.log('Response from /verify', { status, data });
  handleResponse({ status, data });
}
