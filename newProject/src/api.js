import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // Assuming your backend is running on port 8080

export const loginUser = async (username, password) => {

    try {
        const response = await axios.post(`${BASE_URL}/login`, { username, password });
        return response.data; // Assuming your backend sends a message upon successful login
    } catch (error) {
        throw error.response.data; // Throw the error response from the backend
    }
};