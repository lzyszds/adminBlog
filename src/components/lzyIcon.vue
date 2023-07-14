<script setup lang='ts' name="lzyIcon">
import { Icon } from '@iconify/vue';
const props = defineProps<{
  name: string,
  height?: string,
  style?: string | Object,
}>()
</script>

<template>
  <Icon class="lzyIcon" :icon="name" width="20px" :height="props.height" :style="props.style"></Icon>
</template>

<style lang='less' scoped>
.lzyIcon {
  cursor: pointer;
  vertical-align: text-bottom;
}
</style>
 