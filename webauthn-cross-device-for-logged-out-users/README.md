# Webauthn Cross Device Flow for Logged out users

Users that are authenticated with a non Transmit IDP before registering credentials.

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/

In this sample we are demonstrating Passkey registration and authentication, using another
device,for users managed externally. For more information see
[Cross device flows guide](https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/)
[API Webauthn](https://developer.transmitsecurity.com/openapi/user/backend-webauthn/)
[SDK WebauthnCrossDeviceFlows](https://developer.transmitsecurity.com/sdk-ref/platform/interfaces/webauthncrossdeviceflows/)

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/
  - If you already registered a passkey on your remove device, you will be able to scan the QR code
    and authenticate using the passkey, or click on the QR code to authenticate using you passkey in
    your browser.
  - If you didn't, you will be able to register one by scanning the QR code on your mobile device,
    or by clicking on the QR code to register one in your browser.
- Once registration completes, you'll get a success message.

## Notes

- You can use the browser's password manager to delete passkeys associated with this page. For
  example in Chrome, the autofill list will contain a "Manage passwords and Passkeys" section.

**IMPORTANT**: Currently Webauthn works with a single redirect URI. When testing - make sure your
app definition includes only one redirect URI.

**TIP**: When running from your local machine, use the following values for your `.env` and portal
setup:

- Redirect URI: `http://localhost:8080/complete`
- RPID: `localhost`
- Origin: `http://localhost:8080`
