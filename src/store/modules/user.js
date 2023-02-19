import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
const state = {
  token: getToken(), // 设置 token 为共享状态 初始化vuex得时候，就先从缓存中读取
  userInfo: {} // 这里定义一个空对象
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
  },
  setUserInfo(state, result) {
    // 更新一个对象
    // state.userInfo = result // 这样是响应式
    state.userInfo = { ...result } // 这样也是响应式 属于浅拷贝
    // state.userInfo['username'] = result // 这样才不是响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) // 拿到 token
    context.commit('setToken', result) // 设置 token
    // 拿到 token 说明登陆成功
    setTimeStamp() // 设置当前的时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详情 用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)
    const baseResult = { ...result, ...baseInfo }
    context.commit('setUserInfo', baseResult) // 提交到mutactions
    return baseResult // 这里是给后期做权限得时候留下的伏笔
  },
  // 登出操作
  logout(context) {
    // 删除 token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
