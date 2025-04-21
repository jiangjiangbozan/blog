<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ password: string }>()

const strength = computed(() => {
  const length = props.password.length
  const hasLetter = /[A-Za-z]/.test(props.password)
  const hasNumber = /\d/.test(props.password)
  const hasSymbol = /[!@#$%^&*]/.test(props.password)
  let score = 0
  score += length >= 8 ? 25 : length >= 6 ? 10 : 0
  score += hasLetter ? 25 : 0
  score += hasNumber ? 25 : 0
  score += hasSymbol ? 25 : 0
  return Math.min(100, score)
})

const getStrengthColor = computed(() => {
  if (strength.value < 25) return '#ff4d4f' // 弱
  if (strength.value < 50) return '#fadb14' // 中
  if (strength.value < 75) return '#a0d911' // 较强
  return '#52c41a' // 强
})
</script>

<template>
  <div class="password-strength">
    <div
        :style="{ width: `${strength * 25}%`, background: getStrengthColor }"
        class="strength-bar"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.password-strength {
  height: 4px;
  border-radius: 2px;
  background: #e0e0e0;
  overflow: hidden;

  .strength-bar {
    height: 100%;
    transition: width 0.3s ease;
  }
}
</style>