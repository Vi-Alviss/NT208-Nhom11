import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});