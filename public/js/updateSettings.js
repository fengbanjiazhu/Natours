import { showAlert } from './alerts';

// type: password or data
export const updateData = async (data, type) => {
  // console.log(data);
  // const dataJSON = JSON.stringify(data);
  let res, url;

  try {
    if (type === 'password') {
      url = 'http://localhost:3000/api/v1/users/updateMyPassword';
      const dataJSON = JSON.stringify(data);
      res = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: dataJSON,
      });
    } else {
      url = 'http://localhost:3000/api/v1/users/updateMe';
      res = await fetch(url, {
        credentials: 'include',
        method: 'PATCH',
        body: data,
      });
    }

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
