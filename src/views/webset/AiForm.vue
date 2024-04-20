<script setup lang="ts">
import { ElNotification } from "element-plus";
const emit = defineEmits(["switchMod"]);

const { $axios } = window;
const form = reactive({
  keyName: "",
  keyValue: "",
});

const submit = () => {
  $axios({
    url: "/aiService/addAiKey",
    method: "post",
    data: {
      keyName: form.keyName,
      keyValue: form.keyValue,
    },
  }).then((res) => {
    ElNotification({
      title: "成功",
      message: "添加成功",
      type: "success",
    });
    emit("switchMod", false, "isAdd");
  });
};
</script>

<template>
  <div class="aiForm">
    <p><span>keyName:</span><ElInput v-model="form.keyName" /></p>
    <p><span>keyValue:</span><ElInput v-model="form.keyValue" /></p>

    <ElButton type="primary" @click="submit">提交</ElButton>
  </div>
</template>

<style lang="scss" scoped>
.aiForm {
  padding: 20px;
  display: grid;
  justify-content: center;
  gap: 30px;
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    height: 30px;
    span {
      width: 100px;
      text-align: left;
      margin-right: 10px;
      background-color: var(--themeColor);
      border-radius: 10px;
      padding: 6px 10px;
      color: #fff;
      font-family: "dindin";
    }
  }
  button {
    width: 50%;
    margin: 0 auto;
  }
}
</style>
