<template>
  <el-carousel height="400px" indicator-position="outside">
    <el-carousel-item v-for="item in 4" :key="item">
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
</style>