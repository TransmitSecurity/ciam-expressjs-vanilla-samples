# Webauthn flow for Logged In users

This sample follows the following guide: **New SDK documentation will be added soon**

In this sample we are demonstrating Passkey registration and authentication (using autofill and
modal flows) for users managed internally.

For more information see **Documentation will be added soon**

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/
  - If you already registered a passkey you will be able to select it from the input box using
    autofill flow or, click the Validate Passkey button (with or without filling a username) to
    activate modal flow.
  - If you didn't, you'll first need to login using Email OTP, and register one from the home page
- Once registration completes you will be redirected to a login page
- Once authentication completes you will be redirected to a home page
- To logout click on the button in the top right corner

## Notes

- You can use the browser's password manager to delete passkeys associated with this page. For
  example in Chrome, the auto-fill list will contain a "Manage passwords and Passkeys" section.
