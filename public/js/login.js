import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await fetch('/api/v1/users/login', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    showAlert('error', error);
  }
};

export const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.status === 'success') {
      location.assign('/');
    }
  } catch (error) {
    showAlert('error', 'Something went wrong, please try again');
  }
};

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await fetch('/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, passwordConfirm }),
    });

    const data = await res.json();

    if (data.status === 'success') {
      showAlert(
        'success',
        'Welcome to Natours! You will be transfer to login page shortly'
      );
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    showAlert('error', error);
  }
};
