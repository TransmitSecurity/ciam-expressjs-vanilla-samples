# ciam-expressjs-vanilla-samples
Sample web apps for the CIAM platform

## Setting up Code Spaces
Your can connect the samples to your own Transmit Security tenant and launch them LIKE A BOSS <img src="https://user-images.githubusercontent.com/75998795/219098021-6afe792d-bd01-4c08-8ac8-403f5f57e520.gif"  width="70" height="70">




https://user-images.githubusercontent.com/75998795/219948975-214ab1d6-580b-4229-b12d-42ff6b3759fd.mp4





The video describes the following steps:

1. (0:10) Launch code spaces via the `<> Code` button
1. (0:26) For the specific demo you want to launch - go into the demo directory (e.g.
   `webauthn-cross-device`), create a `.env` file, and copy the content of
`sample.env` into it.
1. (0:46) Copy the URL of the code space - and add `-8080.preview.app` before the
   `github.dev` suffix - this is the base URL where the demo apps will
launch, and is used for the configuration of
callbacks and webauthn. For example
- `https://ts-ron-legendary-waddle-rx7774944x4cwwrv.github.dev` will become
  `https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev`.
1. (1:12) Go to your tenant pages on the Transmit portal, and create a new app
1. (1:30) Use the base URL you copied with the suffix `/callback` in the redirect URI
   box. For example
`https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev/callback`
1. (1:42) Click "Add" to save, this also creates a client ID and a client secret
1. (1:48) If the demo also includes WebAuthn - go to the authentication tab and configure the WebAuthn method for your
   newly created app, using the above base URL as origin, and the domain as the
RPID.
1. (2:09) Now, go back to the application page and copy the value of application ID, client ID and client secret into the created `.env` file
1. (2:48) Build the demo using `cd <demo dir>`, and `yarn`
1. (3:10) Launch the demo using `yarn start`. The demo will launch on port 8080 and
   exposed via the above base URL (a button will appear on screen to open, or go
to the "Ports" tab)


For more information on code spaces PLS visit https://code.visualstudio.com/docs/remote/codespaces
