# ciam-expressjs-vanilla-samples
Sample web apps for the CIAM platform

## Setting up Codespaces
Your can connect the samples to your own Transmit Security tenant and launch them from a Codespace environment



https://user-images.githubusercontent.com/75998795/219964174-ef21f757-9ac7-48b2-a73c-c6516c7389cf.mp4



The video describes the following steps:

1. (0:10) Launch code spaces via the `<> Code` button
1. (0:25) For the specific demo you want to launch - go into the demo directory (e.g.
   `webauthn-cross-device`), create a `.env` file, and copy the content of
`sample.env` into it.
1. (0:34) Copy the URL of the code space - and add `-8080.preview.app` before the
   `github.dev` suffix - this is the base URL where the demo apps will
launch, and is used for the configuration of
callbacks and webauthn. For example
- `https://ts-ron-legendary-waddle-rx7774944x4cwwrv.github.dev` will become
  `https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev`.
1. (0:47) Go to your tenant pages on the Transmit portal, and create a new app
1. (0:56) Use the base URL you copied with the suffix `/complete` in the redirect URI
   box. For example
`https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev/callback`
1. (1:02) Click "Add" to save, this also creates a client ID and a client secret
1. (1:04) If the demo also includes WebAuthn - go to the authentication tab and configure the WebAuthn method for your
   newly created app, using the above base URL as origin, and the domain as the
RPID.
1. (1:16) Now, go back to the application page and copy the value of application ID, client ID and client secret into the created `.env` file
1. (1:35) Build the demo using `cd <demo dir>`, and `yarn`
1. (1:46) Launch the demo using `yarn start`. The demo will launch on port 8080 and
   exposed via the above base URL (a button will appear on screen to open, or go
to the "Ports" tab)


For more information on code spaces PLS visit https://code.visualstudio.com/docs/remote/codespaces
