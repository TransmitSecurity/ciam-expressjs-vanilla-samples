import '../../shared/css/style.scss';
import { pageUtils } from '../../shared/pageUtils.js';

// this together with <html style="display: none"> avoids flash of unstyled content (FOUC)
document.addEventListener('DOMContentLoaded', function () {
  document.getElementsByTagName('html')[0].style.display = 'block';
});

window.env = import.meta.env;
window.pageUtils = pageUtils;
window.drs = {
  actionType: {
    LOGIN: 'login',
    REGISTER: 'register',
    TRANSACTION: 'transaction',
    PASSWORD_RESET: 'password_reset',
    LOGOUT: 'logout',
    CHECKOUT: 'checkout',
    ACCOUNT_DETAILS_CHANGE: 'account_details_change',
    ACCOUNT_AUTH_CHANGE: 'account_auth_change',
    WITHDRAW: 'withdraw',
    CREDITS_CHANGE: 'credits_change',
  },
};

// Step 2: Load DRS SDK
document.addEventListener('TSAccountProtectionReady', function () {
  console.log('TSAccountProtectionReady', window.env.VITE_TS_DRS_CLIENT_ID);
  window.myTSAccountProtection = new window.TSAccountProtection(window.env.VITE_TS_DRS_CLIENT_ID);
  window.myTSAccountProtection.init();
});

// Step 5: Fetch DRS recommendation
window.getRiskRecommendation = function (actionToken, userId) {
  const query = new URLSearchParams({
    actionToken: actionToken,
    userId: userId,
  }).toString();

  return fetch(`/risk/recommendation?${query}`, {
    method: 'GET',
    cache: 'no-cache',
  });
};
