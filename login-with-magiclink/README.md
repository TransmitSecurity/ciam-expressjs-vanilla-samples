# Magic Link login flow

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/user/auth_email_magic_link/

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/ - redirects to an email input login page
- Enter your email and click the Send Magic Link button
- Go to your email and click the Magic Link
- The browser will redirect to the completion page, and show the OIDC auth code now that the flow is
  complete or show any errors
- It is recommended to open the browser debugger tools and look at the console logs which reflect
  flow and network.
