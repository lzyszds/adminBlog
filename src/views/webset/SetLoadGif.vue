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
  border: 3px solid var(--themeColor);
  border-radius: 10px;
  padding: 15px;
  position: relative;
  overflow-y: auto;

  &::before {
    content: "图片懒加载动画选择";
    display: block;
    clear: both;
    position: absolute;
    z-index: 99;
    top: 0px;
    left: 5px;
    background-color: #fff;
    padding: 0 5px;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .loadGifList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;

    .loadGifItem {
      img {
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: 10px;
        cursor: pointer;
        border: 2px solid transparent;
      }
      &:hover {
        img {
          filter: blur(0);
        }
      }
      &.active {
        img {
          filter: blur(0);
          border: 2px solid var(--themeColor);
        }
      }
    }
  }
}
</style>
