import { defineStore } from 'pinia'
import { ref } from 'vue'
import {jwtDecode} from 'jwt-decode'

interface JwtPayload {
    sub: string
    username: string
}

export const useUserStore = defineStore('user', () => {
    const isLoggedIn = ref(false)
    const username = ref('')

    function login(token: string) {
        const decoded = jwtDecode<JwtPayload>(token)
        isLoggedIn.value = true
        username.value = decoded.username // 从JWT解析用户名
        localStorage.setItem('token', token)
    }

    function logout() {
        isLoggedIn.value = false
        username.value = ''
        localStorage.removeItem('token')
    }

    // 初始化时检查token
    function init() {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token)
                // 可在此添加token过期验证
                isLoggedIn.value = true
                username.value = decoded.username
            } catch (error) {
                console.error('Invalid token:', error)
                logout()
            }
        }
    }

    return { isLoggedIn, username, login, logout, init }
})