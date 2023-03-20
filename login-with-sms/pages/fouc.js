const elm = document.getElementsByTagName('html')[0];
elm.style.display = 'none';
document.addEventListener('DOMContentLoaded', function (event) {
  elm.style.display = 'block';
});
