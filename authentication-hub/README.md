# Authentication hub

This sample follows the
[Transmit Security guide on Authentication Hub](https://developer.transmitsecurity.com/guides/user/authentication_hub/)
and the
[Transmit Security SSO guide](https://developer.transmitsecurity.com/guides/user/sso_across_apps/).

## About this sample

The Transmit Authentication Hub allows you to create a centralized authentication experience across
all your business lines. Use it to unify and centralize user identities, with an option to provide
seamless single sign-on (SSO) across multiple apps.

In this demo, the Acme organization needs to authenticate a user for two business applications:
"Acme Air" airlines, and "Acme Cars" car rentals. To do so, the business applications will rely on a
third application, the authentication hub, called "Acme Connect".

**NOTE:** The sample is using password authentication for the authentication hub, but could be
adapted to use any authentication method desired. Feel free to experiment and modify the `hub`
application, make use of code and instructions provided in other authentication samples provided in
this repo.

**NOTE 2:** For simplicity's sake, all the apps in this samples and run on the same domain. In real
life scenarios you would have each run in at least a separate subdomain, allowing proper state and
cookies separation.

---

## Setup

This sample consists of 3 applications, and requires additional setup accordingly. The detailed
setup is detailed in the guide linked above, here is the TLDR version along with additions to the
`.env` file.

**NOTE:** All the URLs below are pointing to `localhost` assuming you are launching the sample from
your local machine. If you are using Code-spaces, use the Code-spaces base URL defined in the
[main README file](../README.md).

### Create a resource

In your administration tenant, go to the "Applications" section via the side bar, select the
"Resources" tab, and create a new resource:

- Resource name: `SSO`
- Resource URI: `http://localhost:8080/login`
- Add the following section to your `.env` file:

```
# SSO Sample app values below
VITE_SSO_RESOURCE_URL=http://localhost:8080/login
```

This resource will be used for the silent SSO authentication only, but every application that is
part of the SSO needs to request this resource during login.

### Create the authentication hub app

In your administration tenant, go to the "Applications" section via the side bar, and create a new
app called `auth-hub-sample`:

- Select the "Allow registration" radio button under the "Public sign-up" section
- Select the "Set as authentication hub" checkbox
- Set the following "Authentication hub URL": `http://localhost:8080/hub/`
- Set the following "Redirect URI" under "Client information": `http://localhost:8080/hub/complete`
- Add the `SSO` resource to the "Resources" input box. Note that this step is only required to use
  the silent authentication feature
- Click "Save"
- Configure the password authentication method as described in
  [this step in the Transmit guide](https://developer.transmitsecurity.com/guides/user/auth_passwords/#step-3-configure-auth-method).
- Add the following section to your `.env` file:

```
TS_REDIRECT_URI_SSOHUB=http://localhost:8080/hub/complete
VITE_TS_CLIENT_ID_SSOHUB=***YOUR CLIENT ID***
TS_CLIENT_SECRET_SSOHUB=***YOUR CLIENT SECRET***
```

### Create the "Air" business app

In your administration tenant, go to the "Applications" section via the side bar, and create a new
app called `sso-air-sample`:

- Select the "Allow registration" radio button under the "Public sign-up" section
- Set the following "Redirect URI" under "Client information": `http://localhost:8080/air/complete`
- Add the `SSO` resource to the "Resources" input box. Note that this step is only required to use
  the silent authentication feature
- Click "Save"
- Add the following section to your `.env` file:

```
VITE_TS_REDIRECT_URI_SSOAIR=http://localhost:8080/air/complete
VITE_TS_CLIENT_ID_SSOAIR=***YOUR CLIENT ID***
TS_CLIENT_SECRET_SSOAIR=***YOUR CLIENT SECRET***
```

### Create the "Cars" business app

In your administration tenant, go to the "Applications" section via the side bar, and create a new
app called `sso-cars-sample`:

- Select the "Allow registration" radio button under the "Public sign-up" section
- Set the following "Redirect URI" under "Client information": `http://localhost:8080/cars/complete`
- Add the `SSO` resource to the "Resources" input box. Note that this step is only required to use
  the silent authentication feature
- Click "Save"
- Add the following section to your `.env` file:

```
VITE_TS_REDIRECT_URI_SSOCARS=http://localhost:8080/cars/complete
VITE_TS_CLIENT_ID_SSOCARS=***YOUR CLIENT ID***
TS_CLIENT_SECRET_SSOCARS=***YOUR CLIENT SECRET***
```

---

## Running the demo

Launch the sample as described in the [main README file](../README.md), using `yarn` for initial
setup and the `launcher.sh` for running the server. Going to `http://localhost:8080/` gets you to
the `Acme Air" business app, but you can toggle between it and the "Acme Cars" app using the provide
links.

Clicking "Login" from any app gets you to the Hub where you can create a new user or use an existing
one. Once the signup or authentication is complete, you will be redirected to the original app you
started with. If you now follow the link to the other app, you can use SSO to login. The two apps
have different SSO behavior by design, to demonstrate the options:

- If you do a login via the "Acme Cars" app, and once completed go to the "Acme Air" app - you will
  need to click the "Login" button, no further action.
- If you do a login via the "Acme Air" app, and once completed go to the "Acme Cars" app - you will
  experience a silent login.

Logging out is individual to each app.

https://user-images.githubusercontent.com/75998795/230760930-aea83cf0-4a9f-4861-a170-abb0742d675e.mp4
