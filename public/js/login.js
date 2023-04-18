const login = async (email, password) => {
  try {
    // const res = await axios({
    //   withCredentials: true,
    //   method: 'POST',
    //   url: 'http://127.0.0.1:3000/api/v1/users/login',
    //   data: { email, password },
    // });
    const res = await fetch('http://localhost:3000/api/v1/users/login', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
