<script setup lang='ts'>
import { ref } from 'vue';
import { useStore } from '@/store/store'
const state = useStore()
//搜索框内容
const searchInput = ref<string>('')

const search = () => {
  state.total = 6
  state.setSearch(searchInput.value)
}
</script>

<template>
  <div class="search">
    <el-input class="searchInput" @keydown.enter="search" v-model="searchInput" placeholder="search" clearable />
    <el-button class="btn" @click="search" type="primary">Go</el-button>
  </div>
</template>

<style lang="less" scoped>
.search {

  :deep(.searchInput) {
    width: 200px;

    .el-input__wrapper {
      border-radius: 15px 0 0 15px;

      &.is-focus {
        box-shadow: 0 0 0 1px var(--themeColor) inset
      }
    }
  }

  :deep(.btn) {
    border-radius: 0 15px 15px 0;
    background-color: var(--themeColor);
    border-color: transparent;
  }
}
</style>
