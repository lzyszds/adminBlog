<script setup lang="ts">
import { deleteArticleCategory, getArticleCategory } from "@/api/article";
import SetRight from "@/components/SetRight.vue";
import { useStore } from "@/store";
import { Requirement } from "@/types/SetRightType";
import { LNotification, setMession } from "@/utils/utils";

const { $axios } = window;

const state = useStore();
setTimeout(() => {
  state.loading = false;
}, 500);
//页面配置
const requirement = reactive<Requirement>({
  search: "", //搜索内容
  pages: 1, //当前页数
  limit: 15, //每页显示条数
  api: getArticleCategory,
});
//自动加载数据
await state.handleCurrentChange(requirement);

const edit = (row: any) => {
  console.log(`lzy  row:`, row);
};
const del = (id) => {
  deleteArticleCategory<string>(id).then((res) => {
    state.handleCurrentChange(requirement);
    setMession(res.code === 200 ? "success" : "error", res.data);
  });
};

provide("setRightProps", {
  requirement,
});
</script>

<template>
  <SetRight>
    <template #table>
      <ElTableColumn property="type_id" label="id" sortable width="180"></ElTableColumn>
      <ElTableColumn prop="name" label="分类名"></ElTableColumn>
      <ElTableColumn label="权限" width="100px" align="center">
        <template #default="{ row }">
          <div class="power">
            <span v-if="row.whether_use === 0" class="powerAdmin">已禁用</span>
            <span v-else>已启用</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="150px">
        <template #default="{ row }">
          <ElButton type="primary" size="small" @click="edit">编辑</ElButton>
          <ElButton type="danger" size="small" @click="del(row.type_id)">删除</ElButton>
        </template>
      </ElTableColumn>
    </template>
  </SetRight>
</template>

<style lang="scss" scoped></style>
