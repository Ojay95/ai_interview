import axios, { AxiosError } from 'axios';

// Use Vite's native environment variable handling for Netlify
const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-ai-interview-jx2h.onrender.com/api/v1';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Increased timeout to 30s to allow Render free tier instances to spin up
    timeout: 30000,
});

apiClient.interceptors.request.use(
    (config) => {
        // Standardize key name to 'access_token' to match backend response
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Clear token and redirect on authentication failure
            localStorage.removeItem('access_token');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);