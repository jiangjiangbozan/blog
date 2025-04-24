import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {  // 代理所有以/api开头的请求
        target: 'http://localhost:8080',  // 后端地址
        changeOrigin: true,  // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, '') // 正确移除/api前缀
      }
    }
  }
})
