export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'vue-admin',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://erp.zjcoldcloud.com/zhanghaining/tms/public/index.php/',  //开发环境请求地址
    pro: 'http://erp.zjcoldcloud.com/' //生成环境请求地址
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home'
}
