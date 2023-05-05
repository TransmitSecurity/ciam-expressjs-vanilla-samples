# MFA login flow

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/user/auth_mfa_guide/

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/ - redirects to an email input login page
- Enter your email and click the either the Send Email OTP button or the Send Magic Link button
- Go to your email and copy the code or click the Magic Link
- If you sent an OTP code, enter the code and click the Login button
- The browser will redirect to the completion endpoint, the completion endpoint will determine if
  MFA is required and redirect to the SMS OTP page
- Enter your phone number in the format shown and click the Send SMS OTP button
- Check your phone for the OTP code sent through SMS, enter the code and click the Login button
- The browser will redirect to the completion endpoint again, and show the OIDC auth code now that
  the MFA flow is complete
- It is recommended to open the browser debugger tools and look at the console logs which reflect
  flow and network. It is also strongly recommended to run this flow in a **new** Private or
  Incognito window **each** time
