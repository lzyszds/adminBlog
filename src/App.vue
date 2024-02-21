<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(() => {
  !localStorage.getItem("lzy_token") && router.push('/login')
})

</script>
<template>
  <Suspense>
    <router-view />
  </Suspense>
</template>

<style lang="less">
@import url('@/assets/css/admin.less');
</style>
