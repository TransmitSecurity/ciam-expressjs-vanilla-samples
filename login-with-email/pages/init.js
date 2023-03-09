// This module places the VITE meta env on the window, as well as common functions that
// are used in multiple samples.

import '../../shared/css/style.scss'
import { pageUtils } from '../../shared/pageUtils.js'

window.env = import.meta.env
window.pageUtils = pageUtils
