import {
  login,
  logout,
  getUserInfo
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import Cookies from 'js-cookie'

export default {
  state: {
    avatarImgPath: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',
    token: getToken(),
    access: ['super_admin', 'admin'],
    hasGetInfo: false,
    userInfo: ''
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, hasGetInfo) {
      state.hasGetInfo = hasGetInfo
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  getters: {
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { UserName, PassWord }) {
      UserName = UserName.trim()
      return new Promise((resolve, reject) => {
        login({
          UserName,
          PassWord
        }).then(res => {
          console.log(res)
          if(res.data && res.data.code === 200) {
            Cookies.set('userInfo', res.data.data)
            commit('setUserInfo', res.data.data)
          /// 这里是返回的结果 res
            commit('setToken', 'xxxxx')
            commit('setAccess', ['super_admin', 'admin'])
            commit('setHasGetInfo', true)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
