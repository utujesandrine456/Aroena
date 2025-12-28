import axios from 'axios'

export const API_URL = 'http://192.168.1.5:2009';

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api;
