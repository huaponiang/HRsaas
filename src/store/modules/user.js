import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken(),
}
// 修改状态
const mutations = {
  // 设置 token
  setToken(state, token) {
    state.token = token // 设置 token 只是修改 state 的数据 123 => 1234
    // vuex 变化 => 缓存数据
    setToken(token) // vuex 和数据缓存的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  }
}
// 执行异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) // 拿到 token
    context.commit('setToken', result) // 设置 token
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
