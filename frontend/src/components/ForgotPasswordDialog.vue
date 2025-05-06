<template>
  <el-dialog
      :model-value="modelValue"
      @update:model-value="closeDialog"
      title="密码重置"
  >
    <el-form @submit.prevent="handleSubmit">
      <el-input
          v-model="email"
          placeholder="请输入注册邮箱"
          :prefix-icon="Message"
          style="margin-bottom: 20px"
      />
      <el-button
        type="primary"
        native-type="submit"
        :loading="isLoading"
      >
        发送重置链接
      </el-button>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {ref} from "vue";
import {authAPI} from "../api/auth.js";
import {ElMessage} from "element-plus";
import {Message} from "@element-plus/icons-vue";
defineProps({
  modelValue: { type: Boolean, required: true }
});
const emit = defineEmits(['update:modelValue', 'success'])
ref(false);
const email = ref('');
const isLoading = ref(false);

const closeDialog = () => {
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    await authAPI.forgotPassword(email.value);
    ElMessage.success('重置链接已发送至邮箱（查看控制台日志）')
    emit('success')
    closeDialog() // 成功后关闭弹窗
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '发送失败');
  } finally {
    isLoading.value = false;
  }
};
</script>