import Main from '@/components/Layout/index.vue'
import ParentView from '@/components/ParentView/ParentView.vue'

/**
 * meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由，没有该字段默认显示
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [

  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: false,
          title: '首页',
          notCache: true,
          icon: 'md-home',
          href:'http://baidu.com'
        },
        component: () => import('@/views/single-page/Home.vue')
      }
    ]
  },
  {
    path: '/test',
    name: '_test',
    component: Main,
    meta: {
      notCache: true,
      title: '货物运输',
      icon: 'md-car'
    },
    children: [
      {
        path: '/taskAllocation',
        name: 'taskAllocation',
        meta: {
          title: '任务分配',
          notCache: false,
          
         
        },
        component: () => import('@/views/single-page/taskAllocation.vue')
      },
      {
        path: '/page2',
        name: 'page2',
        meta: {
          title: '运输操作',
          notCache: false,
          
          showAlways: true
        },
        component: ParentView,
        children: [
          {
            path: '/PutStorage',
            name: 'PutStorage',
            meta: {
              title: '入库',
              notCache: false,
              
            },
            component: () => import('@/views/single-page/PutStorage.vue')
          },
          {
            path: '/LeavePort',
            name: 'LeavePort',
            meta: {
              title: '出港',
              notCache: false,
             
            },
            component: () => import('@/views/single-page/LeavePort.vue')
          },
          {
            path: '/ClearanceNotice',
            name: 'ClearanceNotice',
            meta: {
              title: '出港预报',
              notCache: false,
             
            },
            component: () => import('@/views/single-page/ClearanceNotice.vue')
          },
          {
            path: '/EntryNotice',
            name: 'EntryNotice',
            meta: {
              title: '进港预报',
              notCache: false,
        
            },
            component: () => import('@/views/single-page/EntryNotice.vue')
          },
        
          {
            path: '/Delivery',
            name: 'Delivery',
            meta: {
              title: '派送',
              notCache: false,
            },
            component: () => import('@/views/single-page/Delivery.vue')
          },

        ]

      },
      {
        path:'/page3',
        name:'page3',
        meta:{
          title: '运单查询',
          notCache: false,
          
          showAlways: true
        },
        component:ParentView,
        children:[
          {
            path: '/TrackingWaybill',
            name: 'TrackingWaybill',
            meta: {
              title: '运单信息跟踪',
              notCache: false,
              
            },
            component: () => import('@/views/single-page/TrackingWaybill.vue')
          },
          {
            path: '/InformationEntry',
            name: 'InformationEntry',
            meta: {
              title: '信息录入',
              notCache: false,
              
            },
            component: () => import('@/views/single-page/InformationEntry.vue')
          },
          {
            path: '/ChangeInformation',
            name: 'ChangeInformation',
            meta: {
              title: '运单修改',
              notCache: false,
              
            },
            component: () => import('@/views/single-page/ChangeInformation.vue')
          },

        ]

      },
      {
        path: '/iceQuery',
        name: 'iceQuery',
        meta: {
          title: '干冰查询',
          hideInMenu: false
        },
        component: () => import('@/views/single-page/iceQuery.vue')
      },
      {
        path: '/clamminess',
        name: 'clamminess',
        meta: {
          title: '释冷核对',
          hideInMenu: false
        },
        component: () => import('@/views/single-page/clamminess.vue')
      },
      {
        path:'/AssignmentDepute',
        name:'AssignmentDepute',
        meta:{
          title:'操作人员分配',
          hideInMenu:false
        },
        component: () => import('@/views/single-page/AssignmentDepute.vue')
      },
      {
        path: '/page4',
        name: 'page4',
        meta: {
          title: '阿米巴报表',
          notCache: false,
          
          showAlways: true
        },
        component: ParentView,
        children: [
          {
            path: '/Addcharges',
            name: 'Addcharges',
            meta: {
              title: '费用管理',
              notCache: false,
              
            },
            component: () => import('@/views/single-page/Addcharges.vue')
          },
          {
            path: '/newCharges',
            name: 'newCharges',
            meta: {
              title: '费用统计',
              notCache: false,
              
            },
            component: () => import('@/views/single-page/newCharges.vue')
          },
          {
            path: '/FixedCostManagement',
            name: 'FixedCostManagement',
            meta: {
              title: '固定费用管理',
              notCache: false,
              
            },
            component: () => import('@/views/single-page/FixedCostManagement.vue')
          },
          {
            path: '/ownProducts',
            name: 'ownProducts',
            meta: {
              title: '自用产品摊销管理',
              notCache: false,
              
            },
            component: () => import('@/views/single-page/ownProducts.vue')
          },   
          {
            path: '/InternalSettlementIncome',
            name: 'InternalSettlementIncome',
            meta: {
              title: '内部结算收入管理',
              notCache: false,
              
            },
            component: () => import('@/views/single-page/InternalSettlementIncome.vue')
          },
          
          
     
         

        ]

      },
     
     

    
      
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/404.vue')
  }
]
