# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Overview

This is a monorepo containing multiple standalone sample applications demonstrating Transmit
Security CIAM (Customer Identity and Access Management) authentication flows. Each sample is built
with vanilla JavaScript, Express.js backend, and Vite for development. The samples correspond to
guides in the Transmit Security developer portal.

## Repository Architecture

### Workspace Structure

This project uses Yarn workspaces with the following key directories:

- **Sample directories** (e.g., `login-with-email`, `passkey-authentication`,
  `webauthn-cross-device`): Each contains a standalone app demonstrating a specific authentication
  flow
- **`shared/`**: Common utilities used across samples
  - `config.js`: API endpoint configuration, reads from `VITE_TS_API_BASE` env var
  - `token.js`: Token exchange and validation (OIDC tokens, JWT verification)
  - `pageUtils.js`: Frontend utilities
  - `utils.js`: Rate limiting and other backend utilities
  - `css/`: Shared styles

### Sample Application Structure

Each sample follows this pattern:

```
<sample-name>/
├── backend/
│   ├── app.js          # Express router configuration
│   └── index.js        # API endpoints for the auth flow
├── pages/              # Frontend HTML pages
├── public/             # Static assets
├── vite.config.js      # Vite config, uses vite-plugin-mix for backend
├── package.json
└── README.md           # Sample-specific guide
```

### How Samples Work

1. **Frontend**: Vanilla JS pages served by Vite dev server on port 8080 (configurable via `PORT`
   env var)
2. **Backend**: Express.js API running alongside frontend via `vite-plugin-mix`
3. **Configuration**: All samples read from root `.env` file (loaded via
   `dotenv.config({ path: '../.env' })` in vite.config.js)
4. **Shared code**: Imported as workspace dependency `@ciam-expressjs-vanilla-samples/shared`

## Environment Configuration

All samples require a `.env` file at the repository root with the following variables:

```
TS_REDIRECT_URI=<redirect-uri>/complete
VITE_TS_CLIENT_ID=<client-id>
TS_CLIENT_SECRET=<client-secret>
TS_APP_ID=<app-id>
VITE_TS_API_BASE=<api-base-url>  # Optional, defaults to https://api.transmitsecurity.io
PORT=<port>                       # Optional, defaults to 8080
```

Variables prefixed with `VITE_` are exposed to client-side code. See `sample.env` for template.

## Development Commands

### Installing Dependencies

```bash
# Install all workspace dependencies
yarn

# Or with npm (may require --force)
npm install --force
```

### Running Samples

```bash
# Interactive menu to select and run a sample
./launch.sh

# Run a specific sample directly
SAMPLE=<directory-name> yarn start
# Example:
SAMPLE=login-with-email yarn start

# With npm
SAMPLE=<directory-name> npm run start
```

The sample will launch on port 8080 (or `PORT` env var) at `http://localhost:8080/`.

### Code Quality

```bash
# Lint and auto-fix
yarn lint

# Format code
yarn format
```

### Pre-commit Hook

Husky runs `yarn lint && yarn format && git add .` before each commit.

### Docker

```bash
# Run with docker directly
docker run --platform linux/amd64 -e SAMPLE=<directory-name> -e VITE_TS_CLIENT_ID=... -p 8080:8080 transmitsecurity/js-vanilla-samples:latest

# Or use helper script (reads .env automatically)
./docker_launch.sh
```

## Authentication Flow Pattern

Most samples follow this pattern:

1. **Frontend** (`pages/*.html`): User interaction, calls backend APIs
2. **Backend** (`backend/index.js`):
   - Fetches client access token via `common.tokens.getClientCredsToken()` (client_credentials
     grant)
   - Calls Transmit Security APIs (e.g., send OTP, validate credentials)
   - Returns auth code or session token
3. **Token exchange** (`/complete` endpoint or frontend):
   - Exchanges auth code for user tokens via `common.tokens.getUserTokens()`
   - Validates tokens via `common.tokens.validateToken()` using OIDC JWKS

Backend APIs are defined in `backend/index.js` as Express routers, configured in `backend/app.js`.

## Available Sample Flows

See `common.sh` for the full list of samples. Key ones include:

- **Email OTP**: `login-with-email`, `login-with-be-email`
- **SMS OTP**: `login-with-sms`, `login-with-be-sms`
- **Password**: `password-authentication`, `password-be-authentication`
- **MFA**: `login-with-mfa`, `login-with-be-mfa`
- **Magic Link**: `login-with-magiclink`, `login-with-be-magiclink`
- **Passkeys/WebAuthn**: `passkey-authentication`, `webauthn-for-logged-in-users`,
  `webauthn-cross-device`
- **Social**: `login-with-google`
- **Advanced**: `authentication-hub`, `hosted-idv`, `saml-idp`, `password-authentication-drs`
  (Detection & Response Service)

Samples prefixed with "be-" use backend-driven authentication flows.

## Key Technical Details

### Token Management

- Client access tokens are fetched using client credentials grant (`client_id` + `client_secret`)
- User tokens (access + ID) are obtained by exchanging OIDC auth codes
- Token validation uses JWKS endpoint to verify JWT signatures with public keys
- See `shared/token.js` for implementation

### API Configuration

All Transmit Security API endpoints are centralized in `shared/config.js`. The base URL defaults to
US cluster (`https://api.transmitsecurity.io`) but can be changed via `VITE_TS_API_BASE` for EU or
staging clusters.

### Rate Limiting

Backend endpoints should use `common.utils.rateLimiter()` middleware to prevent abuse (see usage in
sample `backend/index.js` files).

## Important Notes

- **Standalone samples**: Each sample is independent and can be configured separately
- **No production error handling**: Samples are simplified for demonstration; production
  implementations need proper error handling
- **Node version**: Requires Node v14.18.0+ or v16.0.0+
- **GitHub Codespaces**: Supported with special redirect URI handling (add `-8080.app` before
  `github.dev`)
- **Mobile debugging**: Some samples (cross-device WebAuthn) require mobile browsers; use Chrome
  DevTools remote debugging
