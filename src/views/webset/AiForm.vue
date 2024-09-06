<script setup lang="ts">
import { setAiKey } from "@/api/openAi";
import { setMession } from "@/utils/utils";
const emit = defineEmits(["switchMod"]);

const form = reactive({
  keyName: "",
  keyValue: "",
});

const submit = () => {
  setAiKey({
    keyName: form.keyName,
    keyValue: form.keyValue,
  }).then((res) => {
    setMession(res.code == 200 ? "success" : "error", res.msg!);
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
      font-family: "Red Hat Display";
    }
  }
  button {
    width: 50%;
    margin: 0 auto;
  }
}
</style>
