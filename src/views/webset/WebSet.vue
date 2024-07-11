<script setup lang="ts">
import { useStore } from "@/store";
import SetLoadGif from "./SetLoadGif.vue";
import SetSystem from "./SetSystem.vue";
import SetFooterOrAi from "./SetFooterOrAi.vue";
import { LNotification } from "@/utils/utils";
import { WebSystemType } from "@/types/WebSetType";
const state = useStore();

const { $axios } = window;

const result: WebSystemType[] = await $axios({
  url: "/common/getSystemConfig?type=admin",
  method: "get",
});
console.log(`lzy  result:`, result);
setTimeout(() => {
  state.loading = false;
}, 1000);

//更新系统配置
const updateSystemData = async (key: string, val: string, id: number) => {
  try {
    await $axios({
      url: "/common/updateSystemConfig",
      method: "post",
      data: {
        config_key: key,
        config_value: val,
        config_id: id,
      },
    });
    return LNotification("更新成功", 2000, "bottom-right", "success");
  } catch (err) {}
};
console.log(123345);
</script>

<template>
  <div class="webset-container">
    <h3>系统配置</h3>
    <SetLoadGif :result="result" @updateSystemData="updateSystemData" />
    <SetSystem :result="result" @updateSystemData="updateSystemData" />
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
