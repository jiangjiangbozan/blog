<script setup lang="ts">
import { ref } from 'vue';
import { Search, User, House, FolderOpened, PriceTag, Collection, QuestionFilled, Moon, Sunny } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import {useDark, useToggle} from "@vueuse/core";

// 创建暗黑模式状态（响应式 Ref）
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light' // 明确指定明亮模式类名
})

// 创建切换函数（自动处理状态翻转）
const toggleDark = useToggle(isDark)

const router = useRouter();
const activeMenu = ref('home');
const searchKey = ref('');
const isLoggedIn = ref(false);
const userInfo = ref({ username: '用户' });
const newMessages = ref(0);
const handleMenuSelect = (index: string) => {
  activeMenu.value = index;
  router.push({ name: index });
};

const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索关键词:', searchKey.value);
};

const goLogin = () => {
  router.push('/login');
};

const goRegister = () => {
  router.push('/register');
};

const goMyFavorites = () => {
  router.push('/my-favorites');
};

const goCreationCenter = () => {
  router.push('/creation-center');
};

const goMessageCenter = () => {
  router.push('/message-center');
  newMessages.value = 0;
};

const goLogout = () => {
  isLoggedIn.value = false;
  router.push('/');
};
</script>

<template>
  <el-header class="main-header">
    <el-container class="container">
      <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          @select="handleMenuSelect"
          background-color="transparent"
          text-color="#f0f0f0"
          active-text-color="#ffd04b"
      >
        <el-menu-item index="home">
          <template #title>
            <el-icon><House /></el-icon>
            首页
          </template>
        </el-menu-item>
        <el-sub-menu index="categories">
          <template #title>
            <el-icon><FolderOpened /></el-icon>
            文章分类
          </template>
          <el-menu-item-group>
            <el-menu-item index="frontend">前端</el-menu-item>
            <el-menu-item index="backend">后端</el-menu-item>
            <el-menu-item index="architecture">架构</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="tags">
          <template #title>
            <el-icon><PriceTag /></el-icon>
            标签云
          </template>
        </el-menu-item>
        <el-menu-item index="series">
          <template #title>
            <el-icon><Collection /></el-icon>
            专题系列
          </template>
        </el-menu-item>
        <el-menu-item index="qa" v-if="isLoggedIn">
          <template #title>
            <el-icon><QuestionFilled /></el-icon>
            技术问答
            <el-badge :value="newMessages" :hidden="!newMessages" />
          </template>
        </el-menu-item>
      </el-menu>

      <div class="header-actions">
        <el-input
            v-model="searchKey"
            placeholder="搜索文章、作者或代码片段"
            clearable
            style="width: 300px"
            @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" style="margin-left: 8px;" @click="handleSearch">
          <el-icon style="vertical-align: middle">
            <Search />
          </el-icon>
          <span style="vertical-align: middle"> 搜索 </span>
        </el-button>
        <el-dropdown v-if="!isLoggedIn" trigger="click">
          <el-button type="primary" link>
            <el-icon><User /></el-icon>
            登录/注册
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goLogin">登录</el-dropdown-item>
              <el-dropdown-item @click="goRegister">注册</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown v-else trigger="click">
          <el-button type="primary" link>
            <el-icon><User /></el-icon>
            {{ userInfo.username }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goMyFavorites">我的收藏</el-dropdown-item>
              <el-dropdown-item @click="goCreationCenter">创作中心</el-dropdown-item>
              <el-dropdown-item @click="goMessageCenter">
                消息通知
                <el-badge :value="newMessages" :hidden="!newMessages" />
              </el-dropdown-item>
              <el-dropdown-item @click="goLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-tooltip :content="isDark ? '切换明亮模式' : '切换暗黑模式'">
          <el-switch
              v-model="isDark"
              active-color="#2c3e50"
              inactive-color="#409EFF"
              :active-icon="Moon"
              :inactive-icon="Sunny"
              @change="toggleDark"
          />
        </el-tooltip>
      </div>
    </el-container>
  </el-header>
</template>

<style lang="scss" scoped>
.main-header {
  transition: all 0.3s ease;
  box-shadow: var(--el-box-shadow-light);
  position: relative;
  z-index: 1000;

  // 明亮模式默认
  --header-bg: #409EFF;
  --header-text: rgba(255,255,255,0.9);
  --header-border: rgba(255,255,255,0.1);

  // 暗黑模式覆盖
  .dark & {
    --header-bg: #1a1a1a;
    --header-text: rgba(255,255,255,0.9);
    --header-border: #333;
  }

  background-color: var(--header-bg);
  color: var(--header-text);
  border-bottom: 1px solid var(--header-border);

  .el-menu {
    --el-menu-text-color: var(--header-text);
    --el-menu-active-color: #ffd04b;
    --el-menu-hover-bg-color: rgba(255,255,255,0.1);
  }
  .container {
    width: 100%;
    margin: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  .header-actions {
    display: flex;
    align-items: center;
  }
}

/* 全局样式 */
html.dark {
  /* Element Plus 暗黑模式变量 */
  --el-color-primary: #409EFF;
  --el-bg-color: #1a1a1a;
  --el-text-color-primary: rgba(255, 255, 255, 0.9);

  /* 自定义导航栏颜色 */
  .main-header {
    background-color: var(--el-bg-color);
    border-bottom: 1px solid #333;

    .el-menu {
      --el-menu-text-color: rgba(255, 255, 255, 0.8);
      --el-menu-active-color: #ffd04b;
      --el-menu-hover-bg-color: rgba(255, 255, 255, 0.1);
    }
  }
}

html.light {
  /* 明亮模式变量 */
  --el-bg-color: #ffffff;

  .main-header {
    background-color: #409EFF;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.main-header {
  transition: background-color 0.3s, border-color 0.3s;
  .container {
    width: 100%;
    margin: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }

  .el-menu {
    border-bottom: none;
    background-color: transparent;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}
</style>
