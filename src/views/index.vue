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

// // 创建socket连接 
// // @ts-expect-error
// const socket = sockete.io('http://localhost:1022', { cors: true });

// // 监听连接成功事件
// socket.on('connect', () => {
//   console.log('已连接到服务器');

//   // 发送消息到服务器
//   socket.emit('message', localStorage.getItem('lzy_token'));
// });

// // 监听服务器发送的消息
// socket.on('message', (msg) => {
//   console.log('收到消息:', msg);
// });

// // 断开连接
// socket.disconnect();

const historyRouter = useSessionStorage('historyRouter', "System") // returns Ref<number>

import { useStore } from '@/store'

const state = useStore()

const currentView = ref('System') // 默认值为'System'
const components = {
  System,
  Comment,
  Article,
  User,
  Category,
  Undefined,
}

const router = useRouter()

/**
 * 根据组件名切换组件
 * @param componentName 组件名
 */
const changeComponent = (componentName) => {
  const name = componentName.__name
  state.loading = true
  // 如果组件名以'/login'开头，则销毁token并跳转到登录页面
  if (name === 'Login') {
    // 销毁token
    localStorage.setItem('lzy_token', 'null')
    return router.push('/login')
  }

  // 使用requestAnimationFrame来避免页面闪烁
  requestAnimationFrame(() => {
    // 如果组件名不在components中，则等待组件加载完成后再隐藏loading
    if (name === 'Undefined') {
      setTimeout(() => {
        state.hideLoading()
      }, 1000)
    }
    currentView.value = name
  })
}

watch(() => historyRouter.value, (val) => {
  const componentName = components[val]
  if (componentName) {
    changeComponent(componentName)
  } else {
    changeComponent({ __name: 'Undefined' })
  }
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
