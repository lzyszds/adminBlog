<script setup lang='ts'>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import http from '@/http/http';
import load from '@/uiComponents/loader/loadings'
import { NowWeatherData, IWeather } from '@/types/nowWeatherData';
interface Props {
  currentView: string
}

const emit = defineEmits(['componentName'])
const props = defineProps<Props>()
const router = useRouter()

const datalist = ref<IWeather>() //天气数据
const cip = ref<string>() //ip
// data:天气数据   cid:城市id 
const weather: NowWeatherData = JSON.parse(localStorage.getItem("nowWeatherData")!)
//获取请求天气的数据
datalist.value = weather.weatherData
datalist.value!.region = weather.region
cip.value = weather.ip

type Items = {
  name: string;
  uicon: string;
  component: string;
}[]

//左侧菜单栏
const items: Items = [
  {
    name: '用户管理',
    uicon: '<i class="iconfont">&#xe612;</i>',
    component: 'User'
  },
  {
    name: '文章管理',
    uicon: '<i class="iconfont">&#xe606;</i>',
    component: 'Article'
  },
  {
    name: '评论管理',
    uicon: '<i class="iconfont">&#xe607;</i>',
    component: 'Comment'
  },
  {
    name: '分类管理',
    uicon: '<i class="iconfont">&#xe60e;</i>',
    component: '/categoryAdmin'
  },
  {
    name: '标签管理',
    uicon: '<i class="iconfont">&#xe64d;</i>',
    component: '/tagAdmin'
  },
  {
    name: '友链管理',
    uicon: '<i class="iconfont">&#xe609;</i>',
    component: '/linkAdmin'
  },
  {
    name: '网站设置',
    uicon: '<i class="iconfont">&#xe60a;</i>',
    component: '/settingAdmin'
  }, {
    name: '退出登陆',
    uicon: '<i class="iconfont">&#xe60b;</i>',
    component: '/login'
  },
  {
    name: '返回首页',
    uicon: '<i class="iconfont">&#xe60b;</i>',
    component: '/home/index'
  },
]

const activeIndex = ref(0)
//判断当前激活的组件，设置左侧菜单栏的激活状态
items.forEach((item, index) => {
  if (item.component === props.currentView) {
    activeIndex.value = index
  }
})
//点击左侧菜单栏，切换组件
const changeComponent = async (index) => {
  activeIndex.value = index
  // await load.show('#content')
  emit('componentName', items[index].component)
}

//处理用户详情数据
const infoData: any = ref()
const data: any = []
const res = await http('get', '/overtApis/getUserInfo') as any// httpData
//检验token是存在 401是token过期
if (res.code == 401) {
  // 销毁token
  localStorage.removeItem('lzy_token')
  router.push('/login')
}
data.push(res.data)
//处理用户签名
if (data[0].perSign) {
  data.perSign = data[0].perSign.replace(',', '#,~').split('#,~')
  data.perSign = data[0].perSign ? data.perSign : '这个人很懒，什么都没留下'
} else {
  data.perSign = ['这个人很懒', '什么都没留下']
}

infoData.value = data
</script>

<template>
  <div class="setleft">
    <div class="logo"> Lzyszds </div>
    <div class="userinfo">
      <div class="headPortrait"><img :src="'http://localhost:8089/public' + infoData[0].headImg" alt=""> </div>
      <h3>{{ infoData[0].uname }}</h3>
      <p>「{{ infoData.perSign[0] }}」</p>
      <p>{{ infoData.perSign[1] }}</p>
      <!-- <p class="essCount">
        <lzyIcon :name="`icon-youxiang`" :fill="`#5161ce`"></lzyIcon>
        <span>17</span>
      </p> -->
    </div>
    <div class="list">
      <div class="list_item" v-for="(item, index) in items" :key="index" @click="changeComponent(index)"
        :class="{ 'active': activeIndex == index }">
        <span v-html="item.uicon"></span>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="footer">
      <div class="time">
        <p class="weacher">
          <el-tooltip class="box-item" effect="lzy_dark"
            :content="`湿度：${datalist?.humidity}%RH 风向：${datalist?.windDirection} 降水量：${datalist?.rainfall}mm`"
            placement="top">
            <span>{{ datalist?.region }} {{ datalist?.weather }} 室外温度：{{ datalist?.temperature }}℃ </span>
          </el-tooltip>

          <!-- <span>湿度：{{ datalist?.humidity }}%RH</span> -->
        </p>
        <a :href="cip">IP: {{ cip }}</a>
      </div>
      <div>
        <p>© 2022 Lzyszds</p>
        <p>Powered by Ts + Vue3 + Vite + ElementPlus</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.setleft {
  position: relative;
  height: 100%;

  .logo {
    padding-top: 30px;
    color: #000;
    font-family: 'almama';
    font-size: 40px;
    text-align: center;
  }

  .userinfo {
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
        content: '';
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
      font-family: 'almama';
      margin: 0px 0;
    }

    p {
      font-size: 9px;
      color: #999;
      font-weight: 600;
      font-family: 'almama';
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
      cursor: pointer;
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
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 100%;
        transition: .3s;
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
        font-family: 'dindin';
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
    font-family: 'almama';
    font-size: 8px;

    .time {
      color: var(--themeColor);

      .weacher {
        span {
          margin-right: 10px;
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
@/types/NowWeatherData
