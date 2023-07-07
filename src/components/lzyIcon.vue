<script setup lang='ts' name="lzyIcon">
import { Icon } from '@iconify/vue';
const props = defineProps<{
  name: string,
  height?: string
}>()
</script>

<template>
  <Icon :icon="name" width="20px" :height="props.height"></Icon>
</template>

<style lang='scss' scoped>
</style>
 