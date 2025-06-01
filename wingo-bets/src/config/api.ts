import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://127.0.0.1:3001',  // FastAPI backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api; 