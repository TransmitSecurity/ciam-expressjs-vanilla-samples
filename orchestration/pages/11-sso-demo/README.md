# Orchestration - Authentication hub

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

**NOTE:** The sample was originally based on frontend password authentication (see
authentication-hub application in root folder). Here we added a new orchestration experience managed
by the ido-idp.html and related ido/\*.js files. You can switch between the password and
orchestration modes by setting the desired authentication page in the Authentication Hub application
in the platform.

**NOTE 2:** For simplicity's sake, all the apps in this sample run on the same domain. In real-life
scenarios you would have each run in at least a separate subdomain, allowing proper state and cookie
separation.

---

## Setup

This sample consists of 3 applications and requires additional setup accordingly. The detailed setup
is detailed in the guide linked above, here is the TLDR version along with additions to the `.env`
file.

**NOTE:** All the URLs below are pointing to `localhost` assuming you are launching the sample from
your local machine. If you are using Code-spaces, use the Code-spaces base URL defined in the
[main README file](../README.md).

### Create the authentication hub app

In your administration tenant, go to the "Applications" section via the sidebar, and create a new
app called `auth-hub-sample`:

- Select the "Allow registration" radio button under the "Public sign-up" section
- Select the "Set as authentication hub" checkbox
- Set the following "Authentication hub URL": `http://localhost:8080/hub/`
- Set the following "Redirect URI" under "Client information": `http://localhost:8080/hub/complete`
- Click "Save"
- Configure the password authentication method as described in
  [this step in the Transmit guide](https://developer.transmitsecurity.com/guides/user/auth_passwords/#step-3-configure-auth-method).
- Add the following section to your `.env` file:

```
TS_REDIRECT_URI_ORC_SSOHUB=http://localhost:8080/hub/complete
VITE_TS_CLIENT_ID_ORC_SSOHUB=***YOUR CLIENT ID***
TS_CLIENT_SECRET_ORC_SSOHUB=***YOUR CLIENT SECRET***
```

### Create the "Air" business app

In your administration tenant, go to the "Applications" section via the sidebar, and create a new
app called `sso-air-sample`:

- Select the "Allow registration" radio button under the "Public sign-up" section
- Set the following "Redirect URI" under "Client information": `http://localhost:8080/air/complete`
- Click "Save"
- Add the following section to your `.env` file:

```
VITE_TS_REDIRECT_URI_ORC_SSOAIR=http://localhost:8080/air/complete
VITE_TS_CLIENT_ID_ORC_SSOAIR=***YOUR CLIENT ID***
TS_CLIENT_SECRET_ORC_SSOAIR=***YOUR CLIENT SECRET***
```

### Create the "Cars" business app

In your administration tenant, go to the "Applications" section via the sidebar, and create a new
app called `sso-cars-sample`:

- Select the "Allow registration" radio button under the "Public sign-up" section
- Set the following "Redirect URI" under "Client information": `http://localhost:8080/cars/complete`
- Click "Save"
- Add the following section to your `.env` file:

```
VITE_TS_REDIRECT_URI_ORC_SSOCARS=http://localhost:8080/cars/complete
VITE_TS_CLIENT_ID_ORC_SSOCARS=***YOUR CLIENT ID***
TS_CLIENT_SECRET_ORC_SSOCARS=***YOUR CLIENT SECRET***
```

## Orchestration

In your orchestration tenant add a login journey according to your desired logic. The journey must:
(1) authenticate the user to receive an `access_token` and `session_id` from the platform, (2)
exchange it for a `completion URL` by invoking the `callback endpoint`, and (3) provide the
`completion URL` back to the application to redirect.

`.env` file configuration:

```json
VITE_TS_FLEXIDO_TENANT_ID=***YOUR Transmit Platform Tenant ID***
VITE_TS_FLEXIDO_APPLICATION_ID=default_application
VITE_TS_FLEXIDO_JOURNEY_ID=***Your Journey ID***
```

### Journey Params

The `ido-idp.html` page triggers a `window.tsPlatform.ido.startJourney()` call which may receive an
`{ additionalParams: { ... } }` object. The journey additional params must include the
`src_interaction` value. This value is provided in the URL query params when landing on the
`ido-idp.html` page.

When the journey starts in the orchestration service, it should be able to retrieve the
`src_interaction` value by extracting it into a variable:

```javascript
let src_interaction = @policy.request().params["src_interaction"]
```

### Journey Options to Authenticate a User

- Use the `Authentication` action. It will invoke the platform's
  [backend authentication APIs](https://developer.transmitsecurity.com/guides/user/be_auth_overview/).
- Directly invoke the platform's backend authentication APIs using external connections.
- Use the `Set User` action to set the user and force-authenticate it.

### Create callback endpoint External Connection

Create an external connection of type API, custom web service.

#### Function Arguments

- session_id: session_id value received on authentication or `Set User` action.
- src_interaction: `src_interaction` value provided by Authentication Hub on redirect to the
  `ido-idp.html` page.
- user_access_token: access_token value received on authentication or `Set User` action.

#### Configuration

URL: `https://api.transmitsecurity.io/cis/auth/centralized/callback`

method: POST

JSON body, where session_id and src_interaction are external connection function parameters:

```json
{
  "session_id": "${session_id}",
  "src_interaction": "${src_interaction}"
}
```

Headers:

- Content-Type: application/json
- Authorization: Bearer ${user_access_token}

Response Format: `JSON Object`

### Invoke callback endpoint External Connection

Invoke the callback endpoint external connection from your journey using a `@webrequests`
auth-script code or `Invoke a Web Service` action node.

Validate successful invocation of the web service by checking `response.status == 200`, where
`response` is the output variable of the web service invocation.

Extract the `completion URL` from the web service response:

```javascript
let completion_url = response.body?.result?.url;
```

### Journey Completion

The journey should provide the `completion URL` to the `ido-idp.html` application using the
` Provide`` JSON ` action:

```json
{
  "url": "${completion_url}"
}
```

---

## Running the demo

Launch the sample as described in the [main README file](../README.md), using `yarn` for initial
setup and the `launcher.sh` for running the server. Going to `http://localhost:8080/` gets you to
the `Acme Air" business app, but you can toggle between it and the "Acme Cars" app using the
provided links.

Clicking "Login" from any app gets you to the Hub where you can create a new user or use an existing
one. Once the sign-up or authentication is complete, you will be redirected to the original app you
started with. If you now follow the link to the other app, the backend looks for active sessions
created by SSO and silently logs in if a session exists.

######Logging out is individual to each app.

https://user-images.githubusercontent.com/75998795/230760930-aea83cf0-4a9f-4861-a170-abb0742d675e.mp4
