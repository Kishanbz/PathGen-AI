import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 300 seconds timeout to prevent AI roadmap/tutor timeouts
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
