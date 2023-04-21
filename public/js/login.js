import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/users/login', {
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
    const res = await fetch('http://localhost:3000/api/v1/users/logout', {
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