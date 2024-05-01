import axios from 'axios';
import Swal from 'sweetalert2';


export const loginUser = (user) => async (dispatch) => {
  dispatch({ type: 'USER_LOGIN_REQUEST' });

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', user);
    dispatch({ type: 'USER_LOGIN_SUCCESS', payload: response.data });
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    window.location.href = '/';
  } catch (error) {
    
    if (error.response && error.response.data && error.response.data.message) {
      dispatch({ type: 'USER_LOGIN_FAILED', payload: error.response.data.message });
    } else {
    
      dispatch({ type: 'USER_LOGIN_FAILED', payload: 'An error occurred during login' });
    }
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('currentUser');
 

  window.location.href = '/login';
};
