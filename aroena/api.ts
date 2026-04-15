import axios from 'axios'

export const API_URL = 'http://192.168.1.6:2009';

const api = axios.create({
    baseURL: API_URL,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api;
