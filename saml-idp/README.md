# SAML IDP

Set up this example using the instruction in the [main README file](../README.md)

Please follow "Federate SSO with Transmit SAML IDP" guide:
https://developer.transmitsecurity.com/guides/user/sso_login_saml/

let's choose a SAML IDP tester simulating SP (for our example let's navigate to
[https://samltest.id/start-idp-test/])

## Set up the Transmit application & service provider

- Go to your tenant pages on the Transmit portal (https://portal.identity.security/), and create new
  application
- Go to "service providers" tab and create a new provider :
  - set "Assertion consumer service URL" : [https://samltest.id/Shibboleth.sso/SAML2/POST]
  - set "Entity ID" to [https://samltest.id/saml/sp]
  - set "Name qualifier" to [YOUR_DOMAIN.samltest.id]
- Please save the output of the SP creation process (which will be shown just one time)
- Bind your new created SP to your application by choosing it from service providers dropdown in
  application configuration

## Set idp metadata

- Go to [https://samltest.id/upload.php]
- Go to our "saml_idp_metadata_template" (located in root "saml-idp" proj) and replace
  "X509Certificate" with the value from service provider creation step ( pay attention to remove
  "-----BEGIN CERTIFICATE-----" prefix & "-----END CERTIFICATE-----" from suffix )
- Press "choose file" button and choose "saml_idp_metadata_template" metadata file (located in
  saml-idp proj) and press "UPLOAD"
  - Wait to see a confirmation with the xml metadata file output
  - Pay attention to change "Location" attribute if your'e using "Codespaces"

### Sample user experience

- Extract service provider id from the "SAML 2.0 endpoint (HTTP)" param (which you have saved from
  the creation of the SP in transmit portal) example of "SAML 2.0 endpoint (HTTP)" output :
  [https://api.transmitsecurity.io/cis/v1/serviceprovider/saml2/sso/fn3jm0zqh0xfvvn38k327]
  ("fn3jm0zqh0xfvvn38k327" is the SP id)
- create .env file in "saml-idp" folder and add : TS_SERVICE_PROVIDER_ID={TS_SERVICE_PROVIDER_ID}
  (replace {TS_SERVICE_PROVIDER_ID})
- Navigate again to [https://samltest.id/start-idp-test/] and set the "EntityId" as an identifier to
  saml idp tester
- Press go and start authentication by the SMS OTP
- After successful auth you will see redirection to the result SAML tester page

https://github.com/TransmitSecurity/ciam-expressjs-vanilla-samples/assets/75998795/91f05073-a522-4fb0-9693-b2bf59d7f1ed
