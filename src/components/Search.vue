<script setup lang='ts'>
import http from '@/http/http';
import { ref } from 'vue';
// import { httpData } from '../children/user/type'
const emit = defineEmits(['searchData'])
const props = defineProps({
  type: {
    type: String,
    default: 'default'
  },
  url: {
    type: String,
    default: 'default'
  }
})
//搜索框内容
const searchInput = ref('')

const search = () => {
  switch (props.type) {
    case 'user':
      const pagePara = `/adminApi/${props.url}?search=` + searchInput.value
      http('get', pagePara).then((res: any) => {
        emit('searchData', { data: res.data, searchInput: searchInput.value })
      })
      break;
  }
}
</script>

<template>
  <div class="search">
    <el-input class="searchInput" @keydown.enter="search" v-model="searchInput" placeholder="search" clearable />
    <el-button class="btn" @click="search" type="primary">Go</el-button>
  </div>
</template>

<style lang="less" scoped>
</style>
