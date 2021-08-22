const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  name: state => state.user.name,
  username: state => state.user.username,
  avatar: state => state.user.avatar,
  menus: state => state.user.menus
}
export default getters
