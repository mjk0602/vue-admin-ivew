import axios from '@/libs/api.request'
//请求车牌号码
export const getSelectList = (params) => {
  return axios.request({ url: 'transportoperation/checkcar', method: 'post', params })
}
// 请求司机姓名
export const getdriverName = (params) => {
  return axios.request({ url: 'taskallocation/checkdriver', method: 'post', params })
}
//验证运单号码
export const VerifyBillNumber = (params) => {
  return axios.request({ url: 'transportoperation/takegoodsshow', method: 'post', params })
}