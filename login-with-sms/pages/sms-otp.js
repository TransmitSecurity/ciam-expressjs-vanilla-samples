async function sendSmsOtp(phone, handleResponse) {
  const response = await fetch('/sms-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: phone,
    }),
  })

  const status = response.status
  const data = await response.json()
  console.log('Response from /email-otp', { status, data })
  handleResponse({ status, data })
}

async function verifyOtp(phone, otpCode, handleResponse) {
  const response = await fetch('/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: phone,
      otpCode: otpCode,
    }),
  })

  const status = response.status
  const data = await response.json()
  console.log('Response from /verify', { status, data })
  handleResponse({ status, data })
}
