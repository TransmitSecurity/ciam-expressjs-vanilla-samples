# SAML IDP

This sample follows the "Federate SSO with Transmit SAML IDP" guide:
https://developer.transmitsecurity.com/guides/user/sso_login_saml/

The sample code includes the IDP part, [main README file](../README.md)

The sample code only implements the IDP part. We will create a full flow using the following
[SP client simulator](https://samltest.id/start-idp-test/)

## Set up the Transmit application and IDP

- Make sure to follow the [main README file](../README.md) to create an application via the
  [Transmit portal](https://portal.identity.security/applications)
- Go to [Service providers tab](https://portal.identity.security/applications/serviceProviders) and
  click the "Add service provider" button. This will set up the SP simulator metadata, and obtain
  the IDP metadata:
  - Set the following "Assertion consumer service URL":
    `https://samltest.id/Shibboleth.sso/SAML2/POST`
  - Set the following "Entity ID": `https://samltest.id/saml/sp`
  - Set the following "Name qualifier": `samltest.id`
- After clicking "Save" - the screen will show various meta data item. These are only shown once so
  please copy to a temporary pasteboard to be used in the following steps.
- Go back to your application configuration, and bind the newly created SP by choosing it from
  "Service Providers" drop down menu, at the bottom of the page.
- In your `.env` file, create an entry called `TS_SERVICE_PROVIDER_ID` and set the value to the SP
  ID provided in the above meta data. The SP ID is the last part of the metadata output "SAML 2.0
  endpoint (HTTP)". So for example if you got
  `.../v1/serviceprovider/saml2/sso/fn3jm0zqh0xfvvn38k327`, the ID you need to copy is
  `fn3jm0zqh0xfvvn38k327`.

## Set up the SP simulator

- Go to the [simulator setup page](https://samltest.id/upload.php)
- Copy the [SAML IDP Metadata Template file](./saml_idp_metadata_template) and open for edit.
- Replace the string `*****IDP_ENTITY_ID*****` inside the `md:EntityDescriptor` tag with the entity
  ID provided at the end of the configuration step above.
- Replace the string `*****CERTIFICATE_CONTENT*****` inside the `ds:X509Certificate` tag with the
  certificate value that was provided at the end of the configuration step above. Copy only the
  decoded value, without the `-----BEGIN CERTIFICATE-----` prefix and the
  `-----END CERTIFICATE-----` suffix. Save the file.
- If you are running the sample from Codespaces, make sure you edit `Location` property inside the
  `md:SingleSignOnService` tag to point to your Codespaces domain, instead of localhost.
- Go to the [simulator setup page](https://samltest.id/upload.php)
- Click the "Choose File" button and browse to your save metadata file. Click "Upload" once the file
  is selected.
  - Wait to see a confirmation page with the xml metadata file output

## Sample user experience

- Navigate again to the [SP client simulator](https://samltest.id/start-idp-test/) and set the
  "EntityId" to be the same one you provided in the XML metadata file.
- Press "Go" and start authentication by SMS OTP
- After successful authentication you will be redirected back to the SP simulator completion page.

https://github.com/TransmitSecurity/ciam-expressjs-vanilla-samples/assets/75998795/91f05073-a522-4fb0-9693-b2bf59d7f1ed
