import axios from '@/libs/api.request'
//请求页面数据
export const getData = (params) =>{
    return axios.request({url:'taskallocation/index',method:'post',params})
}
//请求省市区
export const getlinkage = (params) =>{
    return axios.request({url:'taskallocation/indexsearch',method:'post',params})
}
//请求多种温区
export const MultipleTemperatureMthos = (params) =>{
    return axios.request({url:'taskallocation/checkwdqj',method:'post',params})
}//请求多种箱型
export const   MultipleBoxMthos = (params) =>{
    return axios.request({url:'taskallocation/checkbox',method:'post',params})
}
//订单回复显示数据请求的接口
export const   OrderTReplyShow =(params) =>{
    return axios.request({url:'taskallocation/ordershow',method:'post',params})
}
//获取司机弹框
export const  DriveNameData = (params)=>{
    return axios.request({url:'taskallocation/checkdriver',method:'post',params})
}
//保存取件司机
export const  saveTakeDriveData = (params)=>{
    return axios.request({url:'taskallocation/fenpeidriver',method:'post',params})
}
//温度计编码验证接口
export const  ThermometerVerification = (params)=>{
    return axios.request({url:'taskallocation/checkwdj',method:'post',params})
}
export const  getBoxData = (params)=>{
    return axios.request({url:'taskallocation/wdqjbox',method:'post',params})
}

export const  getCheckSize = (params)=>{
    return axios.request({url:'taskallocation/checksize',method:'post',params})
}
