# SAML IDP

Set up this example using the instruction in the [main README file](../README.md)

- let's choose a SAML IDP tester simulating SP ( for our example let's open
  [https://samltest.id/start-idp-test/])

## Set up the Transmit application & service provider

- Go to your tenant pages on the [Transmit portal](https://portal.identity.security/), and create
  new application
- Go to "service providers" tab and create a new provider :
  - set "Assertion consumer service URL" : [https://samltest.id/Shibboleth.sso/SAML2/POST]
  - set "EntityId" to [https://samltest.id/saml/sp]
- Please save the output of SP creation which will be shown just one time
- Bind new created SP to your application by choosing it from service providers dropdown in
  application configuration

## Build & Set new metadata

- Go to [https://www.samltool.com/idp_metadata.php]
- Set "EntityId" to be the "identity provider issuer" & "SP X.509 cert" to be the "x.509
  certificate" (values saved from SP creation)
- Set "Single Sign On Service Endpoint" to be directed to "sample login app"
  [http://localhost:8080/saml/authn]
- Press the "BUILD IDP METADATA" and save xml data into a file
- Go to [https://samltest.id/start-idp-test/] and press the link at first line ["metadata link
  between your IdP and the SAMLtest SP by using the upload form"]
- press "choose file" button and locate your metadata file you created before and press "UPLOAD" (
  you need to see a confirmation with the xml metadata file after few seconds)

### Sample user experience

- Navigate again to [https://samltest.id/start-idp-test/] and set the "EntityId" as an identifier to
  saml idp tester
- press go and start authentication by the SMS OTP
- after successful auth you will see redirection to the result SAML tester page
