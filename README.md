# ciam-expressjs-vanilla-samples
Sample web apps for the CIAM platform

## Setting up Code Spaces
Your can connect the samples to your own Transmit Security tenant and launch them LIKE A BOSS <img src="https://user-images.githubusercontent.com/75998795/219098021-6afe792d-bd01-4c08-8ac8-403f5f57e520.gif"  width="70" height="70">




https://user-images.githubusercontent.com/75998795/219295314-e3b59666-569a-45bb-990e-b06695e1a587.mov

The video describes the following steps:

1. Launch code spaces via the `<> Code` button
1. For the specific demo you want to launch - go into the demo directory (e.g.
   `webauthn-cross-device`), create a `.env` file, and copy the content of
`sample.env` into it.
1. Copy the URL of the code space - and add `-8080.preview.app` before the
   `github.dev` suffix - this is the base URL where the demo apps will
launch, and is used for the configuration of
callbacks and webauthn. For example
- `https://ts-ron-legendary-waddle-rx7774944x4cwwrv.github.dev` will become
  `https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev`.
1. Go to your tenant pages on the Transmit portal
1. Create a new app
1. Use the base URL you copied with the suffix `/callback` in the redirect URI
   box. For example
`https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev/callback`
1. After clicking save you will see a client ID and a client secret were created
1. Go back to your CodeSpace
1. Copy the value of client ID and client secret into the created `.env` file
1. If the demo also includes WebAuthn - go back to the Transmit portal and configure the WebAuthn method for your
   newly created app, using the above base URL as origin, and the domain as the
RPID.
1. Build the demo using `cd <demo dir>`, and `yarn`
1. Launch the demo using `yarn start`. The demo will launch on port 8080 and
   exposed via the above base URL (a button will appear on screen to open, or go
to the "Ports" tab)


For more information on code spaces PLS visit https://code.visualstudio.com/docs/remote/codespaces
