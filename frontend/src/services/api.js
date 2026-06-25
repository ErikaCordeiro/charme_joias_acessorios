import axios from 'axios'
import { getStoredToken } from '../helpers/storage'

const API_TIMEOUT_MS = 30000

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    timeout: API_TIMEOUT_MS,
})

api.interceptors.request.use((config) => {
    const token = getStoredToken()
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            error.friendlyMessage = 'O servidor demorou para responder. Tente novamente em alguns instantes.'
        } else if (error.response?.status >= 500) {
            error.friendlyMessage = 'O servidor encontrou um erro interno. Verifique os logs da API no Render.'
        } else if (!error.response) {
            error.friendlyMessage = 'Nao foi possivel conectar ao servidor. Verifique se a API esta ativa.'
        }

        return Promise.reject(error)
    }
)

export default api
