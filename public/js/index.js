import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

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
