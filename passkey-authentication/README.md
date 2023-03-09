# Passkey login flow

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/

In order to register the passkey the user needs an access token gained from a previous login For
that we use email OTP in this sample.

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/
  - If you registered a passkey you will be able to select it from the input box
  - If you didn't you will be redirected to the email OTP page for authentication
- Once authentication completes you will be redirected to a home page
  - If you didn't register a passkey yet, click on the `Register passkey`
- To logout click on the button at the top right corner
