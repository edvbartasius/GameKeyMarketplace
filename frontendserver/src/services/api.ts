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
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
