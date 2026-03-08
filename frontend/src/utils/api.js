import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy will be setup in vite.config.js
    withCredentials: true
});

export default api;
