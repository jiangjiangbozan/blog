<script setup lang="ts">
import {reactive, ref} from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  Message,
  Lock,
  InfoFilled,
  Select,
  Apple,
  ChromeFilled as Google,
} from '@element-plus/icons-vue'
import PasswordStrengthMeter from './PasswordStrengthMeter.vue'
import type { FormInstance } from 'element-plus'
import { authAPI } from './../api/auth'
import { ElMessage } from 'element-plus'

const isLoading = ref(false)
const router = useRouter()
const registerForm = ref<FormInstance>()
const validEmail = ref(false) // 邮箱有效性状态

const form = reactive<{
  username: string
  email: string
  password: string
  agreement: boolean
}>({
  username: '',
  email: '',
  password: '',
  agreement: false,
})

// 用户名实时校验
const checkUsername = async (rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value.trim()) {
    callback(new Error('请输入用户名')); // 优先触发必填校验
    return;
  }
  try {
    const response = await authAPI.checkUsername(value);
    response.data.exists
        ? callback(new Error('用户名已被注册'))
        : callback();
  } catch {
    callback(new Error('校验服务异常，请手动检查'));
  }
}

// 邮箱实时校验（修正参数）
const checkEmail = async (rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入邮箱'));
    return;
  }
  try {
    const response = await authAPI.checkEmail(value);
    if (response.data.exists) {
      callback(new Error('邮箱已被注册'));
    } else {
      callback();
    }
  } catch (error) {
    callback(new Error('邮箱校验失败，请稍后重试'));
  }
}

const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['blur', 'change'] // 同时监听输入和失焦
    },
    {
      validator: checkUsername,
      trigger: ['blur', 'change']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'change']
    },
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码至少8位', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/,
      message: '需包含字母、数字和特殊符号',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '邮箱格式不正确',
      trigger: ['blur', 'change'],
      pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
    },
    { validator: checkEmail, trigger: ['blur', 'change'] }
  ],
  agreement: [{ required: true, message: '请同意用户协议', trigger: 'change' }],
}

// 提交注册
const handleRegister = async () => {
  try {
    await registerForm.value?.validate();
    isLoading.value = true;
    await authAPI.register(form);
    ElMessage.success('注册成功');
    await router.push('/auth/login');
  } catch (error: any) {
    if (error instanceof Error) {
      // 校验失败不显示错误提示（Element会自动处理）
      return;
    }
    // 显示后端返回的具体错误
    const errorMsg = error.response?.data?.error || '注册失败：未知错误';
    ElMessage.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="form-container">
    <el-card class="form-card animate__animated animate__fadeIn">
      <h1 class="form-title">注册新账户</h1>
      <el-form
          :model="form"
          :rules="rules"
          ref="registerForm"
          @submit.prevent="handleRegister"
          >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
              v-model="form.username"
              placeholder="创建专属用户名"
              :prefix-icon="User"
              size="large"
              clearable
          >
            <template #suffix>
              <el-tooltip content="4-16位字母数字组合">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input
              v-model="form.email"
              placeholder="输入常用邮箱"
              :prefix-icon="Message"
              size="large"
              clearable
          >
            <template #suffix>
              <el-icon v-if="validEmail" color="#409EFF"><Select /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="设置登录密码"
              :prefix-icon="Lock"
              size="large"
              show-password
          >
            <template #suffix>
              <password-strength-meter :password="form.password" />
            </template>
          </el-input>
        </el-form-item>

        <!-- 协议同意 -->
        <el-form-item prop="agreement">
          <el-checkbox v-model="form.agreement">
            我已阅读并同意 <el-link type="primary">《用户协议》</el-link>
            和 <el-link type="primary">《隐私政策》</el-link>
          </el-checkbox>
        </el-form-item>

        <el-button
            type="primary"
            size="large"
            native-type="submit"
            :loading="isLoading"
            :disabled="!form.agreement"
            class="w-full form-btn"
        >
          立即注册
        </el-button>

        <div class="third-login">
          <el-divider>其他方式注册</el-divider>
          <div class="oauth-icons">
            <el-icon :size="28"><Apple /></el-icon>
            <el-icon :size="28"><Google /></el-icon>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>

</template>

<style scoped lang="scss">
@import '../styles/baseForm.css';
.register-container {
  .register-card {
    .el-input__wrapper {
      transition: all 0.3s !important;

      &:hover {
        box-shadow: 0 0 0 2px rgba(64,158,255,0.15) !important;
      }

      &.is-focus {
        box-shadow: 0 0 0 2px rgba(64,158,255,0.3) !important;
      }
    }
  }
}
</style>