# Webauthn flow for logged-out users - hosted experience

Users that are authenticated with a non Transmit IDP before registering credentials.

This sample follows the following guide: **TODO: add link to guide**

In this sample we are demonstrating Passkey registration, authentication and transaction signing
flows, for users managed externally, using the hosted experience. For more information see **TODO:
add link to guide**

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open TIP portal
  - Experience Management
    - Under Authentication tab, click on Experience Management
    - Select you app in the dropdown and the top of the page
    - Change User identification to "Username" and Primary authentication method to "Passkey"
    - Disable all the other secondary authentication methods
    - Click on "Save"
  - Configure Redirect URI
    - Click on Applications tab and select your app
    - Under "Redirect URIs" add <domain:port>/pages/complete.html
- Open a browser tab on <domain:port>/
  - You will be redirected to the login page
  - Enter the username you used to register and click on "Continue with passkey"
  - You'll be redirected to the hosted passkey authentication page
  - complete the authentication flow, and you'll be redirected back to a home page with the ID
    token.
- Registration
  - Browse to the Registration page by clicking the "here" link below the login button
  - Enter a username and click on "Enroll Passkey"
  - You'll be redirected to the hosted passkey registration page
  - complete the registration flow, and you'll be redirected back to the registration page with
    registration data
- Transaction Signing
  - From the login page, Browse to the Transaction page by clicking the "here" link below the login
    button
  - Fill the transaction details, money transfer or custom, and click on "Continue to transaction
    page"
  - You'll be redirected to the hosted confirm transaction page
  - Click confirm, select the passkey you want to sign with, and complete the transaction flow
  - You'll be redirected back to a complete page with ID Token containing the "approval_data"
    details.

## Notes

- You can use the browser's password manager to delete passkeys associated with this page. For
  example in Chrome, the autofill list will contain a "Manage passwords and Passkeys" section.
