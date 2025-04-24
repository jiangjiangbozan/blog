<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Apple,
  ChromeFilled as Google,
  User,
  Lock
} from '@element-plus/icons-vue'
import { authAPI } from './../api/auth'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'


const userStore = useUserStore()
const isLoading = ref(false)
const router = useRouter()
const loginForm = ref()

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  try {
    // 直接获取响应对象，避免遗漏状态码和数据
    const response = await authAPI.login({
      username: form.username,
      password: form.password
    });

    // 检查响应中是否包含 token（防御性处理）
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token)
      userStore.login(response.data.token) // 更新Pinia状态
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      // 后端返回 200 但无 token（如业务逻辑失败，需后端配合返回错误码）
      ElMessage.error('登录失败：无效的响应数据');
    }
  } catch (error: any) {
    console.log(error)
    ElMessage.error(error.response?.data?.error || '登录失败：网络错误');
  }
};

</script>

<template>
  <div class="form-container">
    <el-card class="form-card animate__animated animate__fadeIn">
      <h1 class="form-title">欢迎回来</h1>
      <el-form :model="form" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input
              v-model="form.username"
              placeholder="用户名/邮箱"
              :prefix-icon="User"
              size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              size="large"
              show-password
          />
        </el-form-item>

        <el-button
            type="primary"
            size="large"
            class="form-btn w-full"
            :loading="isLoading"
            @click="handleLogin"
        >
          立即登录
        </el-button>

        <div class="third-login">
          <el-divider>其他方式登录</el-divider>
          <div class="oauth-icons">
            <el-icon :size="28"><Apple /></el-icon>
            <el-icon :size="28"><Google /></el-icon>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/baseForm.css';

.el-input {
  &__wrapper {
    border-radius: 8px;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
    }
  }
}
</style>
