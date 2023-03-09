// This module places the VITE meta env on the window, as well as common functions that
// are used in multiple samples.

import { pageUtils } from '../../shared/pageUtils.js';
import '../../shared/css/style.scss';

window.env = import.meta.env;
window.pageUtils = pageUtils;
