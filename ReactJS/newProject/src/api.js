import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // Assuming your backend is running on port 8080

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { username, password });
        const token = response.data.token; // Assuming your backend sends a JWT token and refresh token
        const refreshToken = response.data.refresh_token;
        return { token, refreshToken };
    } catch (error) {
        console.log(error.response.data);
        const errorMessage = error.response?.data?.message || 'Your username or password is incorrect';
        console.log(errorMessage);
        throw new Error(errorMessage); // Throw the error message
    }
};