// client side functions and shared utilities

export const pageUtils = {
  updateElementText: function (id, text) {
    try {
      document.getElementById(id).textContent = text;
    } catch (ex) {
      console.log(ex);
    }
  },
  extractUrlParameter: function (name) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    } catch (ex) {
      console.log(ex);
    }
  },
  hide: function (id) {
    try {
      document.getElementById(id).classList.add('hidden');
    } catch (ex) {
      console.log(ex);
    }
  },
  show: function (id) {
    try {
      document.getElementById(id).classList.remove('hidden');
    } catch (ex) {
      console.log(ex);
    }
  },
  enable: function (id) {
    try {
      document.getElementById(id).removeAttribute('disabled');
    } catch (ex) {
      console.log(ex);
    }
  },
  disable: function (id) {
    try {
      document.getElementById(id).setAttribute('disabled', 'true');
    } catch (ex) {
      console.log(ex);
    }
  },
};
