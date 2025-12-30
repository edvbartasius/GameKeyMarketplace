import axios from 'axios';
import { config } from '../config';

// Utility function to delay execution
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  async (response) => {
    await wait(500);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);
    await wait(500);
    return Promise.reject(error);
  }
);

export default api;
