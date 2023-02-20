# ciam-expressjs-vanilla-samples
Sample web apps for the CIAM platform

## Setting up Codespaces
Your can connect the samples to your own Transmit Security tenant and launch them from a Codespace environment

https://user-images.githubusercontent.com/75998795/220123483-877fa604-7edb-4dd3-878b-b687778a8997.mp4

The video describes the following steps:

1. (0:10) Launch code spaces via the `<> Code` button
1. Choose the Codespaces tab (not Local). This should open a new Codespaces tab in your browser, 
with the  `ciam-expressjs-vanilla-samples` repository
1. (0:25) For the specific demo you want to launch - go into the demo directory (e.g.
   `webauthn-cross-device`), create a `.env` file, and copy the content of
`sample.env` into it.
1. (0:34) Copy the URL of the code space - and add `-8080.preview.app` before the
   `.github.dev` suffix - this is the base URL where the demo apps will
launch, and is used for the configuration of callbacks and webauthn. 
For example `https://ts-ron-legendary-waddle-rx7774944x4cwwrv.github.dev` will become
  `https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev`.

## Setting up your application

1. (0:47) Go to your tenant pages on the Transmit portal, and create a new app
1. (0:56) Use the base URL you copied with the suffix `/complete` in the redirect URI
   box. For example
`https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev/complete`
1. (1:02) Click "Add" to save, this also creates a client ID and a client secret 
1. Copy the values of application ID, client ID and client secret into the created `.env` file


## Run the demo

1. Go to the directory of the requested demo. For example `webauthn-cross-device`
1. Follow to Readme.md of the demo you chose
2. Good Luck!

For more information on code spaces PLS visit https://code.visualstudio.com/docs/remote/codespaces
