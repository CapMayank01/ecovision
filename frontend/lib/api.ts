import axios from 'axios';

// When NEXT_PUBLIC_API_URL is unset, use same-origin requests so Next.js can proxy /api/* to
// the backend (see next.config.js rewrites). That avoids browser CORS issues in development.
// On the server, call the backend directly.
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '' : process.env.BACKEND_URL || 'http://127.0.0.1:5000');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
