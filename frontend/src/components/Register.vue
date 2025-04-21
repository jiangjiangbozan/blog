<script setup lang="ts">
import {reactive, ref, watch} from 'vue'
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
const loginForm = ref<FormInstance>()

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

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  agreement: [{ required: true, message: '请同意用户协议', trigger: 'change' }],
}
const validEmail = ref(false) // 邮箱有效性状态

// 监听邮箱变化并验证格式
watch(
    () => form.email,
    (email) => {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
      validEmail.value = emailRegex.test(email)
    }
)
// 密码强度规则
const passwordRules = [
  { required: true, message: '请输入密码', trigger: 'blur' },
  { min: 8, message: '密码至少8位', trigger: 'blur' },
  { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/,
    message: '需包含字母、数字和特殊符号',
    trigger: 'blur'
  }
]

// 用户名实时校验
const checkUsername = async () => {
  try {
    await authAPI.checkUsername(form.username)
    return Promise.resolve()
  } catch (error) {
    return Promise.reject('用户名已被注册')
  }
}

// 邮箱实时校验
const checkEmail = async () => {
  try {
    await authAPI.checkEmail(form.email)
    return Promise.resolve()
  } catch (error) {
    return Promise.reject('邮箱已被注册')
  }
}

// 提交注册
const handleRegister = async () => {
  try {
    isLoading.value = true
    await authAPI.register({
      username: form.username,
      email: form.email,
      password: form.password
    })
    ElMessage.success('注册成功')
    await router.push('/login')
  } catch (error) {
    console.log('提交注册数据:', {
      username: form.username,
      email: form.email,
      password: form.password
    });
    ElMessage.error(error.message || '注册失败')
  } finally {
    isLoading.value = false
  }
}
</script>


<template>
  <div class="form-container">
    <el-card class="form-card animate__animated animate__fadeIn">
      <h1 class="form-title">注册新账户</h1>
      <el-form
          :model="form"
          :rules="{
          ...rules,
          password: passwordRules,
          username: [...rules.username, { validator: checkUsername, trigger: 'blur' }],
          email: [...rules.email, { validator: checkEmail, trigger: 'blur' }]
        }"
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