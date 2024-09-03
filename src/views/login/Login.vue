<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useThrottleFn } from "@vueuse/core";
import { getIpWeather } from "@/utils/utils";
import { NowWeatherData } from "@/types/NowWeatherData";

import { show } from "@/utils/loading";

import { dayjs } from "element-plus";
import http from "@/http";
import { useRouter } from "vue-router";
const router = useRouter();
//进入页面先判断是否登陆着,localStorage.getItem('token')是登陆时候存的token
if (localStorage.getItem("lzy_token")) {
  //路由重定向
  router.replace("/");
}
const tipsText = ref("");
const load = ref(false);

const cardWH = ref("100%");

// 表单验证 需要捆绑的ref项，需要验证的表单项
const ruleFormRef = ref<FormInstance>();
// 账号密码数据，用于提交
const ruleForm = reactive({
  username: "",
  password: "",
  email: "",
  code: "",
});
// 表单验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 16, message: "账号长度应该是6到16", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "密码长度应该是6到16", trigger: "blur" },
  ],
});
const submitForm = useThrottleFn(async (formEl: FormInstance | undefined) => {
  try {
    tipsText.value = "";
    load.value = true;
    setTimeout(() => {
      load.value = false;
    }, 2000);
    // fromtool 防止重复提交 以及 按钮提交之后样式
    if (!formEl) return;
    formEl.validate(async (valid, fields) => {
      if (valid) {
        const res = await http<string>({
          url: "/user/login",
          method: "post",
          data: ruleForm,
        });
        setTimeout(() => {
          if (res.code === 200) {
            show();
            localStorage.setItem("lzy_token", res.data);
            //设置cookie，cookie过期时间为14天，如果过期则需要重新登陆，销毁localStorage中token
            const date14: any = dayjs().add(7, "day");
            const date = date14.diff(dayjs(), "day");
            document.cookie = `token_remderDay=${date};expires=${date14};path=/`;
            //获取ip天气 用于首页展示
            const weather = getIpWeather() as Promise<NowWeatherData>;
            weather.then((res) => {
              //将个人信息存入localStorage，避免每次刷新都要请求接口
              localStorage.setItem("nowWeatherData", JSON.stringify(res));
              router.push("/");
            });
          } else {
            tipsText.value = "账号或密码错误";
          }
        }, 2000);
      } else {
        console.log("error submit!", fields);
      }
    });
  } catch (e) {
    console.error(e);
  }
}, 1000);
setTimeout(() => {
  cardWH.value = "80%";
}, 50);
</script>

<template>
  <div class="login">
    <div class="card" :style="['width:' + cardWH, 'height:' + cardWH]">
      <div class="item center" :class="{ loadBtn: load }">
        <ElForm
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          class="demo-ruleForm"
          status-icon
        >
          <p class="title">欢迎登陆</p>
          <ElFormItem prop="username">
            <ElInput
              @keydown.enter="submitForm(ruleFormRef)"
              class="input"
              v-model="ruleForm.username"
            >
              <template #prepend>账号</template>
            </ElInput>
          </ElFormItem>
          <ElFormItem prop="password">
            <ElInput
              @keydown.enter="submitForm(ruleFormRef)"
              class="input"
              type="password"
              v-model="ruleForm.password"
              show-password
            >
              <template #prepend>密码</template>
            </ElInput>
          </ElFormItem>

          <ElFormItem style="margin: 0">
            <ElButton
              type="primary"
              style="margin-top: 10px"
              @click="submitForm(ruleFormRef)"
            >
              <LzyIcon
                name="majesticons:scan-fingerprint-line"
                style="margin-right: 5px"
              ></LzyIcon>
              <span class="spanTEXT">登陆</span>
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>
      <div class="illustartion">
        <img :src="'/adminPublic/img/loginCover.png'" alt="logo" />
      </div>
      <p class="pwdTips" :class="{ error: tipsText.length }">{{ tipsText }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;

  // background: url("@/assets/image/login/dark-l1.png") center; //var(--themeColor);
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45vw;
    height: 45vw;
    border-radius: 50%;
    // background: #FFFCF5;
    background: url("/adminPublic/img/moon.png") no-repeat center;
    background-size: 120%;
    border: 5px solid #000;
    z-index: -1;
  }

  .card {
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    box-shadow: 0 1px 8px 10px rgba(0, 0, 0, 0.2);
    transition: 0.6s;
    display: grid;
    grid-template-columns: 0.5fr 1fr;
    justify-content: center;
    align-items: center;
    font-family: "almama";
    overflow: hidden;
    border: 10px solid #000;

    &:focus-within {
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1),
        0px -30px 4px -10px rgba(255, 255, 255, 0.3),
        0px -60px 4px -20px rgba(255, 255, 255, 0.2),
        0px -90px 4px -30px rgba(255, 255, 255, 0.1);
    }

    .illustartion {
      text-align: center;

      img {
        width: 600px;
        position: absolute;
        right: 10%;
        bottom: -20%;
      }
    }

    .item {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      &.loadBtn {
        &:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 8px;
          width: 100%;
          background: #3fefef;
          border-radius: 8px;
          filter: drop-shadow(0 0 20px #3fefef) drop-shadow(0 0 60px #3fefef);
          animation: animate_line 2s ease-in-out infinite;
        }
      }

      &.top {
        height: 40%;

        p {
          font-size: 40px;
          font-weight: 600;
          color: #000;
          flex: 3;
        }

        img {
          flex: 1;
          width: 100px;
          height: 75px;
          margin-left: 45px;
        }
      }

      &.center {
        padding: 20px 20px 0;
        margin-top: 10px;

        :deep(.el-form) {
          width: 55%;

          p.title {
            font-size: 40px;
            font-weight: 600;
            color: var(--themeColor);
            flex: 3;
          }

          .el-form-item {
            & .el-form-item__content {
              justify-content: center;
            }

            .el-input .el-input__icon {
              color: var(--themeColor);
            }

            &.is-error .el-input__icon {
              color: var(--el-color-danger) !important;
            }

            .el-form-item__error {
              user-select: none;
            }

            .el-input-group__prepend {
              background-color: var(--themeColor);
              box-shadow: none;
              border: 1px solid var(--themeColor);
              border-radius: 15px 0 0 15px;
              color: #fff;
              user-select: none;
              transition: 0.6s;
            }

            .el-input__wrapper {
              box-shadow: none;
              border: 1px solid var(--themeColor);
              border-left: transparent;
              border-radius: 0 15px 15px 0;

              input {
                font-weight: 600;
                font-family: "firaCode";
                color: #000;
              }
            }

            .yzm .el-input__wrapper {
              border-radius: 0;
              border: 1px solid var(--themeColor);
              border-right: transparent;
            }

            .el-input-group__append {
              padding: 0px 15px 0px 10px;
              border-radius: 0 15px 15px 0;
              border: 1px solid var(--themeColor);
              background: #fff;

              &:hover {
                color: var(--themeColor);
              }
            }

            .ElButton {
              text-align: center;
              margin: 20px 10px 0;
              font-size: 16px;
              width: 100%;
              line-height: 34px;
              height: 35px;
              background-color: var(--themeColor);
              display: flex;
              overflow: hidden;
              border: none;
            }
          }
        }
      }
    }

    .pwdTips {
      color: #000;
      font-size: 14px;
      font-weight: 600;
      user-select: none;
      position: absolute;
      bottom: 0;

      &.error {
        animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }
    }
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

@keyframes animate_line {
  0%,
  100% {
    top: 0;
  }

  50% {
    top: 100%;
  }
}
</style>
