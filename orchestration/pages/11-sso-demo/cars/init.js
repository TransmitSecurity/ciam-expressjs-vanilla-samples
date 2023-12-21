// This module places the VITE meta env on the window, as well as common functions that
// are used in multiple samples.

import '@ciam-expressjs-vanilla-samples/shared/css/style.scss';
import { pageUtils } from '@ciam-expressjs-vanilla-samples/shared/pageUtils.js';

// this together with <html style="display: none"> avoids flash of unstyled content (FOUC)
document.addEventListener('DOMContentLoaded', function () {
  document.getElementsByTagName('html')[0].style.display = 'block';
});
window.env = import.meta.env;
window.pageUtils = pageUtils;
