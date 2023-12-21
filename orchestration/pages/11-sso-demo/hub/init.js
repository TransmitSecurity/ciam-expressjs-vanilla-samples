import '@ciam-expressjs-vanilla-samples/shared/css/style.scss';
import { pageUtils } from '@ciam-expressjs-vanilla-samples/shared/pageUtils.js';

// this together with <html style="display: none"> avoids flash of unstyled content (FOUC)
document.addEventListener('DOMContentLoaded', function () {
  document.getElementsByTagName('html')[0].style.display = 'block';
});

window.env = import.meta.env;

const flexIdoPath = `https://${window.env.VITE_TS_FLEXIDO_TENANT_ID}.transmit.security`;

window.initIDO = async (serverPath = flexIdoPath) => {
  // Initialize an instance of the Identity Orchestration SDK using the unified SDK
  await window.tsPlatform.initialize({
    clientId: window.env.VITE_TS_CLIENT_ID_ORC_SSOHUB,
    ido: { serverPath, applicationId: window.env.VITE_TS_FLEXIDO_APPLICATION_ID },
    webauthn: { serverPath: window.env.VITE_TS_API_BASE || 'https://api.transmitsecurity.io' },
  });
  window.ido = window.tsPlatform.ido;
};

window.pageUtils = pageUtils;
