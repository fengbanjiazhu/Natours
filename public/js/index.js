import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout, signUp } from './login';
import { updateData } from './updateSettings';
import { bookTour } from './stripe';

// DOM elements
const mapBox = document.getElementById('map');
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

if (mapBox) {
  const locationData = JSON.parse(mapBox.dataset.locations);

  displayMap(locationData);
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const loginBtn = document.querySelector('.nav__el--login');
    loginBtn.textContent = 'Loading...';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (signupForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const signupBtn = document.querySelector('.nav__el--signup');
    signupBtn.textContent = 'Loading...';

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById(
      'signup-passwordConfirm'
    ).value;
    signUp(name, email, password, passwordConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateData(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    updateData({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save password';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
