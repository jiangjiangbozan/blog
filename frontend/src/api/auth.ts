import axios from 'axios'

const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return config
})

// 响应拦截器
service.interceptors.response.use(
    response => response.data,
    error => {
        return Promise.reject(error.response?.data || error.message)
    }
)

export const authAPI = {
    register: (data: RegisterParams) => service.post('/register', data),
    login: (data: LoginParams) => service.post('/login', data),
    checkUsername: (username: string) => service.get('/check/username', { params: { username } }),
    checkEmail: (email: string) => service.get('/check/email', { params: { email } })
}

interface RegisterParams {
    username: string
    email: string
    password: string
}

interface LoginParams {
    identifier: string
    password: string
}