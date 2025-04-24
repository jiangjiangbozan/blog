import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createRouter, createWebHistory } from 'vue-router';
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createPinia } from 'pinia'
import './styles/global.scss'

// 配置路由（至少包含一条基础路由）
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: '思无邪', component: Home },
        { path: '/auth/login', name: '登录', component: Login },
        { path: '/auth/register', name: '注册', component: Register },
    ],
});

const app = createApp(App);
app.use(router); // 先注册路由
app.use(ElementPlus); // 再注册 Element Plus
app.use(createPinia())
app.mount('#app'); // 最后挂载
