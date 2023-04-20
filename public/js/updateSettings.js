import { showAlert } from './alerts';

// type: password or data
export const updateData = async (data, type) => {
  const dataJSON = JSON.stringify(data);

  const url =
    type === 'password'
      ? 'http://localhost:3000/api/v1/users/updateMyPassword'
      : 'http://localhost:3000/api/v1/users/updateMe';

  console.log(url);

  try {
    const res = await fetch(url, {
      credentials: 'include',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: dataJSON,
    });

    const resData = await res.json();

    if (resData.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated successfully!`);
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    } else {
      throw new Error(resData.message);
    }
  } catch (error) {
    showAlert('error', error);
  }
};
