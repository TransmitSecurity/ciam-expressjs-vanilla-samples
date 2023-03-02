// client side functions and shared utilities

export const pageUtils = {
  updateElementText: function (id, text) {
    try {
      document.getElementById(id).textContent = text
    } catch (ex) {
      console.log(ex)
    }
  },
  extractUrlParameter: function (name) {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get(name)
    } catch (ex) {
      console.log(ex)
    }
  },
}
