import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapBox) {
  const locationData = JSON.parse(mapBox.dataset.locations);

  displayMap(locationData);
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
