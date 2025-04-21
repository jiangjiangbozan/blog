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
    const { data } = await authAPI.login({
      identifier: form.username,
      password: form.password
    })

    localStorage.setItem('token', data.token)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  }
}
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