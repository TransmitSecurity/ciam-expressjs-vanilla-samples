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
  extractInputValue: function (name) {
    try {
      return document.getElementById(name).value;
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
      const elem = document.getElementById(id);
      elem.removeAttribute('disabled');
      elem.classList.remove('disabled');
    } catch (ex) {
      console.log(ex);
    }
  },
  disable: function (id) {
    try {
      const elem = document.getElementById(id);
      elem.setAttribute('disabled', 'true');
      elem.classList.add('disabled');
    } catch (ex) {
      console.log(ex);
    }
  },
  showLoading: function () {
    const mask = document.createElement('div');
    const spinner = document.createElement('div');

    mask.id = 'loading-mask';
    mask.appendChild(spinner);
    document.body.appendChild(mask);

    setTimeout(function () {
      // Set timeout in order to execute this change on the next event loop and trigger the transition
      mask.classList.add('loaded');
    }, 0);
  },
  hideLoading: function () {
    const mask = document.getElementById('loading-mask');
    mask.classList.remove('loaded');

    setTimeout(function () {
      // Allow transition to complete before removing the spinner from the DOM
      document.body.removeChild(mask);
    }, 300);
  },
  copyText: async function (divElement) {
    const value = divElement.innerText;
    await navigator.clipboard.writeText(value);
    divElement.classList.add('show-message');
    setTimeout(() => {
      divElement.classList.remove('show-message');
    }, 1000);
  },
};
