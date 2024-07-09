<script setup lang="ts">
import SetRight from "@/components/SetRight.vue";
import { useStore } from "@/store";
import { Popup, Requirement } from "@/types/SetRightType";
import { LNotification } from "@/utils/utils";

const { $axios } = window;

const state = useStore();
setTimeout(() => {
  state.loading = false;
}, 500);
//页面配置
const requirement = reactive<Requirement>({
  search: "", //搜索内容
  api: "/article/getArticleTypeList",
});
//自动加载数据
await state.handleCurrentChange(requirement);

const edit = (row: any) => {
  console.log(`lzy  row:`, row);
};
const del = (id) => {
  $axios<string>({
    url: "/article/deleteArticleType",
    method: "post",
    data: { id },
  }).then((res) => {
    if (res.code === 200) {
      state.handleCurrentChange(requirement);
      LNotification(res.data!, 2000);
    } else {
      LNotification(res.msg!, 2000);
    }
  });
};

const popup = reactive<Popup>({
  addName: "新增分类",
  modifyName: "修改分类",
  addVisible: false,
  modifyVisible: false,
  addWidth: "40%",
  modifyWidth: "40%",
  alignCenter: true,
});

provide("setRightProps", {
  requirement,
  popup,
});
</script>

<template>
  <SetRight>
    <template #table>
      <el-table-column
        property="type_id"
        label="id"
        sortable
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column prop="name" label="分类名"></el-table-column>
      <el-table-column label="权限" width="100px" align="center">
        <template #default="{ row }">
          <div class="power">
            <span v-if="row.whether_use === 0" class="powerAdmin">已禁用</span>
            <span v-else>已启用</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="edit">编辑</el-button>
          <el-button type="danger" size="small" @click="del(row.type_id)">删除</el-button>
        </template>
      </el-table-column>
    </template>
  </SetRight>
</template>

<style lang="scss" scoped></style>
