import axios from '@/libs/api.request'

// params:params 键名和减值一样可以简写为parrms es6简写
export const getSelectList = (params) => {
    return axios.request({ url: 'transportoperation/checkcar', method: 'post', params })
}
// 请求司机姓名
export const getdriverName = (params) => {
    return axios.request({ url: 'taskallocation/checkdriver', method: 'post', params })
}
// post请求放data里 params是请求参数get请求直接params
export const logout2 = (params) => {
    return axios.request({ url: 'logout', method: 'post', data: params })
}
//请求页面数据
export const getData = (params) =>{
    return axios.request({url:'deliver/index',method:'post',params})
}
//派送
export const  getAdd =(params)=>{
    return axios.request({url:'deliver/add',method:'post',params})
}

