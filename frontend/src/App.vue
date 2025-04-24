<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
userStore.init()
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
