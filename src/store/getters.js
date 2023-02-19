const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 在根级的getters上 开发子模块的属性给别人看 给别人用
  // avatar: state => state.user.avatar,
  // name: state => state.user.name
  name: state => state.user.userInfo.username, // 建议对于用户名的快捷访问
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto // 建立头像的快捷访问

}
export default getters
