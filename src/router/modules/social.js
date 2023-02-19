// 员工的路由规则
import Layout from '@/layout'
export default {
    // 路由规则
    path: '/social', // 路由地址
    name: 'social', // 给模块的以及路由加一个name属性 后期会在做权限时用到
    component: Layout,
    children: [{
        // 二级路由的path什么都不用写的时候 此时他表示二级路由的默认路由
        path: '', // 这里不用写 表示/social 不但有布局 layout => 员工主页
        component: () => import('@/views/social'),
        // 路由的元信息 其实就是一个存储数据的地方 可以放任何内容
        meta: {
            title: '社保', // 这里为什么要用title 因为左侧导航读取了这里的title属性
            icon: 'table' // 左侧的图标时用了 src/icons/svg 目录下的图片 左侧导航读取的也是meta中的icon属性
        }
    }]
}
