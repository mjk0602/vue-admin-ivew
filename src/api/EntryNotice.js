import axios from '@/libs/api.request'
//请求页面数据
export const getData = (params) =>{
    return axios.request({url:'incomeforecast/index',method:'post',params})
}