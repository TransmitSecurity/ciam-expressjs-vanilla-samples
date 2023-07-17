# Google login flow

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/user/auth_google/

We also demonstrate how to validate the access token using the following guide:
https://developer.transmitsecurity.com/guides/user/validate_tokens/

## Set up

- Follow the guide to set up your Google Console here
  https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
- Make sure you create in your Google Console a web application, OAuth 2.0 Client IDs credentials
  and a consent screen
- Set your redirect URI to be https://api.transmitsecurity.io/cis/auth/google/callback in you google
  web application
- Set up your Transmit application to support google authentication
  https://developer.transmitsecurity.com/guides/user/auth_google/#step-3-enable-google-for-app
- Add your local server URI to the transmit application's redirect URIs

> Note:
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
