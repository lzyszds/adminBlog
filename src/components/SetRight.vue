<script setup lang="ts">
import Search from "@/components/Search.vue";
import { useStore } from "@/store";
import { Popup, Requirement } from "@/types/SetRightType";
import { ElMessageBox, ElPagination } from "element-plus";
import { h, inject } from "vue";

interface Props {
  popup?: Popup;
  requirement: Requirement;
}
const state = useStore();
console.log(`lzy  state:`, state);
const { popup, requirement } = inject("setRightProps") as Props;

//开启表单时点击空白地方 关闭form表单时的提示
const handleClose = (done: () => void) => {
  ElMessageBox({
    title: "提示",
    message: h("p", null, [h("span", null, "你确定关闭该对话框吗 ")]),
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(() => {
    done();
  });
};
const addToPop = () => {
  popup!.addVisible = true;
};

watch(
  () => requirement.pages,
  async (event) => {
    state.formLoading = true; //开启load效果
    state.handleCurrentChange(requirement, event);
  },
  { deep: true }
);

provide("requirement", {
  requirement,
});
</script>

<template>
  <div class="topTool">
    <Search :requirement="requirement" />
    <ElButton v-if="popup" class="add" type="primary" @click="addToPop">{{
          popup!.addName
    }}</ElButton>
  </div>
  <!-- <div style="width: 735px;" v-if="state.formLoading"></div> -->
  <!-- row-class-name="animate__duration animate__bounceInUp" 动画属性 -->
  <ElTable
    class="tableuser"
    :data="state.tableData"
    row-class-name="animate__duration "
    style="width: 98%; height: calc(100% - 30px)"
  >
    <template #empty>
      <div class="empty">
        <img src="@/assets/image/暂无文档.svg" alt="" />
        <span>暂无数据</span>
      </div>
    </template>
    <slot name="table"></slot>
  </ElTable>
  <div class="toolfooter" v-if="state.total">
    <div class="example-pagination-block lzyColor">
      <div class="example-demonstration"></div>
      <el-pagination
        size="small"
        v-model:current-page="requirement.pages"
        background
        :page-count="state.total"
        layout="prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
  </div>
  <div v-if="popup">
    <ElDialog
      v-if="popup"
      class="articleDialog"
      :close-on-press-escape="false"
      v-model="popup.addVisible"
      :before-close="handleClose"
      :title="popup.addName"
      :align-center="popup.alignCenter"
      :width="popup.addWidth"
      :top="popup.addTop"
    >
      <slot name="popupAdd" v-if="popup.addVisible"></slot>
    </ElDialog>
    <ElDialog
      class="articleDialog"
      :close-on-press-escape="false"
      v-model="popup.modifyVisible"
      :before-close="handleClose"
      :title="popup.modifyName"
      :align-center="popup.alignCenter"
      :width="popup.modifyWidth"
      :top="popup.modifyTop"
    >
      <slot name="popupModify" v-if="popup.modifyVisible"></slot>
    </ElDialog>
  </div>
</template>
<style lang="scss" scoped>
@import url("@/assets/css/headSearch.scss");

.topTool {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 10px;
  background-color: #fff;
  border-radius: 10px;
  gap: 20px;
}

div :deep(img[data-fancybox="gallery"]) {
  width: 150px;
  height: 40px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.1s ease-out;
  box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.5);
  border: 2px solid var(--selectionColor);
  transition: 0.17s;
  filter: grayscale(0.5);
  vertical-align: bottom;
  padding: 1.5px;

  &:hover {
    filter: grayscale(0);
    border-color: var(--themeColor);
    box-shadow: 0 0 7px 1px rgba(122, 122, 122, 0.5);
    transform: scale(1.03);
  }
}

:deep(.cell) {
  &:has(img[data-fancybox="gallery"]) {
    overflow: initial;
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

  .el-dialog__header {
    font-family: "almama";
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
      margin-top: 5px;
      margin-right: 15px;
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

:deep(.el-table__body) {
  overflow-y: hidden;

  .animate__duration {
    transition: all 0.5s;
    animation-duration: 0.5s;
    /* 按顺序弹出 */
    animation-fill-mode: both;
    animation-timing-function: ease-in-out;

    &:nth-child(1) {
      animation-delay: 0.5s;
    }

    &:nth-child(2) {
      animation-delay: 0.3s;
    }

    &:nth-child(3) {
      animation-delay: 0.2s;
    }

    &:nth-child(4) {
      animation-delay: 0.4s;
    }

    &:nth-child(5) {
      animation-delay: 0.2s;
    }

    &:nth-child(6) {
      animation-delay: 0.5s;
    }

    &:nth-child(7) {
      animation-delay: 0.3s;
    }

    &:nth-child(8) {
      animation-delay: 0.5s;
    }

    &:nth-child(9) {
      animation-delay: 0.4s;
    }

    &:nth-child(10) {
      animation-delay: 0.2s;
    }

    &:nth-child(11) {
      animation-delay: 0.7s;
    }
  }
}
</style>
@/store
