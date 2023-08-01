<script setup lang='ts'>
import Search from '@/components/Search.vue'
import { useStore } from '@/store/store';
import { Popup, Requirement } from '@/types/SetRightType'
import { show } from '@/utils/loading'
import { ElMessageBox, ElPagination } from 'element-plus'
import { h, computed, inject } from 'vue';

interface Props {
  popup?: Popup,
  requirement: Requirement
}
const state = useStore()
const { popup, requirement } = inject('setRightProps') as Props

//开启表单时点击空白地方 关闭form表单时的提示
const handleClose = (done: () => void) => {
  ElMessageBox({
    title: '提示',
    message: h('p', null, [
      h('span', null, '你确定关闭该对话框吗 '),
    ]),
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(() => {
      done()
    })
}
const addToPop = () => {
  popup!.addVisible = true
}

//计算总页数
const pageSum = computed(() => {
  const { pageSize } = requirement;
  const { total } = state
  return total! % pageSize == 0 ? total! / pageSize : (total! / pageSize >> 0) + 1
});

//分页事件、切换页码时提供load效果
const currentChange = async (event: number) => {
  requirement.currentPage = event
  show('#loadings')
  state.handleCurrentChange(requirement, event)

}
</script>

<template>
  <div class="mainTem">
    <Search />
    <div class="tableuser" id="loadings">
      <el-table class="tableuser" :data="state.tableData" style="width: 100%">
        <template #empty>
          <div class="empty">
            <img src="@/assets/image/暂无文档.svg" alt="" />
            <span>暂无数据</span>
          </div>
        </template>
        <slot name="table"></slot>
      </el-table>

    </div>
    <div class="toolfooter">
      <div v-if="popup">
        <el-button class="add" type="primary" @click="addToPop">{{ popup.addName }}</el-button>
        <el-dialog v-if="popup" class="articleDialog" :close-on-press-escape="false" v-model="popup.addVisible" top="0px"
          :before-close="handleClose" title="新增文章" :width="popup.addWidth" left>
          <slot name="popupAdd" v-if="popup.addVisible"></slot>

        </el-dialog>
        <el-dialog class="articleDialog" :close-on-press-escape="false" v-model="popup.modifyVisible"
          :before-close="handleClose" title="修改文章" :width="popup.addWidth" addLeft>
          <slot name="popupModify" v-if="popup.modifyVisible"></slot>
        </el-dialog>
      </div>
      <div class="example-pagination-block lzyColor">
        <div class="example-demonstration">
          When you have more than {{ pageSum }} pages of data, use a pagination.
        </div>
        <el-pagination small v-model="requirement.currentPage" :page-size="requirement.pageSize" background
          :total="state.total" @current-change="currentChange" layout="prev, pager, next, jumper" />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url('@/assets/css/headSearch.less');

div :deep(img[data-fancybox="gallery"]) {
  width: 150px;
  height: 73px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: .1s ease-out;
  box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.5);
  border: 1px solid #000;
  margin-top: 5px;
  transform: scale(0.95);

  &:hover {
    transform: scale(1);
    border-color: #fff;
  }
}

:deep(.el-dialog).articleDialog {
  border-radius: 20px;
  background: #f5f5f5;
  position: relative;
  padding: 1.8rem;
  border: 2px solid #c3c6ce;
  transition: 0.5s ease-out;
  overflow: visible;
  margin: 25px auto;

  .el-dialog__header {
    font-family: 'almama';
    text-align: center;
    margin-bottom: 30px;
    padding: 0;

    .el-dialog__title {
      font-size: 3rem;
      font-weight: 400;
      color: #000;
      user-select: none;
    }

    button {
      margin-top: 15px;
      margin-right: 30px;
      font-size: 20px;
      color: var(--themeColor);

      &:hover .el-icon {
        color: var(--themeColor);
      }
    }
  }

  &:hover {
    border-color: var(--themeColor);
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
  }
}

.toolfooter {
  & :deep(.el-overlay-dialog) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
