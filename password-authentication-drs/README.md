# Password authentication and signup

This sample follows parts of the
[official Transmit guide on passwords](https://developer.transmitsecurity.com/guides/user/auth_passwords/)

The sample shows how to use the Transmit APIs to create a new user then authenticate them with a
username and password.

This sample focuses on simplicity and code clarity, as such you won't find advanced security
features or error handling in the code.

## Set up the Transmit tenant

Follow the main README to create your application and configure your environment file.

### Configure password authentication

Configure the passwords authentication method in your tenant by following
[this step in the Transmit guide](https://developer.transmitsecurity.com/guides/user/auth_passwords/#step-3-configure-auth-method).

### Configure detection and response services

Update your `.env` file:

- `VITE_TS_DRS_CLIENT_ID` should contain your risk Client ID (Platform Admin Console > Risk >
  Settings)
- `TS_DRS_CLIENT_SECRET` should contain your risk Client secret (Platform Admin Console > Risk >
  Settings)

## Application features

### Signup

Navigate to `/signup` to access the signup form. Fill in a username and password to create a new
user. Once the user is created, you can see them in the Transmit administration console, in the
Users tab.

This code does not perform client side verification on the password strength.

### Login

Once a user is created, navigate to `/login` to access the login form. Enter the username and
password used during signup to authenticate.

### Sessions & home page

When a user successfully logged in, the access token and refresh token will be saved as cookies.
When the home page is loaded, it looks for these cookies, if they are found, the user is
authenticated, otherwise, they are redirected to the login page.

### Detection and Response Monitoring and Recommendation

When a user performs any of the following actions, the action will be collected and visible in the
Platform Admin Console (Risk > Recommendations). Actions:

- `Sign Up`
- `Login`
- `Transaction` (post login page)
- `Logout`

When a user performs the `Transaction` action, a recommendation and risk score will be displayed to
allow the front end client make a real time decision of whether to add friction or remove friction
to this user's experience.
