# Google login flow

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/user/auth_google/

We also demonstrate how to validate the access token using the following guide:
https://developer.transmitsecurity.com/guides/user/validate_tokens/

Set up this example using the instruction in the [main README file](../README.md)

> **Note**
>
> This sample code will NOT work from GitHub Codespaces, only from local environment

## Sample user experience

- Open a browser tab on <domain:port>/ - redirects to the demo's start Google login page
- Click the login button - the page redirects to Google login
- Finish your authentication with Google
- The browser will redirect to the completion endpoint, and show the OIDC auth code
- Click on `Exchange and validate` button
- The browser display the content of the access token
- It is recommended to open the browser debugger tools and look at the console logs which reflect
  flow and network
