<script setup lang="ts">
import { useStore } from "@/store";
import SetLoadGif from "./SetLoadGif.vue";
import SetSystem from "./SetSystem.vue";
import SetFooterOrAi from "./SetFooterOrAi.vue";
import { setMession } from "@/utils/utils";
import { WebSystemType } from "@/types/WebSetType";
import { getSystemConfig, updateSystemConfig } from "@/api/system";
const state = useStore();

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
    <h3>系统配置</h3>
    <SetLoadGif :result="result.data" @updateSystemData="updateSystemData" />
    <SetSystem :result="result.data" @updateSystemData="updateSystemData" />
    <SetFooterOrAi />
  </div>
</template>

<style lang="scss" scoped>
.webset-container {
  height: calc(100% - 40px);
  padding: 20px;
  display: grid;
  grid-template-rows: 25px 260px 300px 1fr;
  color: var(--themeColor);
  overflow: auto;

  & > h3 {
    font-size: 20px;
    margin: 0;
    font-family: "dindin";
    text-align: center;
  }
}
</style>
