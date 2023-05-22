# Webauthn Cross Device Flow

This sample follows the following guide:
https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/

## Setup

Set up this example using the instruction in the [main README file](../README.md)

Make sure you follow the setup instructions for the Webauthn API.

**IMPORTANT**: Currently Webauthn works with a single redirect URI. When testing - make sure your
app definition includes only one redirect URI.

**TIP**: When running from your local machine, use the following values for your `.env` and portal
setup:

- Redirect URI: `http://localhost:8080/complete`
- RPID: `localhost`
- Origin: `http://localhost:8080`

## Sample user experience

- Open a browser tab on <domain:port>/ - this redirects to a page that starts the cross device login
  flow
- Click the button - the page displays a QR code and a URL.
- You now have two options:
  - Scan the QR using your mobile phone if you are running the sample from Code-spaces or any other
    hosted location that enable mobile device access to the URL.
  - If you are running locally, copy the URL and paste in a separate browser, or in an incognito
    tab. This avoids local state mixup between the originating page and the simulated mobile page.
- Once the mobile page is loaded, the originating page with the QR will hide the button (you can
  refresh/reload to start again)
- On the mobile page, either register a new user or authenticate
- Once completed - the originating page will show the updated status and user name
- It is recommended to look at the backend and browser log while executing the sample
