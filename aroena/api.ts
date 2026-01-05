import axios from 'axios'

export const API_URL = 'https://aroena.onrender.com/';

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api;
