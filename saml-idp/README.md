# SAML IDP

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- create a new service provider:

  - go to your application section in Transmit portal
  - create a new service provider ( please set "Assertion consumer service URL" param to be
    [https://samltest.id/Shibboleth.sso/SAML2/POST] )
  - bind this SP ( which you created ) to your app by choosing it from service providers dropdown in
    app configuration

- let's choose a SAML IDP tester simulating SP ( for our example let's open
  [https://samltest.id/start-idp-test/])
- you must establish a metadata link between your idp and the SAMLtest SP by setting metadata url or
  uploading a file which you generated for example we can build it with
  [https://www.samltool.com/idp_metadata.php] required fields : 1. "EntityId" - set your saml idp
  domain 2. "Single Sign On Service Endpoint" - set your starting point api on your backend
  server 3. "SP X.509 cert" = set it after getting it from Transmit portal "service provider adding"
  on your specific app

- next step is to fill in the "EntityId" in the input text under "Login initiator" ( go to our saml
  idp test site)
- press go and start authentication by SMS OTP
- after successful auth you will see redirection to result tester page
