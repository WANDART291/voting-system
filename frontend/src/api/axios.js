import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // Adjust if your backend port is different
});

// --- THE MAGIC PART ---
// This checks for a token before EVERY request is sent
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `JWT ${token}`; // Djoser uses 'JWT', not 'Bearer' by default
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;