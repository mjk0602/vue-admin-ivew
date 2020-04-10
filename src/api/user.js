import axios from '@/libs/api.request'

export const login = ({ UserName, PassWord }) => {
  const data = {
    UserName,
    PassWord
  }
  return axios.request({
    url: 'login/login',
    params:data,
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
