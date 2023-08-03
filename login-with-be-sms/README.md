# Backend SMS OTP login flow

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/user/be_auth_sms_otp/

We also demonstrate how to validate the access token using the following guide:
https://developer.transmitsecurity.com/guides/user/validate_tokens/

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- - Open a browser tab on <domain:port>/ - redirects to a user signup page
- Enter your phone number and click Create User
  (https://developer.transmitsecurity.com/openapi/user/user/)
- The user will be created and you will be prompted to login
- Enter your phone number and click the button - the page changes to OTP input
- Check your phone for an SMS and copy the code
- Enter the code and click the button
- The browser will send authentication request to verify the code and authenticate the user
- The browser display the content of the access token
- It is recommended to open the browser debugger tools and look at the console logs which reflect
  flow and network
