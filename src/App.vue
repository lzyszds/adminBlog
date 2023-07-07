<script setup lang='ts'>
import { getIpWeather } from "@/utils/common"
import { NowWeatherData } from './types/nowWeatherData';
const weather = getIpWeather() as Promise<NowWeatherData>
weather.then(res => {
  //将个人信息存入localStorage，避免每次刷新都要请求接口
  localStorage.setItem('nowWeatherData', JSON.stringify(res))
})
</script>

<template>
  <div class="base">
    <div class="content">
      <Suspense>
        <!-- <transition name="fade"> -->
        <router-view />
        <!-- </transition> -->
      </Suspense>
    </div>
  </div>
</template>

<style lang="less"  scoped>
.base {
  width: 100vw;
  height: 100vh;
  background-color: var(--themeColor);
  display: grid;
  justify-content: center;
  align-content: center;
}

.fade-enter-from,
.fade-leave-to {
  /*定义进入开始和离开结束的透明度为0*/
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  /*定义进入结束和离开开始的透明度为1*/
  opacity: 1;
  filter: blur(10px);
}

.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s;
}
</style>

<style lang="less">
@import url('@/assets/css/admin.less');
</style>
