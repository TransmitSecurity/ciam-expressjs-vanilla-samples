# Webauthn Cross Device Flow

Full guide: https://developer.transmitsecurity.com/guides/webauthn/cross_device_flows/

## Todos

1. Add comments to match the above guide
1. Extract and display ID token
1. Config Guide / Video (embedded video? youtube?)
1. Additional styling cleanups
1. TBD monitor points, other production stuff to allow also loading as a demo service.


## Set up Webauthn

Base URL:  `https://ts-ron-legendary-waddle-rx7774944x4cwwrv-8080.preview.app.github.dev/complete`

1.Go to the Authentication tab on the Transmit portal, and configure 
the WebAuthn method for your newly created app, using the above base URL as origin, and the domain as the
   RPID.

## Run the demo

1. (1:35) Build the demo using `cd webauthn-cross-device`, and `yarn`
1. (1:46) Launch the demo using `yarn start`. The demo will launch on port 8080 and
   exposed via the above base URL (a button will appear on screen to open, or go
   to the "Ports" tab)


