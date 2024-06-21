import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // Assuming your backend is running on port 8080

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request config:', config); // Log request config
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response data:', response.data); // Log response data
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = sessionStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
                    const { token, refresh_token: newRefreshToken } = response.data;
                    sessionStorage.setItem('jwtToken', token);
                    sessionStorage.setItem('refreshToken', newRefreshToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.error('Refresh token request failed:', err);
                    sessionStorage.removeItem('jwtToken');
                    sessionStorage.removeItem('refreshToken');
                    window.location.href = '/login'; // Redirect to login if refresh token fails
                }
            }
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { username, password });
        const { token, refreshToken } = response.data; // Assuming your backend sends a JWT token and refresh token
        return { token, refreshToken };
    } catch (error) {
        console.log(error.response.data);
        const errorMessage = error.response?.data?.message || 'Your username or password is incorrect';
        console.log(errorMessage);
        throw new Error(errorMessage); // Throw the error message
    }
};

export const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
        console.log("Refresh token response data:", response.data); // Log the full response data
        return response.data;
    } catch (error) {
        console.log("Error response data:", error.response.data);
        throw new Error('Error refreshing token');
    }
};

export default axiosInstance;