<script setup lang='ts' name="lzyIcon">
import { Icon } from '@iconify/vue';

interface Props {
  name: string,
  height?: string,
  style?: string | Object,
}

const props = defineProps<Props>()

</script>

<template>
  <Icon class="lzyIcon" :icon="name" width="20px" :height="props.height ?? '20px'" :style="props.style"></Icon>
</template>

<style lang='less' scoped>
.lzyIcon {
  cursor: var(--linkCup);
  vertical-align: text-bottom;
}
</style>
 