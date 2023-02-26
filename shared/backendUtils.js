// backend side functions and shared utilities

export const backendUtils = {
    // This function wraps and API call for fetching client credential tokens.
    // A client credential token is used for authorizing backend to API calls using the client ID and client secret.
    // For more information see https://developer.transmitsecurity.com/guides/user/retrieve_client_tokens/
    getClientCredentialsToken: async function getClientCredentialsToken() {
        const url = 'https://api.userid.security/oidc/token'
        const params = new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.VITE_TS_CLIENT_ID,
          client_secret: process.env.TS_CLIENT_SECRET,
        })
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      
        try {
          const resp = await fetch(url, options)
          const data = await resp.json()
          console.log(resp.headers, resp.status, data)
          return data.access_token
        } catch (e) {
          console.log(e)
        }
      }  
};