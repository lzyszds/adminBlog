<script setup lang='ts'>
import { ref } from 'vue';
import { useStore } from '@/store/store'
import { Popup, Requirement } from "@/types/SetRightType";
const state = useStore()
//搜索框内容
const searchInput = ref<string>('')
interface Props {
  popup?: Popup;
  requirement: Requirement;
}
const { popup, requirement } = inject("setRightProps") as Props;


const search = () => {
  state.total = 0
  requirement.search = searchInput.value
  state.handleCurrentChange(requirement)
  
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
