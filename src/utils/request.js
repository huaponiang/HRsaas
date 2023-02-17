// 导出一个axios的实例 而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
// import store from '@/store'
// import router from '@/router'
// const TimeOut = 5400 // 定义超时时间
const service = axios.create({
  // 当执行 npm run dev => .eve.production 读取=> /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev => .env.development中的公共地址 /api
  // npm run bulid => /prod-api
  timeout: 5000 // 设置超时时间
}) // 创建一个axios的实例

// 请求拦截器
service.interceptors.request.use()

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
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入 catch
})
// 检查token是否过期
function CheckIsTimeOut() {
  // 当前时间  - 存储的时间戳 > 时效性  false   tr
  return (Date.now() - getTimeStamp()) / 1000 > TimeOut
}
export default service // 导出axios实例
