<script setup lang='ts'>
import SetLeft from '@/components/SetLeft.vue'
</script>

<template>
  <div class="base">
    <div class="admin">
      <div class="tool">
        <Suspense>
          <SetLeft />
        </Suspense>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="less"  >
/* 路由切换动画 */
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s;
}

/* 可能为enter失效，拆分为 enter-from和enter-to */
.fade-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

<style lang="less">
@import url('@/assets/css/admin.less');
</style>
