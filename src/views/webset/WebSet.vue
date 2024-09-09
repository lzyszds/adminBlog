<script setup lang="ts">
import { useStore } from "@/store";
import SetLoadGif from "./SetLoadGif.vue";
import SetSystem from "./SetSystem.vue";
import SetAiKey from "./SetAiKey.vue";
import SetFooterOrAi from "./SetFooterOrAi.vue";
import { setMession } from "@/utils/utils";
import { WebSystemType } from "@/types/WebSetType";
import { getSystemConfig, updateSystemConfig } from "@/api/system";
const state = useStore();

const activeName = ref("lazy");

const handleClick = (tab: any) => {
  console.log("🚀 ~ handleClick ~ tab:", tab);
  // activeName.value = tab.paneName;
};

const result = await getSystemConfig<WebSystemType[]>();
setTimeout(() => {
  state.loading = false;
}, 1000);

//更新系统配置
const updateSystemData = async (key: string, val: string, id: number) => {
  try {
    const resoult = await updateSystemConfig<string>({
      config_id: id,
      config_key: key,
      config_value: val,
    });
    return setMession(resoult.code == 200 ? "success" : "error", resoult.msg!);
  } catch (err) {}
};
</script>

<template>
  <div class="webset-container">
    <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <ElTabPane label="懒加载" name="lazy">
        <SetLoadGif :result="result.data" @updateSystemData="updateSystemData" />
      </ElTabPane>
      <ElTabPane label="变量设置" name="variable">
        <SetSystem :result="result.data" @updateSystemData="updateSystemData" />
      </ElTabPane>
      <ElTabPane label="Ai密钥" name="aiKey">
        <SetAiKey />
      </ElTabPane>
      <ElTabPane label="页脚" name="footer">
        <SetFooterOrAi />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style lang="scss" scoped>
.webset-container {
  height: calc(100% - 40px);
  padding: 20px;
  display: grid;
  color: var(--themeColor);
  overflow: auto;
  overflow-x: hidden;
  :deep(.el-tabs__header) {
    .el-tabs__nav-wrap {
      .el-tabs__nav {
        float: none;
        justify-content: center;
        padding-right: 40px;
      }
    }
  }
  /* 隐藏滚动条 */
  ::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  .aiKeyTable {
    width: 100%;
    max-height: calc(100vh - 340px);
    overflow-y: auto;
    border-radius: 10px;
  }
  :deep(.aiKeyTools) {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
