# Authentication hub

This sample follows the
[official Transmit guide on Authentication Hub](https://developer.transmitsecurity.com/guides/user/authentication_hub/)

The Transmit Authentication Hub allows you to create a centralized authentication experience across
all your business lines. Use it to unify and centralize user identities, with an option to provide
seamless single sign-on (SSO) across multiple apps.

This sample focuses on simplicity and code clarity, as such you won't find advanced security
features or error handling in the code.

## About this demo

In this demo, a business application needs to authenticate a user. To do so, the business
application will rely on another application to authenticate users: the authentication hub.

We will call the business application `Relying Party` because it will rely on another party (the
authentication hub) to authenticate users. And the authentication hub will be called
`Identity Provider` because it is the application providing the user identity to the business app.

You will find three samples in this demo:

- `idp` corresponds to the Identity Provider application.
- `rp` corresponds to the Relying Party application.
- `sso` corresponds to another Relying Party, using silent SSO to log users in.

The rest of this document explains how to use these samples to demo an Authentication Hub use case.

### Reminder about codespace URLs

Whenever you start a codespace, you will have to build and save somewhere your **codespace base
URL**. This is done by adding `-8080.preview.app` before `.github.dev`.

For example if your codespace URL is

```
https://erwan-transmit-organic-space-ac2221022x2dd0cc.github.dev
```

Then your codespace **base** URL will be

```
https://erwan-transmit-organic-space-ac2221022x2dd0cc-8080.preview.app.github.dev/complete
```

### Running locally

This documentation was designed with Github codespaces in mind. If you want to run these three
different samples locally, you will need to use three different ports.

To do so, use `yarn start:local` or `npm run start:local` when starting the application.

- the `idp` will run on port `8080`
- the `rp` will run on port `8081`
- the `sso` will run on port `8082`

## Create a resource

In your administration tenant, create a resource:

- Resource name: SSO
- Resouce URI: http://localhost:8080/login

This resource will be used for the silent SSO authentication only, but every application that is
part of the SSO needs to request this resource during login.

## Set up the Relying Party

### Step 1 - Start your codespace

Start a new codespace. You can refer to the main README for more information.

### Step 2 - Create your application

In your Transmit tenant:

1. Create a new application
2. Name it `RelyingParty`
3. Select "Allow registration" in Advanced Settings > Public sign-up
4. Set a client display name
5. Set the redirect URI to the base URL of your codespace followed by `/complete`.

Here is an example redirect URI

```
https://erwan-transmit-organic-space-ac2221022x2dd0cc-8080.preview.app.github.dev/complete
```

Finally add the resource `SSO` to your application. Note that this step is only required to use the
silent authentication feature.

### Step 3 - Create your environment file

Create a file `.env` and update its value to match those of the application you just created.

### Step 4 - Start your application

The `Relying Party` will be based on the `authentication-hub/rp` sample. It doesn't need to do much
except redirect users to the `Identity Provider` when they need to log in.

In your code space start your application:

```bash
cd authentication-hub/rp
yarn
yarn start
```

## Set up the Hub

### Step 1 - Start a new codespace

Start a second codespace, different from the first one you started.

### Step 2 - Create your application hub

In your Transmit tenant:

1. Create a new application
2. Name it `IdentityProvider`
3. Select "Allow registration" in Advanced Settings > Public sign-up
4. Select "Set as authentication hub"
5. Set the authentication hub URL to the base URL of your codespace
6. Set a client display name
7. Set the redirect URI to the base URL of your codespace followed by `/complete`.
8. Finally add the resource `SSO` to your application. Note that this step is only required to use
   the silent authentication feature.

### Step 3 - Configure your application

In your Transmit tenant, configure the passwords authentication method following
[this step in the Transmit guide](https://developer.transmitsecurity.com/guides/user/auth_passwords/#step-3-configure-auth-method).

### Step 4 - Create your environment file

In the codespace of `Identity Provider`, create a file `.env` and update its value to match those of
the application you just created.

### Step 5 - Start your application

The `Identity Provider` app will be based on the sample `authentication-hub/idp`. In your codespace
start your application:

```bash
cd authentication-hub-idp
yarn
yarn start
```

## Test the authentication hub

Navigate to the base URL of the Relying Party then click on "Login / Signup". You will be redirected
to the Identity Provider. Login or signup, depending on the existence of your account. You will be
redirected to the Relying Party and be authenticated (you will see a Welcome page with a logout
button).

## Set up the SSO demo

This section follows the
[SSO guide](https://developer.transmitsecurity.com/guides/user/sso_across_apps/).

### Step 1 - Start your codespace

Start a third codespace, different from the Relying Party and Identity Provider.

### Step 2 - Create your application

In your Transmit tenant:

1. Create a new application
2. Name it `SSODemo`
3. Select "Allow registration" in Advanced Settings > Public sign-up
4. Set a client display name
5. Set the redirect URI to the base URL of your codespace followed by `/complete`.
6. Finally add the resource `SSO` to your application. Note that this step is only required to use
   the silent authentication feature.

### Step 3 - Create your environment file

Create a file `.env` and update the variables to match those of the application you just created.

### Step 4 - Start your application

The SSO demo will be based on the `authentication-hub/sso` sample. It will perform a silent
authentication to check if a user is logged in and redirect users to the `Identity Provider` when
they need to log in.

In your code space start your application:

```bash
cd authentication-hub/sso
yarn
yarn start
```

## Test silent SSO

Let's start by creating the user:

1. Navigate to the `sso` application and click "Login / Signup". You are redirected to the `idp`
   app.
2. Click "Signup" and enter a username and password. You are redirected back to the `sso` app.
3. Click "Logout".

Now that the user is created, we can try the silent SSO feature.

1. Navigate to the `rp` application and click "Login / Signup". You are redirected to the `idp` app.
2. Enter your username and password. You are redirected back to the `rp` app.
3. Now, _without_ logging out, navigate to the `sso` app.
4. You are automatically logged in.

If you log out from either application, you will be logged out from the SSO session.
