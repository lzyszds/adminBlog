<script setup lang="ts">
import http from "@/http/http";
import { hide } from "@/utils/loading";
import { NowWeatherData, IWeather } from "@/types/nowWeatherData";
import { useRouter } from "vue-router";
const router = useRouter();
const historyRouter = useSessionStorage("historyRouter", "System"); // returns Ref<number>
//左侧菜单栏
const items: Items[] = [
  {
    name: "欢迎使用",
    uicon: '<i class="iconfont">&#xe608;</i>',
    component: "System",
  },
  {
    name: "用户管理",
    uicon: '<i class="iconfont">&#xe612;</i>',
    component: "User",
  },
  {
    name: "文章管理",
    uicon: '<i class="iconfont">&#xe606;</i>',
    component: "Article",
  },
  {
    name: "评论管理",
    uicon: '<i class="iconfont">&#xe607;</i>',
    component: "Comment",
  },
  {
    name: "分类管理",
    uicon: '<i class="iconfont">&#xe60e;</i>',
    component: "Category",
  },
  {
    name: "邮箱消息",
    uicon: '<i class="iconfont">&#xe64d;</i>',
    component: "EmailMessage",
  },
  {
    name: "友链管理",
    uicon: '<i class="iconfont">&#xe609;</i>',
    component: "LinkControl",
  },
  {
    name: "AiK 配置",
    uicon: '<i class="iconfont">&#xe60a;</i>',
    component: "Ai",
  },
  {
    name: "网站设置",
    uicon: '<i class="iconfont">&#xe60a;</i>',
    component: "WebSet",
  },
  {
    name: "退出登陆",
    uicon: '<i class="iconfont">&#xe60b;</i>',
    handle: () => {
      localStorage.removeItem("lzy_token");
      localStorage.removeItem("nowWeatherData");
      router.push("/login");
    },
  },
  {
    name: "前往首页",
    uicon: '<i class="iconfont">&#xe60b;</i>',
    component: "Home",
  },
];

const datalist = ref<IWeather>(); //天气数据
const cip = ref<string>(); //ip
// data:天气数据   cid:城市id
const weather: NowWeatherData = JSON.parse(
  localStorage.getItem("nowWeatherData")!
) as NowWeatherData;

//获取请求天气的数据
if (weather) {
  datalist.value = weather.weatherData || {};
  datalist.value.region = weather.region;
  cip.value = weather.ip;
}

type Items = {
  name: string;
  uicon: string;
  component?: string;
  handle?: () => void;
};

//点击左侧菜单栏，切换组件
const changeComponent = async (item: Items) => {
  if (item.handle) {
    item.handle();
    return;
  } else {
    historyRouter.value = item.component!;
  }
};

//处理用户详情数据
const infoData: any = ref();
let data: any = [];
const res = (await http({
  url: "/user/getUserInfoToken",
  method: "get",
})) as any; // httpData
hide();
data = res.data;
//处理用户签名
if (data.signature) {
  if (data.signature.indexOf(",") == -1)
    data.signature = data.signature.split("，");
  else
    data.signature = data.signature
      ? data.signature.split(",")
      : "这个人很懒，什么都没留下";
} else {
  data.signature = ["这个人很懒", "什么都没留下"];
}

infoData.value = data;
</script>

