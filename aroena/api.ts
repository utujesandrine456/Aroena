import axios from 'axios'

const API_URL = 'http://192.168.1.5:3000';

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type' : 'application/json',
    }
})

export default api;
