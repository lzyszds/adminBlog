import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common'
import "@fancyapps/ui/dist/fancybox.css";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/base.css'
import '@/assets/css/loading.css';
import 'animate.css';
import '@/assets/css/media.scss';


import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import App from './App.vue'
import router from './router'
import hljsVuePlugin from '@highlightjs/vue-plugin'//代码展示高亮
import { Fancybox, Carousel, Panzoom } from "@fancyapps/ui";//图片放大
import transition from '@/utils/transition'
import { createPinia } from 'pinia' //状态管理
import VueMarkdownEditor from '@/utils/markDownCreate'; //markdown配置
import lzyIcon from '@/components/lzyIcon.vue'
import Imgloading from "@/utils/lazy";
import loading from '@/utils/loading';
import request from '@/http/request';
import LzyBtn from './components/LzyBtn.vue'

window.$axios = request;


const pinia = createPinia()
const app = createApp(App)

// vue3全局变量挂载
app.config.globalProperties.$fancyapps = { Fancybox, }
// 添加vue指令
app.directive('ImgLoading', Imgloading)
app.directive('zyloading', loading)

app.directive('transition', transition)

//useLzyUI
app.component('LzyIcon', lzyIcon).component('LzyBtn', LzyBtn)

app.use(ElementPlus, { locale: zhCn, })
app.use(hljsVuePlugin)
app.use(router)
app.use(pinia)
app.use(VueMarkdownEditor);

app.mount('#app')
