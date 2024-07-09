<script setup lang="ts">
import { WebSystemType } from "@/types/WebSetType";

const { result } = defineProps<{
  result: WebSystemType[];
}>();

const data = reactive(result);

const emit = defineEmits(["updateSystemData"]);

function save(item: WebSystemType) {
  emit("updateSystemData", item.config_key, item.config_value, item.config_id);
}
</script>

<template>
  <div class="setSystem">
    <div
      class="rows"
      v-for="(item, index) in data"
      :key="index"
      :title="item.config_desc"
      v-show="item.config_key !== 'loadGif'"
    >
      <ElInput class="inputKey" v-model="item.config_key" />
      <ElInput class="inputValue" v-model="item.config_value" />
      <div>
        <LzyBtn
          class="btn"
          name="gg:clipboard"
          position="center"
          @click="save(item)"
        ></LzyBtn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setSystem {
  display: grid;
  gap: 8px;
  grid-template-rows: repeat(auto-fill, minmax(50px, 1fr));
  overflow-y: auto;
  padding: 10px;
  padding-left: 0;
  .rows {
    display: grid;
    align-items: center;
    grid-template-columns: 200px 1fr 40px;
    position: relative;
    justify-content: center;

    &::before {
      content: attr(title);
      display: block;
      clear: both;
      position: absolute;
      z-index: 99;
      top: -5px;
      left: 5px;
      background-color: #fff;
      padding: 0 5px;
      max-width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 1.3rem;
      color: #000;
      font-family: "dindin";
    }
    .inputKey {
      border: 3px solid var(--themeColor);
      border-radius: 0;
      border-right: none;
      border-radius: 7px 0 0 7px;
      :focus {
        border-color: #409eff;
      }
    }
    .inputValue {
      border: 3px solid var(--themeColor);
      border-radius: 0;
      border-width: 3px 0 3px 0;
      // border-radius: 0 7px 7px 0;
      :focus {
        border-color: #409eff;
      }
      &::before {
        content: " ";
        display: block;
        width: 3px;
        height: 100%;
        background-color: var(--themeColor);
        z-index: 99;
        position: absolute;
        left: 0;
        top: 0%;
      }
    }
    .btn {
      border: 3px solid var(--themeColor);
      border-radius: 0;
      border-left: none;
      border-radius: 0 7px 7px 0;
      padding: 0 10px;
      height: 38px;
    }

    :deep(.el-input__wrapper) {
      box-shadow: none;
    }
  }
}
</style>
