<script setup lang="ts">
import { WebSystemType } from "@/types/WebSetType";

const { result } = defineProps<{
  result: WebSystemType[];
}>();

const data = reactive(result);

const emit = defineEmits(["updateSystemData"]);

const addAiKey = () => {
  data.push({
    config_desc: "",
    config_id: 0,
    config_key: "",
    config_value: "",
  });
};

// 保存
const save = (item: WebSystemType) => {
  emit("updateSystemData", item.config_key, item.config_value, item.config_id);
};

const handleDelect = (scope: any) => {
  data.splice(scope.$index, 1);
};
</script>

<template>
  <div class="setSystem">
    <ElTable :data="data" class="aiKeyTable">
      <ElTableColumn label="key" width="100">
        <template #default="scope">
          <ElInput v-model="scope.row.config_key" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="value">
        <template #default="scope">
          <ElInput v-model="scope.row.config_value" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="说明">
        <template #default="scope">
          <ElInput v-model="scope.row.config_desc" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="80px" center>
        <template #default="scope">
          <ElButton type="text" @click="handleDelect(scope)">删除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="aiKeyTools">
      <ElButton type="primary" @click="addAiKey"> 添加更多 </ElButton>
      <ElButton type="primary" @click="save"> 保存设置 </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setSystem {
  overflow-y: auto;
  padding: 10px;
  :deep(.el-table__inner-wrapper) {
    padding-bottom: 20px;
  }
}
</style>
