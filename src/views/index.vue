<script setup lang='ts'>
import SetLeft from '@/components/SetLeft.vue'
import { ref, } from 'vue'
import Article from '@/views/article/Article.vue'
import Comment from '@/views/comment/Comment.vue'
import User from '@/views/user/User.vue'

const loading = ref(false)

const currentView = ref('User')
const components = {
  Comment,
  Article,
  User
}
const router = useRouter()
const changeComponent = (componentName: string) => {
  if (componentName.indexOf('/login') == 0) {
    // 销毁token
    localStorage.clear()
    return router.push('/login')
  }
  loading.value = true
  currentView.value = componentName
  setTimeout(() => {
    loading.value = false
  }, 500)
}
</script>

<template>
  <div class="admin">
    <div class="tool">
      <Suspense>
        <SetLeft @component-name="changeComponent" :currentView="currentView" />
      </Suspense>
    </div>
    <div class="content" id="content" v-zyloading="loading">
      <Suspense>
        <component :is="components[currentView]" v-if="!loading" />
      </Suspense>
    </div>
  </div>
</template>
