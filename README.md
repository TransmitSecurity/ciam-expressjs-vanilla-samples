# ciam-expressjs-vanilla-samples

## Structure of this repository

This repository contains sample web apps corresponding to the
[guides in the Transmit Security developer portal](https://developer.transmitsecurity.com/guides/guides_intro/).

Each directory contains a STANDALONE sample app that can be configured with your tenant data. This
means that each directory is completely independant of the other directories, can be configured
differently and launched separately. Of course if you are experimenting with multiple sample app,
you can copy the same `.env` file between directories. Right now you can only launch one sample at a
time, by moving between the directories and following the procedure below.

You can either launch sample apps directly from the browser using GitHub Codespaces, or clone and
run from your local machine. See below instructions for both flavors.

## Setting up Codespaces

You can connect the samples to your own
[Transmit Security tenant](https://portal.identity.security/) and launch them from a Codespace
environment

https://user-images.githubusercontent.com/75998795/220656434-1894d9de-e1ea-4e9a-b0b6-0a06a26fa901.mp4

<br>
The video describes the following steps:

### Start Codespaces

- (0:10) Launch code spaces via the `<> Code` button
- (0:25) For the specific sample you want to launch - go into the sample directory (e.g.
  `webauthn-cross-device`), create a `.env` file, and copy the content of `sample.env` into it.
- (0:34) Copy the URL of the code space - and add `-8080.preview.app` before the `github.dev`
  suffix - this is the base URL where the sample apps will launch, and is used for the configuration
  of callbacks and webauthn. For example

* `https://ts-ron-legendary-waddle-rx7774944x4cwwrv.github.dev` will become
  `https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev`.

### Set up the Transmit tenant

- (0:47) Go to your tenant pages on the [Transmit portal](https://portal.identity.security/), and
  create a new app
- The app should allow you to register new users - make sure the following radio button is checked:
  <img width="130" alt="image" src="https://user-images.githubusercontent.com/75998795/220659359-4892c0d2-8000-493b-8648-2e2e123e5464.png">

- (0:56) Use the base URL you copied with the suffix `/complete` in the redirect URI box. For
  example `https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev/complete`
- (1:02) Click "Add" to save, this also creates a client ID and a client secret

#### WebAuthn configuration

You can skip this section is you do not intend to use webauthn

- (1:04) **IF** the sample also includes WebAuthn - go to the authentication tab and configure the
  WebAuthn method for your newly created app, using the above base URL as origin, and the domain as
  the RPID.

### Complete Codespace configuration

- (1:16) Now, go back to the application page update your `.env` file:
  - `VITE_TS_CLIENT_ID` should contain your client id
  - `TS_CLIENT_SECRET` should contain your client secret
  - `TS_APP_ID` should contain you application ID
  - `TS_REDIRECT_URI` should contain the redirect URI you set in your tenant (the base URL with the
    suffix `/complete`)
- (1:35) Build the sample using `cd <sample dir>`, and `yarn`
- (1:46) Launch the sample using `yarn start`. The sample will launch on port 8080 and exposed via
  the above base URL (a button will appear on screen to open, or go to the "Ports" tab)

Don't forget to stop your code space when you are done! For more information on code spaces PLS
visit https://code.visualstudio.com/docs/remote/codespaces

## Running locally

To run the project locally, follow the same steps described in the Codespace set up, but for your
local environment.

You will need to use Node version v14.18.0+ or v16.0.0+.

Note that if you are using `npm`, you might need to use the `--force` option when installing the
modules:

```bash
npm install --force
npm run start
```

## Additional notes
### Debugging tabs on a mobile device

Some samples might require you to use web browsers on mobile devices. This is the case of the
WebAuthn cross device sample. To debug Chrome or Safari browsers running on a mobile device, you can
refer to the following documentations:

- [Remote debug Chrome on Android Devices](https://developer.chrome.com/docs/devtools/remote-debugging/)
- [Remote debug Safari on iOS Devices](https://webkit.org/web-inspector/enabling-web-inspector/)
  

### Using the non-default cluster

By default, the samples work with the US production cluster. However if you are working with a tenant that resides on a different cluster, e.g. EU or a staging cluster, consult your Transmit contact person and configure the following:

- `VITE_TS_IDM_API_BASE`
- `VITE_TS_WEBAUTHN_API_BASE`

---

<img src="https://user-images.githubusercontent.com/75998795/220656769-23c0ddda-cf03-4d45-94b9-9b32dd4b9750.gif" width="50" height="50"/>
Animated robot courtesy of https://opengameart.org/content/pixel-robot
