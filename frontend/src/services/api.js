import axios from 'axios'
import { getStoredToken } from '../helpers/storage'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
})

api.interceptors.request.use((config) => {
    const token = getStoredToken()
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
