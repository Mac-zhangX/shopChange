import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

/* Layout */
import Layout from '@/layout'
import {menuList} from "../api/modeList";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */


// menuList().then((res) => {   //获取菜单列表
//   console.log(res.data.menuList,123456);
//   let firMenu = res.data.menuList.length;
//   for(let i=0;1<firMenu;i++) {
//   }
// });

export const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index'),
                meta: {title: '首页', icon: 'guanli'}
            },
        ]
    },
    {
        path: '/operatorManage',
        component: Layout,
        children: [
            {
                path: 'menuManage',
                name: 'menuManage',
                component: () => import('@/views/operatorManage/menuManage.vue'),
                meta: {title: 'ShopManage', icon: 'guanli'}
            },
        ]
    },

    // { path: '*', redirect: '/404', hidden: true }
]

export const indexRoute = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        meta: {title: 'ShopManage', icon: 'guanli', roles: ['admin', 'operator']},
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: {title: '首页', icon: 'dashboard', roles: ['admin', 'operator']}
        }]
    },
]


// 配置动态路由
export const asyncRouterMap = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        meta: {title: 'ShopManage', icon: 'guanli', roles: ['admin', 'operator']},
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: {title: 'ShopManage', icon: 'guanli', roles: ['admin', 'operator']}
        }]
    },
    {
        path: '/goodsManage',
        component: Layout,
        redirect: '/goodsManage/goodsInfo',
        name: 'goodsManage',
        meta: {title: '商品管理', icon: 'goods', roles: ['admin']},
        alwaysShow: true,
        children: [
            {
                path: 'goodsArea',
                name: 'goodsArea',
                component: () => import('@/views/goodsInfo/goodsArea'),
                meta: {title: '积分专区', icon: 'goods', roles: ['admin']}
            },
            {
                path: 'goodsInfo',
                name: 'goodsInfo',
                component: () => import('@/views/goodsInfo/goodsInfo'),
                meta: {title: '积分专区', icon: 'goods', roles: ['admin']}
            },
            {
                path: 'goodsTable',
                name: 'goodsTable',
                component: () => import('@/views/goodsInfo/goodsTable'),
                meta: {title: '积分范围表', icon: 'goods', roles: ['admin']}
            },
            {
                path: 'goodsType',
                name: 'goodsType',
                component: () => import('@/views/goodsInfo/goodsType'),
                meta: {title: '积分范围表', icon: 'goods', roles: ['admin']}
            },
        ]
    },

    {
        path: '/moneyInfo',
        component: Layout,
        redirect: '/moneyInfo/moneyInfo',
        name: 'moneyInfo',
        meta: {title: '财务信息', icon: 'shopping', roles: ['admin']},
        alwaysShow: true,
        children: [
            {
                path: 'moneyInfo',
                name: 'moneyInfo',
                component: () => import('@/views/moneyInfo/moneyInfo'),
                meta: {title: '财务报表', icon: 'goods', roles: ['admin']}
            },
            {
                path: 'promoterManage',
                name: 'promoterManage',
                component: () => import('@/views/moneyInfo/promoterManage'),
                meta: {title: '推广商管理', icon: 'goods', roles: ['admin']}
            },
            {
                path: 'supplierManage',
                name: 'supplierManage',
                component: () => import('@/views/moneyInfo/supplierManage'),
                meta: {title: '供应商管理', icon: 'goods', roles: ['admin']}
            },
        ]
    },

    {
        path: '/declManage',
        component: Layout,
        redirect: '/declInfo/declInfo',
        name: 'declManage',
        meta: {title: '申报管理', icon: 'taocan', roles: ['admin', 'operator']},
        alwaysShow: true,
        children: [
            {
                path: 'decl',
                name: 'decl',
                component: () => import('@/views/decl/decl'),
                meta: {title: '申报', icon: 'decle', roles: ['admin', 'operator']}
            },
            {
                path: 'declInfo',
                name: 'declInfo',
                component: () => import('@/views/declInfo/declInfo'),
                meta: {title: '申报记录', icon: 'decle', roles: ['admin', 'operator']}
            },
            {
                path: 'declError',
                name: 'declError',
                component: () => import('@/views/declInfo/declError'),
                meta: {title: '申报异常记录', icon: 'decle', roles: ['admin', 'operator']}
            },
            {
                path: 'unCheckOrders',
                name: 'unCheckOrders',
                component: () => import('../views/declInfo/unCheckOrders'),
                meta: {'title': '异常订单审核', icon: 'dingdan', roles: ['admin']}
            },
        ]
    },
    {
        path: '/orderManage',
        component: Layout,
        redirect: '/orderManage/orderInfo',
        name: 'orderManage',
        meta: {title: '订单管理', icon: 'taocan', roles: ['admin', 'operator']},
        alwaysShow: true,
        children: [
            {
                path: 'orderInfo',
                name: 'orderInfo',
                component: () => import('../views/orderInfo/orderInfo'),
                meta: {title: '核销记录', icon: 'dingdan', roles: ['admin', 'operator']}
            },
            {
                path: 'backInfo',
                name: 'backInfo',
                component: () => import('../views/orderInfo/backInfo'),
                meta: {'title': '退货订单', icon: 'dingdan', roles: ['admin']}
            },
            {
                path: 'unwithInfo',
                name: 'unwithInfo',
                component: () => import('../views/orderInfo/unwithInfo'),
                meta: {'title': '未核销订单', icon: 'dingdan', roles: ['admin']}
            },
            {
                path: 'orderStatic',
                name: 'orderStatic',
                component: () => import('../views/orderInfo/orderStatic'),
                meta: {'title': '核销统计', icon: 'dingdan', roles: ['admin']}
            },

            {
                path: 'dataChart',
                name: 'dataChart',
                component: () => import('../views/orderInfo/dataChart'),
                meta: {'title': '数据统计', icon: 'dingdan', roles: ['admin']}
            },
            {
                path: 'goodsRecord',
                name: 'goodsRecord',
                component: () => import('../views/orderInfo/goodsRecord'),
                meta: {'title': '物流信息修改记录', icon: 'dingdan', roles: ['admin']}
            },
        ]
    },
    {
        path: '/operatorManage',
        component: Layout,
        redirect: '/operatorManage/operatorManage',
        name: 'goodsOpeation',
        meta: {title: '系统管理', icon: 'taocan', roles: ['admin']},
        alwaysShow: true,
        children: [
            {
                path: 'operatorManage',
                name: 'operatorManage',
                component: () => import('../views/operatorManage/operatorManage'),
                meta: {title: '角色管理', icon: 'user', roles: ['admin']}
            },
            {
                path: 'setUers',
                name: 'setUers',
                component: () => import('../views/operatorManage/setUers'),
                meta: {title: '用户管理', icon: 'user', roles: ['admin']}
            },
            {
                path: 'menuManagement',
                name: 'menuManagement',
                component: () => import('../views/operatorManage/menuManagement'),
                meta: {title: '菜单管理', icon: 'user', roles: ['admin']}
            },
            {
                path: '#',
                name: 'agentList',
                component: () => import('../views/agentList/agentList'), // 用户下级列表
                meta: {title: '下级用户列表', icon: 'user', roles: ['admin']},
                hidden: true // 在左侧进行隐藏
            }
        ]
    }
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher // reset router
}

export default router