<template>
  <div class="setleft">
    <div class="logo">Lzyszds</div>
    <div class="userinfo">
      <div class="headPortrait">
        <img :src="'/api/public' + infoData.head_img" alt="" />
      </div>
      <h3>{{ infoData.uname }}</h3>
      <p v-for="(item, index) in infoData.signature" :key="index">
        「{{ item }} 」
      </p>

      <!-- <p class="essCount">
        <lzyIcon :name="`icon-youxiang`" :fill="`#5161ce`"></lzyIcon>
        <span>17</span>
      </p> -->
    </div>
    <div class="list">
      <div
        class="list_item"
        v-for="(item, index) in items"
        :key="index"
        @click="changeComponent(item)"
        :class="{
          active: historyRouter == item.component,
          animate__rubberBand: historyRouter == item.component,
        }"
      >
        <span v-html="item.uicon"></span>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="footer">
      <!-- <div class="time">
        <p class="weacher">
          <el-tooltip class="box-item" effect="lzy_dark"
            :content="`湿度：${datalist?.humidity}%RH 风向：${datalist?.windDirection} 降水量：${datalist?.rainfall}mm`"
            placement="top">
            <span>
              <span>{{ datalist?.region }} {{ datalist?.weather }} 室外温度：{{
                datalist?.temperature
              }}℃</span>
              <span>
                <LzyIcon name="wi:night-alt-cloudy"></LzyIcon>
              </span>
            </span>
          </el-tooltip>
        </p>
        <a :href="cip">IP: {{ cip }}</a>
      </div> -->
      <div>
        <p>©2022 Lzyszds</p>
        <p>Powered by Ts + Vue3 + Vite + ElementPlus</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setleft {
  position: relative;
  height: 100%;

  .logo {
    padding-top: 30px;
    color: #000;
    font-family: "almama";
    font-size: 40px;
    text-align: center;
  }

  .userinfo {
    transition: 0.5s all;

    text-align: center;
    width: 330px;

    .headPortrait {
      border-radius: 50%;
      position: relative;

      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 20px auto;
        border: 3px solid #5161ce20;
        padding: 7px;
      }

      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%) rotate(30deg);
        width: 100px;
        height: 100px;
        border: 3px solid transparent;
        border-top: 3px solid var(--themeColor);
        margin: 20px auto;
        padding: 7px;
        border-bottom: 3px solid var(--themeColor);
        border-radius: 50%;
        animation: rotate 8s linear infinite;
      }
    }

    h3 {
      font-size: 20px;
      color: #000;
      font-weight: 600;
      font-family: "almama";
      margin: 0px 0;
    }

    p {
      font-size: 9px;
      color: #999;
      font-weight: 600;
      font-family: "almama";
    }

    .essCount {
      width: 70px;
      padding: 0 10px;
      line-height: 30px;
      text-align: center;
      border-radius: 30px;
      margin: 10px auto 0;
      box-shadow: 0 2px 3px 1px rgba(0, 0, 0, 0.08);
      display: grid;
      grid-template-columns: 1fr 2fr;
      align-items: center;
      border: 1px solid #eee;

      svg {
        width: 20px;
        height: 20px;
      }

      span {
        line-height: 35px;
        height: 30px;
        user-select: none;
      }
    }
  }

  .list {
    margin-top: 30px;

    .list_item {
      display: grid;
      grid-template-columns: 7fr 9fr;
      align-items: center;
      padding: 5px 0px;
      cursor: var(--linkCup);
      transition: all 0.5s;
      user-select: none;
      position: relative;

      &:hover {
        background: #f5f5f5;
      }

      &:hover span {
        color: var(--themeColor);
      }

      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 100%;
        transition: 0.3s;
      }

      &.active {
        &:before {
          background: var(--themeColor);
        }

        span {
          color: var(--themeColor);
          -webkit-animation: jello-horizontal 0.9s both;
          animation: jello-horizontal 0.9s both;
        }
      }

      span {
        font-size: 16px;
        color: #000;
        font-weight: 500;
        font-family: "dindin";
      }

      span:nth-child(1) {
        text-align: right;
        padding-right: 20px;
      }
    }
  }

  .footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    text-align: center;
    font-family: "almama";
    font-size: 8px;

    .time {
      color: var(--themeColor);

      .weacher {
        span:nth-child(1) {
          margin-right: 10px;
        }

        .el-tooltip__trigger {
          span {
            &:nth-child(1) {
              display: block;
            }

            &:nth-child(2) {
              display: none;
            }
          }
        }
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: translateX(-50%) rotate(0deg);
  }

  100% {
    transform: translateX(-50%) rotate(360deg);
  }
}

@-webkit-keyframes jello-horizontal {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  30% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }

  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@keyframes jello-horizontal {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  30% {
    -webkit-transform: scale3d(0.75, 1.15, 1);
    transform: scale3d(0.75, 1.15, 1);
  }

  40% {
    -webkit-transform: scale3d(1.15, 0.72, 1);
    transform: scale3d(1.15, 0.72, 1);
  }

  50% {
    -webkit-transform: scale3d(1.05, 0.75, 1);
    transform: scale3d(1.05, 0.75, 1);
  }

  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }

  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
</style>
