// Initialize the SDK
export async function initSdk() {
  const unifiedSdk = window.tsPlatform;
  await unifiedSdk.initialize({
    clientId: 'az8xbjlb1zbfot2husyw7qu0kb3qj074',
    ido: {
      serverPath: 'https://0dau9szmld2g6zq50g9i6.transmit.security',
      applicationId: 'default_application',
    },
  });
  return unifiedSdk;
}
