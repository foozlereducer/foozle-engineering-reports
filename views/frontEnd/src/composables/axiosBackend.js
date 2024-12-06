import axios from 'axios';

// Create an axios instance for the client-side
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});