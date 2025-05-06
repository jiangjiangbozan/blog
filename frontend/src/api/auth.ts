import axios, {type AxiosResponse} from 'axios'

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
    (response) => response, // 直接返回完整的 response 对象
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data: RegisterParams): Promise<AxiosResponse<LoginResponse>> => service.post('/api/auth/register', data),
    login: (data: LoginParams) => service.post('/api/auth/login', data),
    checkUsername: (username: string) => service.get('/api/auth/check/username', { params: { username } }),
    checkEmail: (email: string) => service.get('/api/auth/check/email', { params: { email } }),
    forgotPassword: (email: string) => service.post('/api/auth/forgot-password', { email: email })
}

interface RegisterParams {
    username: string
    email: string
    password: string
}

interface LoginParams {
    username: string
    password: string
}

interface LoginResponse {
    token: string;
}