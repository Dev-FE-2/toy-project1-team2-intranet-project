import axios from 'axios';

//임시
const BASE_URL = import.meta.env.VITE_APP_API_URL_DEV || '';

export const ApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
