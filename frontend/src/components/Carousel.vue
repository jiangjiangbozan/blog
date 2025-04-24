<script setup>
import {useUserStore} from '../stores/user'
import { useRouter } from 'vue-router'
import {Edit, Star} from "@element-plus/icons-vue";

const router = useRouter()
const userStore = useUserStore()
</script>
<template>
  <el-carousel height="400px" indicator-position="outside">
    <!-- 未登录状态 -->
    <el-carousel-item v-if="!userStore.isLoggedIn">
      <div class="auth-promo">
        <h2>加入技术社区</h2>
        <p>立即注册获取完整体验</p>
        <div class="auth-buttons">
          <el-button type="primary" @click="router.push('/auth/login')">登录</el-button>
          <el-button @click="router.push('/auth/register')">注册</el-button>
        </div>
      </div>
    </el-carousel-item>

    <!-- 登录状态 -->
    <el-carousel-item v-else>
      <div class="welcome-section">
        <h2>欢迎回来，{{ userStore.username }}！</h2>
        <p>您有3条新消息，2篇收藏更新</p>
        <div class="quick-actions">
          <el-button type="primary" @click="router.push('/creation-center')">
            <el-icon><Edit /></el-icon>
            写文章
          </el-button>
          <el-button @click="router.push('/my-favorites')">
            <el-icon><Star /></el-icon>
            查看收藏
          </el-button>
        </div>
      </div>
    </el-carousel-item>
    <el-carousel-item v-for="item in 3" :key="item">
      <el-image
          :src="`https://picsum.photos/1920/800?random=${item}`"
          fit="cover"
          class="h-full w-full"
      />
      <div class="carousel-caption">
        <h3>技术专题 {{ item }}</h3>
        <p>探索最新技术趋势</p>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<style lang="scss">
.el-carousel {
  border-radius: var(--el-border-radius-base);
  overflow: hidden;

  .carousel-caption {
    position: absolute;
    bottom: 20%;
    left: 10%;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);

    h3 {
      font-size: 2rem;
      margin-bottom: 8px;
    }
  }
}
.auth-promo, .welcome-section {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .auth-buttons, .quick-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;

    .el-button {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 8px;
    }
  }
}

</style>