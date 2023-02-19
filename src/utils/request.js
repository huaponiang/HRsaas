// 导出一个axios的实例 而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
const TimeOut = 3600 // 定义超时时间
const service = axios.create({
  // 当执行 npm run dev => .eve.production 读取=> /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev => .env.development中的公共地址 /api
  // npm run bulid => /prod-api
  timeout: 5000 // 设置超时时间
}) // 创建一个axios的实例

// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入 token
  if (store.getters.token) {
    // 只有在有 token 的情况下 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果他为 true 表示过期了
      // token没用了，因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token过期了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须要返回
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios 默认加了一层data
  const { data, success, message } = response.data
  // 要根据 success 的成功与否，决定下面的操作
  if (success) {
    // 执行成功
    return data
  } else {
    // 业务错了，不能进 then，进 catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息 里面 response 的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当 code 等于 10002 的时候，表示后端告知 token 超时
    store.dispatch('user/logout') // 登出action 删除 token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入 catch
})
// 是否超时
// 超时逻辑 （当前时间 - 缓存的时间） 是否大于 定义的时间差 TimeOut
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios实例
