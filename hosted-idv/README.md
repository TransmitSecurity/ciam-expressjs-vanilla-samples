# Hosted Identity Verification Flow

This sample follows the following guide:

https://developer.transmitsecurity.com/guides/verify/quick_start_web/

Set up this example using the instruction in the [main README file](../README.md)

## Sample user experience

- Open a browser tab on <domain:port>/ - redirects to a page to start hosted IDV flow
- Click on Start IDV flow button - The browser will redirect to the hosted IDV endpoint
- Follow steps to complete flow, once document verification finished you will be redirected to
  <domain:port>/complete page with verification results
- It is recommended to open the browser debugger tools and look at the console logs which reflect
  flow and network

<img src="https://user-images.githubusercontent.com/75998795/229867744-1ee93f52-7dd5-4330-b843-1c158274e49c.gif" style="width: 500px"/>
