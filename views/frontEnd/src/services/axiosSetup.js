import axios from 'axios';
import router from '../../router';

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      router.push({ name: 'Login' });
    }
    return Promise.reject(error);
  }
);
