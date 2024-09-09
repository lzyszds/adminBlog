<script setup lang="ts">
import { useStore } from "@/store";
import { onMounted } from "vue";
import Email from "./Email.vue";
import SqlBackups from "./SqlBackups.vue";
const store = useStore();
const activeName = ref("email");
onMounted(() => {
  store.hideLoading();
});
const handleClick = (tab: any) => {
  console.log(tab);
};
</script>

<template>
  <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <ElTabPane label="邮箱任务" name="email">
      <Email />
    </ElTabPane>
    <ElTabPane label="其他任务" name="sqlBackups">
      <SqlBackups />
    </ElTabPane>
    <!-- <el-tab-pane label="Role" name="third">Role</el-tab-pane>
    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
  </ElTabs>
  <div class="plantask"></div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__nav) {
  float: none;
  justify-content: center;
  padding-right: 40px;
}
</style>
