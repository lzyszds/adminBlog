<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElNotification, FormInstance, FormRules } from "element-plus";
const emit = defineEmits(["switchMod"]);
const props = defineProps({
  type: String,
  data: Object,
});

const { $axios } = window;

// const formSize = ref('default')
const ruleFormRef = ref<FormInstance>();

const backupsData = { ...props.data };

const ruleForm: any = ref();
//修改
if (props.type == "modify") {
  ruleForm.value = {
    head_img: props.data?.head_img,
    uname: props.data?.uname,
    username: props.data?.username,
    password: "",
    power: props.data?.power,
    create_date: props.data?.create_date,
    uid: props.data?.uid,
    signature: props.data?.signature,
  };
} else {
  //新增
  ruleForm.value = {
    head_img: "",
    uname: "",
    username: "",
    password: "",
    power: 1,
    create_date: Date.now(),
    signature: "什么都不留吗?",
  };
}
const rules = reactive<FormRules>({
  uname: [
    { required: true, message: "名称不能为空,请输入名称", trigger: "blur" },
    { min: 3, max: 16, message: "名称要求不符合(3-16位)", trigger: "blur" },
  ],
  username: [
    { required: true, message: "账号名不能为空,请输入账号名", trigger: "blur" },
    { min: 3, max: 16, message: "账号名要求不符合(3-16位)", trigger: "blur" },
  ],
  password: [
    { required: true, message: "密码不能为空,请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "密码要求不符合(6-16位)", trigger: "blur" },
  ],
});

const operateUser = async () => {
  const isAdd = props.type == "add";
  //找出修改的数据 与原数据对比
  const diffData = Object.keys(ruleForm.value).reduce((diff, key) => {
    if (key == "uid") {
      diff[key] = ruleForm.value[key];
    } else if (ruleForm.value[key] !== backupsData[key]) {
      if (key == "password" && ruleForm.value[key] == "") return diff;
      diff[key] = ruleForm.value[key];
    }
    return diff;
  }, {});

  try {
    const res = await $axios({
      url: isAdd ? "/user/addUser" : "/user/updateUser",
      method: "post",
      data: diffData,
    });
    if (res.code === 200) {
      ElNotification({
        title: "成功",
        message: isAdd ? "用户添加成功" : "用户修改成功",
        type: "success",
      });
      emit("switchMod", false, isAdd);
    } else {
      ElNotification({
        title: "失败",
        message: isAdd ? "用户添加失败" : "用户修改失败",
        type: "error",
      });
      emit("switchMod", true, isAdd);
    }
  } catch (e) {
    ElNotification({
      title: "失败",
      message: isAdd ? "用户添加失败" : "用户修改失败",
      type: "error",
    });
    emit("switchMod", true, isAdd);
  }
};

//提交表单入后台
const submitForm = async (formInstance: FormInstance | undefined) => {
  if (!formInstance) return;
  await formInstance.validate(async (valid, fields) => {
    if (valid) {
      await operateUser();
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formInstance: FormInstance | undefined) => {
  if (!formInstance) return;
  formInstance.resetFields();
};

var timer;
const handleExceed = async () => {
  timer = true;
  ruleForm.value.head_img = "/img/load.gif";
  // 给随机图片添加时间戳 防止缓存 保证每次都是新的图片
  const { data } = await $axios({
    url: "/user/getRandHeadImg",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      time: Date.now(),
    },
  });
  ruleForm.value.head_img = data;
  setTimeout(() => {
    timer = false;
  }, 50);
};
if (props.type == "add") await handleExceed();

const messagetxt = ref("limit 1 file, new file will cover the old file");
const upClick = () => {
  const file = document.getElementById("xFile") as HTMLInputElement;
  file.click();
};

//头像上传按钮 逻辑块
const submitUpload = () => {
  const xFile: any = document.getElementById("xFile") as HTMLInputElement;
  let reader = new FileReader();
  reader.readAsDataURL(xFile.files[0]);
  reader.onload = async function () {
    //e代表事件,可以通过e.target获取FileReader对象然后在获取readAsDataURL读取的base64字符
    //下面是将blob转换为file 用于上传
    let formData = new FormData();
    formData.append("head-img", xFile.files[0]);
    let headers = {
      "Content-Type": "multipart/form-data",
    };
    //给后台上传头像图片，并获取后台返回新的图片地址
    const res = await $axios({
      url: "/user/uploadHead",
      method: "post",
      headers: headers,
      data: formData,
    });
    if (res.code === 200) {
      // const objectURL = URL.createObjectURL(blob);
      ruleForm.value.head_img = res.data; //显示的头像blob转化为可图片显示的src
      // ruleForm.value.sethead_img = res.message; //放入数据库中的图片路径
      messagetxt.value = "limit 1 file, new file will cover the old file";
    } else {
      messagetxt.value = res.msg!;
    }
  };
};
</script>

<template>
  <ElForm
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="140px"
    class="demo-ruleForm"
    size="default"
    status-icon
  >
    <!-- 修改用户信息标签 -->
    <div class="headelement">
      <ElAvatar
        v-ImgLoading
        :size="100"
        :src="'/api/public' + ruleForm.head_img"
      >
      </ElAvatar>
      <div class="upload-demo">
        <div class="fileBtn">
          <div class="fileUpload">
            <label class="ui_button ui_button_primary" for="xFile">
              <ElButton type="primary" @click="upClick">上传本地</ElButton>
            </label>
            <form action="" method="post">
              <input
                class="fileInput"
                name="head-img"
                type="file"
                @change="submitUpload"
                id="xFile"
              />
            </form>
          </div>
          <ElButton class="recommended" @click="handleExceed">
            系统推荐
          </ElButton>
        </div>
        <div
          class="el-upload__tip text-red"
          :class="{ grey: messagetxt.indexOf('limit') != -1 }"
        >
          {{ messagetxt }}
        </div>
      </div>
    </div>
    <ElFormItem label="Name(名称)" prop="uname">
      <ElInput v-model="ruleForm.uname" />
    </ElFormItem>
    <ElFormItem label="UserName(账号)" prop="username">
      <ElInput v-model="ruleForm.username" />
    </ElFormItem>
    <ElFormItem
      label="PassWord(密码)"
      :prop="props.type == 'add' ? 'password' : ''"
    >
      <ElInput
        v-model="ruleForm.password"
        type="password"
        show-password
        placeholder="不填就是不修改密码"
      />
    </ElFormItem>
    <ElFormItem label="power(权限)" prop="power">
      <el-select
        style="width: 100%"
        v-model="ruleForm.power"
        placeholder="Activity power"
      >
        <el-option label="admin" :value="0" />
        <el-option label="user" :value="1" />
      </el-select>
    </ElFormItem>
    <ElFormItem label="create(创建)" prop="date">
      <el-date-picker
        style="width: 100%"
        v-model="ruleForm.create_date"
        type="date"
        placeholder="Pick a day"
        disabled
      />
    </ElFormItem>
    <ElFormItem
      class="pertextarea"
      style="flex-direction: column"
      prop="delivery"
    >
      <ElInput
        v-model="ruleForm.signature"
        :autosize="{ minRows: 4, maxRows: 4 }"
        type="textarea"
      />
    </ElFormItem>
    <ElFormItem>
      <ElButton
        class="card-button"
        type="primary"
        @click="submitForm(ruleFormRef)"
        >Create</ElButton
      >
      <ElButton class="card-button" @click="resetForm(ruleFormRef)"
        >Reset</ElButton
      >
    </ElFormItem>
  </ElForm>
</template>

<style lang="scss" scoped>
.demo-ruleForm {
  :deep(.el-form-item__label) {
    flex-direction: row-reverse;
    gap: 10px;
    padding: 0;
  }

  :deep(textarea) {
    resize: none;
    border: 2px solid transparent;

    &:focus {
      box-shadow: none;
      border: 2px solid var(--themeColor);
    }
  }

  :deep(.el-form-item--default) {
    margin-bottom: 15px;
  }
}

.pertextarea {
  :deep(.el-form-item__content) {
    margin: 0 !important;
    border: 1px solid var(--themeColor);
    border-radius: 5px;
  }
}

.headelement {
  text-align: center;

  :deep(.el-form-item__content) {
    display: block;
  }

  .text-red {
    margin-bottom: 20px;
    color: #f56c6c;

    &.grey {
      color: #606266;
    }
  }

  .fileBtn {
    display: flex;
    justify-content: center;
    align-items: center;

    button {
      height: 27px;
    }

    .fileUpload {
      width: 85px;
      position: relative;
      overflow: hidden;
      background-color: #f56c6c;
      border-radius: 5px;

      button {
        background: transparent;
        border: none;
      }

      .ui_button {
        cursor: var(--linkCup) !important;
      }

      .fileInput {
        position: absolute;
        top: 0;
        left: 0;
        cursor: var(--linkCup) !important;
        display: none;
      }
    }

    :deep(.recommended) {
      margin-left: 10px;
      background-color: var(--themeColor);
      border: none;
      color: #fff;
    }
  }

  .el-form-item--default .el-form-item__label {
    flex-direction: row-reverse;
  }
}
</style>
