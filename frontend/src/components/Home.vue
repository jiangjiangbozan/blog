<script setup lang="ts">
import Navigation from './Navigation.vue'
import Carousel from "./Carousel.vue";
import Footer from "./Footer.vue";

</script>

<template>
  <div class="full-height-container">
    <Navigation />
    <el-main class="no-padding">
      <Carousel />
    </el-main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.full-height-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.no-padding {
  padding: 0 !important;
}
</style>
