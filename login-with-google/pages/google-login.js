//import {common} from "@ciam-expressjs-vanilla-samples/shared";

//eslint-disable-next-line no-unused-vars
async function getGoogleUrl(handleResponse) {
  console.log('getGoogleUrl');

  const response = await fetch('/email-otp', {
    method: 'GET',
  });

  const data = await response.json();
  console.log('Response from /google-url', { data });
  handleResponse({ data });
}
