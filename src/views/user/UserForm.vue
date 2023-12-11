<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import http from '@/http/http';
const emit = defineEmits(['switchMod'])
const props = defineProps({
  type: String,
  data: Object,
})
// const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

const ruleForm: any = ref()
//修改
if (props.type == 'modify') {
  ruleForm.value = {
    headImg: 'http://localhost:8089/public' + props.data?.headImg,
    name: props.data?.uname,
    username: props.data?.username,
    password: props.data?.password,
    power: props.data?.power,
    date: props.data?.createDate,
    uid: props.data?.uid,
    perSign: props.data?.perSign,
  }
} else {
  //新增
  ruleForm.value = {
    headImg: 'http://localhost:8089/public/img/updateImg/put7.webp',
    name: '',
    username: '',
    password: '',
    power: 'user',
    date: Date.now(),
    perSign: '什么都不留吗?'
  }
}
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '名称不能为空,请输入名称', trigger: 'blur' },
    { min: 3, max: 16, message: '名称要求不符合(3-16位)', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '账号名不能为空,请输入账号名', trigger: 'blur' },
    { min: 3, max: 16, message: '账号名要求不符合(3-16位)', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空,请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码要求不符合(6-16位)', trigger: 'blur' },
  ],
})

const operateUser = async () => {
  const isAdd = props.type == 'add'
  if (isAdd) {
    ruleForm.value.headImg = ruleForm.value.headImg.replace('http://localhost:8089/public', '');
  }
  try {
    await http('post', isAdd ? '/privateApis/addUserLzy' : '/privateApis/updateUserLzy', ruleForm.value)
    emit('switchMod', false, isAdd ? '用户添加成功' : '用户修改成功')
  } catch (e) {
    emit('switchMod', false, isAdd ? '用户添加失败' : '用户修改失败')
  }
}

//提交表单入后台
const submitForm = async (formInstance: FormInstance | undefined) => {
  if (!formInstance) return
  await formInstance.validate(async (valid, fields) => {
    if (valid) {
      await operateUser()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formInstance: FormInstance | undefined) => {
  if (!formInstance) return
  formInstance.resetFields()
}

const handleExceed = async () => {
  ruleForm.value.headImg = "http://localhost:8089/public/img/load.gif";
  // 给随机图片添加时间戳 防止缓存 保证每次都是新的图片
  const { data } = await http<string>('get', '/overtApis/getRandHeadImg')
  ruleForm.value.headImg = "http://localhost:8089/public" + data;
}
const messagetxt = ref('limit 1 file, new file will cover the old file')
const upClick = () => {
  const file = document.getElementById('xFile') as HTMLInputElement
  file.click()
}

//头像上传按钮 逻辑块
const submitUpload = () => {
  const xFile: any = document.getElementById('xFile') as HTMLInputElement
  let reader = new FileReader();
  reader.readAsDataURL(xFile.files[0]);
  reader.onload = async function () {
    //e代表事件,可以通过e.target获取FileReader对象然后在获取readAsDataURL读取的base64字符
    //下面是将blob转换为file 用于上传
    let formData = new FormData();
    formData.append('headImg', xFile.files[0]);
    let headers = {
      'Content-Type': 'multipart/form-data',
    }
    //给后台上传头像图片，并获取后台返回新的图片地址
    const res = await http('post', '/privateApis/uploadHead', formData, headers)
    if (res.code === 200) {
      // const objectURL = URL.createObjectURL(blob);
      ruleForm.value.headImg = res.data;//显示的头像blob转化为可图片显示的src
      // ruleForm.value.setHeadImg = res.message; //放入数据库中的图片路径
      messagetxt.value = 'limit 1 file, new file will cover the old file'
    } else {
      messagetxt.value = res.msg!
    }
  }
}
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm" size="default"
    status-icon>
    <!-- 修改用户信息标签 -->
    <div class="headelement">
      <el-avatar v-ImgLoading :size="100" :src="ruleForm.headImg">
      </el-avatar>
      <div class="upload-demo">
        <div class="fileBtn">
          <div class="fileUpload">
            <label class="ui_button ui_button_primary" for="xFile">
              <el-button type="primary" @click="upClick">上传本地</el-button>
            </label>
            <form action="" method="post">
              <input class="fileInput" name="headImg" type="file" @change="submitUpload" id="xFile" />
            </form>

          </div>
          <el-button class="recommended" @click="handleExceed"> 系统推荐 </el-button>
        </div>
        <div class="el-upload__tip text-red" :class="{ grey: messagetxt.indexOf('limit') != -1 }">
          {{ messagetxt }}
        </div>
      </div>
    </div>
    <el-form-item label="Name(名称)" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="UserName(账号)" prop="username">
      <el-input v-model="ruleForm.username" />
    </el-form-item>
    <el-form-item label="PassWord(密码)" prop="password">
      <el-input v-model="ruleForm.password" type="password" show-password />
    </el-form-item>
    <el-form-item label="power(权限)" prop="power">
      <el-select style="width: 100%;" v-model="ruleForm.power" placeholder="Activity power">
        <el-option label="admin" value="admin" />
        <el-option label="user" value="user" />
      </el-select>
    </el-form-item>
    <el-form-item label="create(创建)" prop="date">
      <el-date-picker style="width: 100%;" v-model="ruleForm.date" type="date" placeholder="Pick a day" disabled />
    </el-form-item>
    <el-form-item class="pertextarea" style="flex-direction: column;" prop="delivery">
      <el-input v-model="ruleForm.perSign" :autosize="{ minRows: 4, maxRows: 4 }" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button class="card-button" type="primary" @click="submitForm(ruleFormRef)">Create</el-button>
      <el-button class="card-button" @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="less" scoped>
.demo-ruleForm {
  :deep(.el-form-item__label) {
    flex-direction: row-reverse;
    gap: 10px;
    padding: 0
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
