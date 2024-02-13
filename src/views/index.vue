<script setup lang='ts'>
import SetLeft from '@/components/SetLeft.vue'
import { ref, } from 'vue'
import Article from '@/views/article/Article.vue'
import Comment from '@/views/comment/Comment.vue'
import User from '@/views/user/User.vue'
import Category from '@/views/category/Category.vue'
import System from '@/views/system/System.vue'
import Undefined from '@/views/undefined/Undefined.vue'
import sockete from "socket.io-client";

const socket = sockete.io('http://localhost:1022', { cors: true });

// 监听连接成功事件
socket.on('connect', () => {
  console.log('已连接到服务器');

  // 发送消息到服务器
  socket.emit('message', localStorage.getItem('lzy_token'));
});

// 监听服务器发送的消息
socket.on('message', (msg) => {
  console.log('收到消息:', msg);
});

// // 断开连接
// socket.disconnect();


const historyRouter = useSessionStorage('historyRouter', 0) // returns Ref<number>

import { useStore } from '@/store'

const state = useStore()

const currentView = ref()
const componentsNames = [
  'System',
  'User',
  'Article',
  'Comment',
  'Category',
  'EmailMessage',
  'LinkControl',
  'Setting',
  'Login',
  'Home',
]

const components = {
  System,
  Comment,
  Article,
  User,
  Category,
  Undefined
}
const router = useRouter()
const changeComponent = (componentName: string) => {
  // 如果当前路由和点击的路由一样，就不执行下方内容
  if (currentView.value == componentName) return
  state.loading = true
  if (componentName.indexOf('/login') == 0) {
    // 销毁token
    localStorage.clear()
    return router.push('/login')
  }
  setTimeout(() => {
    //判断页面是否有组件存在 如果存在则返回，不存在则返回404界面
    currentView.value = componentName in components ? componentName : 'Undefined'
    if (!(componentName in components)) {
      nextTick(() => {
        state.hideLoading()
      })
    }
  }, 50)
}
watch(() => historyRouter.value, (val) => {
  console.log(`lzy  val:`, val)
  changeComponent(componentsNames[val])
}, { immediate: true })


</script>

<template>
  <div class="admin">
    <div class="tool" id="tool">
      <Suspense>
        <SetLeft :currentView="currentView" />
      </Suspense>
    </div>
    <div class="content" id="content" v-zyloading="state.loading">
      <Suspense>
        <component :is="components[currentView]" />
      </Suspense>
    </div>
  </div>
</template>
@/store
