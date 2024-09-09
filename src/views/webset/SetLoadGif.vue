<script setup lang="ts">
import { WebDataType, WebSystemType } from "@/types/WebSetType";
import { getSystemLoadImages } from "@/api/system";

const { result } = defineProps<{
  result: WebSystemType[];
}>();

const emit = defineEmits(["updateSystemData"]);

const loadGifList = await getSystemLoadImages<string[]>();

const webData = reactive<WebDataType>(
  result.reduce((acc, cur) => {
    acc[cur.config_key] = cur.config_value;
    return acc;
  }, {} as WebDataType)
);

//点击加载图片将图片地址设置为系统的加载图片
const handleLoadGif = async (val: string) => {
  webData.load_animation_gif = val;
  emit("updateSystemData", "load_animation_gif", val, 5);
};
</script>

<template>
  <div class="setLoadGif">
    <div class="loadGifList">
      <div
        v-for="(item, index) in loadGifList.data"
        :key="index"
        :class="['loadGifItem', { active: item === webData.load_animation_gif }]"
        @click="handleLoadGif(item)"
      >
        <img :src="'/firstHonoApi' + item" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setLoadGif {
  position: relative;
  overflow-y: auto;
  height: 100%;
  padding: 20px;

  .loadGifList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;

    .loadGifItem {
      img {
        width: 100%;
        height: 130px;
        object-fit: cover;
        border-radius: 10px;
        cursor: pointer;
        border: 3px solid transparent;
      }
      &:hover {
        img {
          filter: blur(0);
        }
      }
      &.active {
        img {
          filter: blur(0);
          border: 3px solid #000;
        }
      }
    }
  }
}
</style>
