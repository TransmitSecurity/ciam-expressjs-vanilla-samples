# ciam-expressjs-vanilla-samples

## Structure of this repository

This repository contains sample web apps corresponding to the
[guides in the Transmit Security developer portal](https://developer.transmitsecurity.com/guides/guides_intro/).

Each directory contains a STANDALONE sample app that can be configured with your tenant data. 
All samples are independant from the other samples, except from minimal shared code under the `shared` directory.
All samples are configured to use you tenant via a `.env` file that you need to create at the root of the project as seen below.

You can either launch sample apps directly from the browser using GitHub Codespaces, or clone and
run from your local machine. See below instructions for both flavors.

## Setting up Codespaces

You can connect the samples to your own
[Transmit Security tenant](https://portal.identity.security/) and launch them from a Codespace
environment


https://user-images.githubusercontent.com/75998795/222964490-cf46e7cd-f2d4-4446-8787-1425629cca3a.mp4


<br>
The video describes the following steps:

### Start Codespaces

- (0:10) Launch code spaces via the `<> Code` button
- (0:22) Create a `.env` file at the root of the project, and copy the content of `sample.env` into it.
- (0:29) Copy the URL of the code space - and paste it into the `.env` file as the value for `TS_REDIRECT_RI`. Add `/complete` at the end, and add `-8080.preview.app` before the `github.dev` suffix - this is the base URL where the sample apps will launch, and is used for the configuration
  of callbacks and webauthn. For example

  - `https://ts-ron-legendary-waddle-rx7774944x4cwwrv.github.dev` will be edited to
  `https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev/complete`.

### Set up the Transmit tenant

- (0:47) Go to your tenant pages on the [Transmit portal](https://portal.identity.security/), and
  create a new app
- The app should allow you to register new users - make sure the following radio button is checked:
  <img width="130" alt="image" src="https://user-images.githubusercontent.com/75998795/220659359-4892c0d2-8000-493b-8648-2e2e123e5464.png">

- (0:56) Use the redirect URL you copied into the redirect URI box.
- (1:02) Click "Add" to save, this also creates a client ID and a client secret

#### WebAuthn configuration

You can skip this section is you do not intend to use webauthn

- (1:04) **IF** the sample also includes WebAuthn - go to the authentication tab and configure the
  WebAuthn method for your newly created app, using the above redirect URL as origin (remove the `/complete` suffix), and the domain as
  the RPID.

### Complete Codespace configuration

- (1:16) Now, go back to the application page update your `.env` file:
  - `VITE_TS_CLIENT_ID` should contain your client id
  - `TS_CLIENT_SECRET` should contain your client secret
  - `TS_APP_ID` should contain you application ID
  - `TS_REDIRECT_URI` should contain the redirect URI you set in your tenant (the base URL with the
    suffix `/complete`)
- (1:35) Build the sample from the root directory `yarn`
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
