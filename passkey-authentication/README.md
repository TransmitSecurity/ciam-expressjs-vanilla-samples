# Passkey login flow

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/

In this sample we are demonstrating Passkey registration for users managed externally.  
For more information see
[Implement login with WebAuthn API](https://developer.transmitsecurity.com/guides/webauthn/basic_login_scenarios/)

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/
  - If you already registered a passkey you will be able to select it from the input box
  - If you didn't you will be redirected to the registration page
- Once registration / authentication completes you will be redirected to a home page
- To logout click on the button in the top right corner

## Notes

- You can use the browser's password manager to delete passkeys associated with this page. For
  example in Chrome, the auto-fill list will contain a "Manage passwords and Passkeys" section.
