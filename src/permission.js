// 权限拦截在路由跳转 导航守卫

import router from '@/router' // 不需要导出
import store from '@/store' // 引入 store 实例 和组件中的 this.$store 是一回事
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404']
// 前置守卫 
// next 是前置守卫必须执行的钩子函数 next 必须执行，如果不执行，页面就死了(router3.x的时候[配合vue2]，4.x的时候已经是非必须[配合vue3])
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
router.beforeEach(async (to, from, next) => {
    nprogress.start() // 开启进度条
    if (store.getters.token) {
        // 有 token 的情况下 才能获取资料
        // 如果有token
        if (to.path === '/login') {
            // 如果要访问的是登录页
            next('/') // 跳到主页
        } else {
            // 只有放过才去获取用户资料
            // 如果当前 vuex 中有用户的资料的 ID 表示已经有资料了 不需要获取，如果没有id才需要获取
            if (!store.getters.userId) {
                // 如果没有id才表示用户资料没有获取过
                await store.dispatch('user/getUserInfo')
                // 如果后续 需要根据用户资料获取数据的话，这里必须改成 同步
            }
            next()
        }
    } else {
        // 没有 token 的情况下
        if (whiteList.indexOf(to.path) > -1) {
            // 表示要去的地址在白名单
            next()
        } else {
            next('/login')
        }
    }
    nprogress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫1
router.afterEach(() => {
    nprogress.done() // 关闭进度条
})