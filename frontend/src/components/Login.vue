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
import {ElMessage, type FormInstance} from 'element-plus'
import { useUserStore } from '../stores/user'
import ForgotPasswordDialog from "./ForgotPasswordDialog.vue";


const userStore = useUserStore()
const isLoading = ref(false)
const router = useRouter()
const loginForm = ref<FormInstance>()
const showDialog = ref(false);
const handleDialogSuccess = () => {
  showDialog.value = false;
};

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名/邮箱',
      trigger: ['blur', 'change']
    },
    {
      pattern: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$|^[a-zA-Z0-9_]{4,16}$/,
      message: '格式应为邮箱或4-16位字母数字组合',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'change']
    },
    {
      min: 8,
      message: '密码至少8位',
      trigger: ['blur', 'change']
    }
  ]
}

const handleLogin = async () => {
  try {
    // 1. 强制表单校验
    await loginForm?.value.validate()

    // 2. 显示加载状态
    isLoading.value = true

    // 3. 发起登录请求
    const response = await authAPI.login({
      username: form.username,
      password: form.password
    })

    // 4. 处理成功响应
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token)
      userStore.setToken(response.data.token)
      ElMessage.success('登录成功')
      await router.replace('/')
    }
  } catch (error: any) {
    // 5. 细化错误处理
    if (error.response?.status === 401) {
      ElMessage.error({
        message: '认证失败',
        duration: 3000
      })
    } else if (error.name === 'ValidationError') {
      // 由Element自动处理的表单错误
    } else {
      ElMessage.error(error.message || '网络连接异常')
    }
  } finally {
    isLoading.value = false
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

        <el-form-item class="text-right">
          <el-link type="primary" @click="showDialog = true">忘记密码？</el-link>
        </el-form-item>

        <el-button
            type="primary"
            size="large"
            class="form-btn w-full"
            :loading="isLoading"
            @click="handleLogin"
            :disabled="!loginForm?.validate"
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
    <ForgotPasswordDialog
        v-model="showDialog"
        @success="handleDialogSuccess"
    />
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
.el-dialog__header {
  border-bottom: 1px solid #eee;
}
.el-dialog__body {
  padding: 20px;
}
</style>
