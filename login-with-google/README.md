# Email OTP login flow

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/user/auth_email_otp/

We also demonstrate how to validate the access token using the following guide:
https://developer.transmitsecurity.com/guides/user/validate_tokens/

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/ - redirects to an email input login page
- Enter your email and click the button - the page changes to OTP input
- Go to your email and copy the code
- Enter the code and click the button
- The browser will redirect to the completion endpoint, and show the OIDC auth code
- Click on `Exchange and validate` button
- The browser display the content of the access token
- It is recommended to open the browser debugger tools and look at the console logs which reflect
  flow and network
