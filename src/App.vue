<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
onMounted(() => {
  !localStorage.getItem("lzy_token") && router.push("/login");
});
</script>
<template>
  <Suspense>
    <router-view />
  </Suspense>
</template>

<style lang="scss">
@import url("@/assets/css/admin.scss");
</style>
