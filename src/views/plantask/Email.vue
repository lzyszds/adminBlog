<script setup lang="ts">
import { getEmailTaskConfig, updateEmailTaskConfig } from "@/api/plantask";
import { EmailTaskData } from "@/types/plantask";
import { setMession } from "@/utils/utils";
import { FormInstance, FormRules } from "element-plus";
const { data } = await getEmailTaskConfig<EmailTaskData>();
console.log(data);
const ruleFormRef = ref();
const ruleForm = reactive<EmailTaskData>({
  auth_pass: "",
  content: "",
  myEmail: "",
  myName: "",
  planTime: "",
  service: "",
  subject: "",
  toEmail: "",
});

for (let key in data) {
  ruleForm[key] = data[key];
}

const rules = reactive<FormRules>({
  auth_pass: [{ required: true, message: "请输入授权码", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
  myEmail: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  myName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  planTime: [{ required: true, message: "请输入计划时间", trigger: "blur" }],
  service: [{ required: true, message: "请输入服务", trigger: "blur" }],
  subject: [{ required: true, message: "请输入主题", trigger: "blur" }],
  toEmail: [{ required: true, message: "请输入收件人", trigger: "blur" }],
});

const planTimeOption = [
  { value: "0 55 22 * * *", label: "每天晚上10点55分" },
  { value: "0 0 0 * * *", label: "每天凌晨0点" },
  { value: "0 0 0 1 * *", label: "每月1号凌晨0点" },
  { value: "0 0 0 1 1 *", label: "每年1月1号凌晨0点" },
  { value: "0 0 0 1 1 1", label: "每年1月1号凌晨0点1分" },
];

// const ruleForm = reactive(data);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, _fields) => {
    if (valid) {
      updateEmailTaskConfig(ruleForm).then((res) => {
        if (res.code === 200) {
          setMession("success", "更新计划成功");
        }
      });
    } else {
      setMession("error", "更新计划失败");
    }
  });
};
// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <ElForm
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    status-icon
  >
    <ElFormItem label="授权码" prop="auth_pass">
      <ElInput v-model="ruleForm.auth_pass" placeholder="请输入授权码"></ElInput>
    </ElFormItem>
    <ElFormItem label="邮箱" prop="myEmail">
      <ElInput v-model="ruleForm.myEmail" placeholder="请输入邮箱"></ElInput>
    </ElFormItem>
    <ElFormItem label="姓名" prop="myName">
      <ElInput v-model="ruleForm.myName" placeholder="请输入姓名"></ElInput>
    </ElFormItem>
    <ElFormItem label="计划时间" prop="planTime">
      <el-select
        v-model="ruleForm.planTime"
        filterable
        allow-create
        default-first-option
        :reserve-keyword="false"
        placeholder="Choose tags for your article"
      >
        <el-option
          v-for="item in planTimeOption"
          :key="item.value"
          :label="'时间:' + item.label + '——————————' + item.value"
          :value="item.value"
        />
      </el-select>
    </ElFormItem>
    <ElFormItem label="服务" prop="service">
      <ElInput v-model="ruleForm.service" placeholder="请输入服务"></ElInput>
    </ElFormItem>
    <ElFormItem label="主题" prop="subject">
      <ElInput v-model="ruleForm.subject" placeholder="请输入主题"></ElInput>
    </ElFormItem>
    <ElFormItem label="收件人" prop="toEmail">
      <ElInput v-model="ruleForm.toEmail" placeholder="请输入收件人"></ElInput>
    </ElFormItem>
    <ElFormItem label="内容" prop="content">
      <ElInput
        type="textarea"
        v-model="ruleForm.content"
        placeholder="请输入内容"
        :rows="16"
        style="min-width: 50vw"
      ></ElInput>
    </ElFormItem>

    <ElFormItem>
      <ElButton type="primary" @click="submitForm(ruleFormRef)">提交</ElButton>
      <ElButton @click="resetForm(ruleFormRef)">重置</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<style lang="scss" scoped>
.demo-ruleForm {
  max-width: 100vw;
  height: calc(100vh - 180px);
  overflow-y: auto;
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: center;
    .el-input__suffix {
      color: var(--themeColor);
    }
  }
  .el-button {
    margin-top: 20px;
    width: 200px;
  }
}
</style>
