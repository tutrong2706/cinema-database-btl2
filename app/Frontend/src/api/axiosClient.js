import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3069', // Port của Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để gắn Token vào mỗi request nếu có
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;