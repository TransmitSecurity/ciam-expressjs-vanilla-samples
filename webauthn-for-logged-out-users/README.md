# Webauthn flow for logged out users

Users that are authenticated with a non Transmit IDP before registering credentials.

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk

In this sample we are demonstrating Passkey registration and authentication (using autofill and
modal flows ) for users managed externally. For more information see
[Implement login with WebAuthn API](https://developer.transmitsecurity.com/guides/webauthn/basic_login_scenarios/)

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/
  - If you already registered a passkey you will be able to select it from the input box using
    autofill flow or, click the Validate Passkey button (with or without filling a username) to
    activate modal flow.
  - If you didn't, you will be able to register one by clicking the Register link to redirect to the
    registration page
- Once registration completes, you will be redirected to the passkey verification page
- Once verification completes you will get a success message

## Notes

- You can use the browser's password manager to delete passkeys associated with this page. For
  example in Chrome, the autofill list will contain a "Manage passwords and Passkeys" section.
