<script setup lang="ts" name="lzyIcon">
import { Icon } from "@iconify/vue";

interface Props {
  name: string;
  height?: string;
  style?: string | Object;
}

const props = defineProps<Props>();
</script>

<template>
  <Icon
    class="LzyIcon"
    :icon="name"
    :width="props.height ?? '20px'"
    :height="props.height ?? '20px'"
    :style="props.style"
  ></Icon>
</template>

<style lang="scss" scoped>
.LzyIcon {
  cursor: pointer;
  vertical-align: text-bottom;
}
</style>
