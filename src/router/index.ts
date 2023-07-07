import { createRouter, createWebHashHistory } from 'vue-router'
// 引入 nprogress
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 引入样式
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
    },
    {
        path: '/userAdmin',
        name: 'userAdmin',
        component: () => import('@/views/index.vue'),
        children: [
            {
                path: '/user',
                name: 'user',
                component: () => import('@/views/user/User.vue')
            }, {
                path: '/article',
                name: 'article',
                component: () => import('@/views/article/Article.vue')
            }, {
                path: '/comments',
                name: 'comments',
                component: () => import('@/views/comments/index.vue')
            }
        ]
    }

    // {
    // path: "/:catchAll(.*)",
    // name: 'undefind404',
    // component: undefind404 // 注意，没有重定向就会出现两个一模一样的home页面
    // },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) { // 始终滚动到顶部
        setTimeout(() => {
            document.querySelector('body')!.classList.remove('loading')
        }, 1000)
        return { top: 0 }
    }
})
// 前置钩子
router.beforeEach(async (to: any) => {
    /* 拦截 正则匹配拦截后台管理页面userAdmin的路由 */
    // if (to.path.indexOf('userAdmin') > 0) {
    //     const token = localStorage.getItem('lzy_token')
    //     console.log(`lzy  token:`, token)
    //     if (!token) {
    //         return '/login'
    //     }
    // }

    // if (to.hash === '') {
    //     if (to.href.indexOf('userAdmin') != -1)
    //         return
    //     document.querySelector('.navbarContent')?.classList.remove('navbarContent100')
    //     document.querySelector('body')!.classList.add('loading')
    // }
})


// 简单配置
NProgress.inc(0.4)
NProgress.configure({ easing: 'ease', speed: 1000, showSpinner: false })

// 进度条开始
router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})

// 进度条结束
router.afterEach(() => {
    NProgress.done()
})
export default router
