# Backend offline authentication using magic link

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/user/be_auth_email_magic_link/ to authenticate, and
then use the backend session APIs to get access token
https://developer.transmitsecurity.com/openapi/user/backend-sessions/

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/ - redirects to a user signup page
- Enter your email and click Create User (https://developer.transmitsecurity.com/openapi/user/user/)
- The user will be created and you will be prompted to login
- Enter your email and click the Send Magic Link button
- Go to your email and click the Magic Link
- The browser will redirect to the completion page, and then authenticates the code from the magic
  link.
- The browser display the content of the id token, and the IDP session id.
- Click on the "Refresh token" button to perform a backend refresh token call
  (https://developer.transmitsecurity.com/openapi/user/backend-sessions/#operation/refreshBackendAuthToken)
- Click on the "Session authentication" button to perform a backend session authentication call
  (https://developer.transmitsecurity.com/openapi/user/backend-sessions/#operation/authenticateSession)
- It is recommended to open the browser debugger tools and look at the console logs which reflect
  flow and network
- Refreshing the completion page will show error, as the magic link can be used only once.
