import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import axios from 'axios'
import { indexRoute } from './router'
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { menuList } from './api/modeList'

const _import = require('./router/_import_' + process.env.NODE_ENV)// 获取组件的方法
import Layout from '@/layout' // Layout 是架构组件，不在后台返回，在文件里单独引入

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
let i = 0
router.beforeEach(async(to, from, next) => { // 路由守卫
  // start progress bar启动进程条
  NProgress.start()

  // set page title 设置页面标题
  document.title = getPageTitle(to.meta.title)
  const hasToken = localStorage.getItem('accessToken') // 在cookie中获取token
  if (hasToken) {
    if (to.path === '/login') {
      // 如果登录了就进入首页
      next({ path: '/' })
      NProgress.done()
    } else if (to.path === '/404') {
      next(`/login?redirect=${to.path}`)
    } else {
      localStorage.setItem('btnId', to.meta.btId)
      if (i === 0) {
        menuList().then((res) => { // 获取菜单列表
          let newRouter = makeAsyncRouter(res.data.menuList)
          newRouter.push({ path: '*', redirect: '/404', hidden: true })
          newRouter = indexRoute.concat(newRouter)
          router.options.routes = newRouter
          router.addRoutes(newRouter)
          i++
          next({ ...to, replace: true })
        })
      } else {
        try {
          next()
        } catch (error) {
          // 移除token
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`) // 返回到登录页面
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token 没有token  就进入白名单*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // 如果访问的路由不在白名单中--就重新返回登录页面
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */

// 动态生成路由
function makeAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    route.path = route.url
    route.name = route.menuName

    // route.btId = route.menuId;
    route.meta = {
      title: route.menuName,
      icon: route.target,
      btId: route.menuId
    }
    if (route.com) {
      if (route.com === 'Layout') { // Layout组件特殊处理
        route.component = Layout
        route.alwaysShow = true
      } else {
        route.component = _import(route.com)
      }
    }
    if (route.list && route.list.length) {
      route.children = makeAsyncRouter(route.list)
    }
    return true
  })
  return accessedRouters
}

