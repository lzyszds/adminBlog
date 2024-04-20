<script setup lang="ts">
interface Props {
  name: string;
  title?: string;
  tipsContent?: string;
  position?: "top" | "right" | "left" | "bottom" | "center";
}
const props = defineProps<Props>();
</script>

<template>
  <button class="button">
    <LzyIcon :name="props.name" :style="{ 'vertical-align': '-5px' }" />
    <span>{{ props.title }}</span>
    <span
      v-if="props.tipsContent"
      :class="['tips', props.position ? props.position : 'bottom']"
    >
      {{ props.tipsContent }}
    </span>
  </button>
</template>

<style lang="scss" scoped>
.button {
  position: relative;
  padding: 5px 12px;
  border-radius: 6px;
  line-height: 20px;
  border: none;
  color: #fff;
  cursor: pointer;
  background-color: var(--plyr-color-main);
  transition: all 0.2s ease;
  &:active {
    transform: scale(0.96);
  }
  &:hover .tips {
    opacity: 1;
    width: 100%;
    z-index: 999;
    &.bottom {
      top: 110%;
      left: 50%;
      transform: translateX(-50%);
    }
    &.center {
      width: auto;
      line-height: normal;
    }
    &.top {
      left: 50%;
      padding: 0 10px;
      top: -25px;
      transform: translateX(-50%);
    }
    &.left {
      left: -50px;
      top: 50%;
      transform: translateY(-50%);
    }
    &.right {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .tips {
    opacity: 0;
    padding: 0 10px;
    border-radius: 3px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    font-family: "dindin";
    background-color: var(--plyr-color-main);
    position: absolute;
    top: 0;
    left: 0;
    transition: 0.06s;
  }
}
</style>
