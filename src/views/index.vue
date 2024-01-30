<script setup lang='ts'>
import SetLeft from '@/components/SetLeft.vue'
import { ref, } from 'vue'
import Article from '@/views/article/Article.vue'
import Comment from '@/views/comment/Comment.vue'
import User from '@/views/user/User.vue'
import Category from '@/views/category/Category.vue'
import System from '@/views/system/System.vue'

import { useStore } from '@/store'

const state = useStore()

const currentView = ref('System')
const components = {
  System,
  Comment,
  Article,
  User,
  Category
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
    currentView.value = componentName
  }, 100)
}
</script>

<template>
  <div class="admin">
    <div class="tool" id="tool">
      <Suspense>
        <SetLeft @component-name="changeComponent" :currentView="currentView" />
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
