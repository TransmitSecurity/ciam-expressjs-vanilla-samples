# Transmit Security Platform Samples (web, vanilla JS)

## Structure of this repository

This repository contains sample web apps corresponding to the
[guides in the Transmit Security developer portal](https://developer.transmitsecurity.com/guides/guides_intro/).

Each directory contains a STANDALONE sample app that can be configured with your tenant data. All
samples are independant from the other samples, except from minimal shared code under the `shared`
directory. All samples are configured to use your Transmit tenant via a `.env` file that you need to
create at the root of the project as seen below.

You can either launch sample apps directly from the browser using GitHub Codespaces, or clone and
run from your local machine. See below instructions for both flavors.

## Setting and running from Codespaces

You can connect the samples to your own
[Transmit Security tenant](https://portal.identity.security/) and launch them from a Codespace
environment

https://user-images.githubusercontent.com/75998795/222964490-cf46e7cd-f2d4-4446-8787-1425629cca3a.mp4

<br>
The video describes the following steps:

### Start Codespaces

- (0:10) Launch code spaces via the `<> Code` button. If you do not see this button, click
  [this link](https://github.com/TransmitSecurity/ciam-expressjs-vanilla-samples) to get back to the
  repo root.
- (0:22) Create a `.env` file at the root of the project, and copy the content of `sample.env` into
  it. Adding a file is done by clicking the +file icon at the top if the left hand file explorer, as
  the video shows.
- (0:29) Copy the URL of the codespace - and paste it into the new `.env` file as the value for
  `TS_REDIRECT_URI`. Add `/complete` at the end (make sure you only have a single slash here
  `/complete`), and add `-8080.app` before the `github.dev` suffix. For example:

  `https://ts-ron-legendary-waddle-rx7774944x4cwwrv.github.dev` will be edited to
  `https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.app.github.dev/complete`.

- Copy the above value to be used in the next steps

### Set up the Transmit tenant

- (0:47) Go to your tenant pages on the [Transmit portal](https://portal.identity.security/), and
  create a new app
  - (0:58) The app should allow you to register new users - make sure the "Public sign-up" is set to
    "Allow registration".
- (1:04) Use the redirect URI you copied into the redirect URI box.
- (1:08) Click "Add" to save, this also creates a client ID and a client secret
- (1:10) Go to the authentication tab and configure the WebAuthn method for your newly created app,
  using the above redirect URI as the origin (remove the `/complete` suffix), and the domain as the
  RPID.

### Complete Codespace configuration

- (1:26) Now, go back to the application page update your `.env` file:
  - `VITE_TS_CLIENT_ID` should contain your Client ID
  - `TS_CLIENT_SECRET` should contain your Client secret
  - `TS_APP_ID` should contain you Application ID
  - `TS_REDIRECT_URI` should already be configures as seen above
- (1:52) Build the sample from the root directory `yarn`
- (1:59) Launch the sample using the script `./launch.sh` as seen below, or use
  `SAMPLE=<directory-name> yarn start` as seen on the video where `<directory-name>` is the
  directory of the sample you want to run. The sample will launch on port 8080 and a button will
  appear to launch the UI on a separate tab. If a button does not appear, go to the "Ports" tab and
  expose 8080 explicitly, as seen in the video

  <img src="https://user-images.githubusercontent.com/75998795/227149103-e08f164e-a5cd-4601-9ef8-7479293580bc.gif" width="300"/>

Don't forget to stop your code space when you are done! For more information on code spaces PLS
visit https://code.visualstudio.com/docs/remote/codespaces

## Running locally

To run the project locally, follow the same steps described in the Codespace set up, but for your
local environment.

- You will need to use Node version v14.18.0+ or v16.0.0+.
- Your redirect URI should be `http://localhost:8080/complete`, similar change for the webauthn
  origin and RPID
- Note that if you are using `npm`, you might need to use the `--force` option when installing the
  modules:

```bash
npm install --force
SAMPLE=<directory-name> npm run start
```

## Running from a Docker container

The content of this repository is also packaged as a container on Dockerhub, see
[transmitsecurity/js-vanilla-samples](https://hub.docker.com/r/transmitsecurity/js-vanilla-samples).

To launch this container, you can either use a direct shell command where each envionment variable
in the `.env` file is translated into a `-e VAR=value` section in the below:

```
docker run --platform linux/amd64 -e SAMPLE=<directory-name> -e ... -p 8080:8080 transmitsecurity/js-vanilla-samples:latest

```

Alternatively, you can use the `docker_launch.sh` utility, which is identical to `launch.sh` except
it launches the container, and appends the values inside the `.env` automatically.

## Additional notes

### Debugging tabs on a mobile device

Some samples might require you to use web browsers on mobile devices. This is the case of the
WebAuthn cross device sample. To debug Chrome or Safari browsers running on a mobile device, you can
refer to the following documentations:

- [Remote debug Chrome on Android Devices](https://developer.chrome.com/docs/devtools/remote-debugging/)
- [Remote debug Safari on iOS Devices](https://webkit.org/web-inspector/enabling-web-inspector/)

### Using the non-default cluster

By default, the samples work with the US production cluster. However if you are working with a
tenant that resides on a different cluster, e.g. EU or a staging cluster, consult your Transmit
contact person and configure the following environment variable in your `.env` file:

- `VITE_TS_API_BASE`

---

<img src="https://user-images.githubusercontent.com/75998795/220656769-23c0ddda-cf03-4d45-94b9-9b32dd4b9750.gif" width="50" height="50"/>
Animated robot courtesy of https://opengameart.org/content/pixel-robot
