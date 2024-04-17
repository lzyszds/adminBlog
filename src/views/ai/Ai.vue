<script setup lang="ts">
import SetRight from "@/components/SetRight.vue";
import { useStore } from "@/store";
import { Popup, Requirement } from "@/types/SetRightType";
import AiForm from "./AiForm.vue";
import { LNotification } from "@/utils/utils";
import dayjs from "dayjs";

const { $axios } = window;
const state = useStore();
//页面配置
const requirement = reactive<Requirement>({
  search: "", //搜索内容
  pages: 1, //当前页数
  limit: 10, //每页显示条数
  api: "/aiService/getAiKeysList",
});

const popup = reactive<Popup>({
  addName: "新增Key",
  modifyName: "修改Key",
  addVisible: false,
  modifyVisible: false,
  addWidth: "40%",
  modifyWidth: "26%",
  addTop: "10vh",
  modifyTop: "10vh",
});

provide("setRightProps", {
  requirement,
  popup,
});

//自动加载数据
await state.handleCurrentChange(requirement);

//子组件传来的参数 关闭form表单
const switchMod = (boolean: boolean, isAdd) => {
  if (isAdd) {
    popup.addVisible = boolean;
  } else {
    popup.modifyVisible = boolean;
  }
  state.handleCurrentChange(requirement);
};

//删除AiKey
const _delete = async (event) => {
  const res = await $axios({
    url: "/aiService/deleteAiKey",
    method: "post",
    data: {
      id: event.id,
    },
  });
  LNotification(res.msg!);
  state.handleCurrentChange(requirement);
};

const formatDate = (date) => {
  const d = dayjs(date);
  return d.format("YYYY-MM-DD HH:mm");
};
</script>

<template>
  <!-- <div class="webset-container">
    <el-radio-group
      v-model="setComponent"
      size="large"
      style="justify-content: center"
    >
      <el-radio-button label="Ai" value="Ai" />
      <el-radio-button label="Washington" value="Washington" />
      <el-radio-button label="Los Angeles" value="Los Angeles" />
      <el-radio-button label="Chicago" value="Chicago" />
    </el-radio-group> -->
  <SetRight :requirement="requirement">
    <template #table>
      <ElTableColumn prop="id" label="id" width="100" sortable></ElTableColumn>
      <ElTableColumn prop="created_at" label="创建时间" width="180" sortable>
        <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
      </ElTableColumn>
      <ElTableColumn
        prop="keyName"
        label="KeyName"
        width="180"
        sortable
      ></ElTableColumn>
      <ElTableColumn
        prop="keyValue"
        label="KeyValue"
        min-width="300"
        sortable
      ></ElTableColumn>
      <ElTableColumn fixed="right" label="操作" width="140">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="_delete(row)">
            删除
          </el-button>
        </template>
      </ElTableColumn>
    </template>
    <template #popupAdd>
      <AiForm type="add" @switchMod="switchMod" />
    </template>
  </SetRight>
  <!--  </div> -->
</template>

<style lang="scss" scoped>
.webset-container {
  padding: 20px;
  display: grid;
  gap: 20px;
  :deep(.mainTem) {
    grid-template-rows: 50px 660px 72px;
    .tableuser {
      max-height: 680px;
    }
  }
}
</style>
