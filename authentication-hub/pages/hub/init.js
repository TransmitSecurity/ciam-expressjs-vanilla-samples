import '../../../shared/css/style.scss';
import { pageUtils } from '../../../shared/pageUtils.js';

// this together with <html style="display: none"> avoids flash of unstyled content (FOUC)
document.addEventListener('DOMContentLoaded', function () {
  document.getElementsByTagName('html')[0].style.display = 'block';
});
window.env = import.meta.env;
window.pageUtils = pageUtils;
