// Initialize the SDK
export async function initSdk() {
    const unifiedSdk = window.tsPlatform;
    await unifiedSdk.initialize({
        clientId: 'ecb1khu1fmpl1jqs6qodett8cyw1obt1',
        ido: { serverPath: 'https://56gdkhxggxy5smx6p0oi2.transmit.security', applicationId: 'default_application' },
    });
    return unifiedSdk;
}