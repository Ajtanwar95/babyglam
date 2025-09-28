const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://babyglam.onrender.com/api/v2'
    : 'http://localhost:5000/api/v2';

export default API_BASE_URL; 