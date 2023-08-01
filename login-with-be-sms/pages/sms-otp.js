async function sendSMSOtp(phone, handleResponse) {
  const response = await fetch('/send-sms-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: phone,
    }),
  });

  const status = response.status;
  const data = await response.json();
  console.log('Response from /send-sms-otp', { status, data });
  handleResponse({ status, data });
}

async function authenticateOtp(phone, otpCode, handleResponse) {
  const response = await fetch('/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: phone,
      otpCode: otpCode,
    }),
  });

  const status = response.status;
  const data = await response.json();
  console.log('Response from /authenticate', { status, data });
  handleResponse({ status, data });
}
