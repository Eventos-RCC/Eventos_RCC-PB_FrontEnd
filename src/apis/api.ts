import axios from 'axios'

axios.defaults.baseURL = import.meta.env.API_BASE_URL || 'http://localhost:3000'

const api = axios.create({
    baseURL: import.meta.env.API_BASE_URL || 'http://localhost:3000',
})

export default api