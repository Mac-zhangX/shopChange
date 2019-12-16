import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import { UrlHelper } from './api/urlHelper'
import { removeToken } from '@/utils/auth' // get token from cookie
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n 中文环境
import VueQuillEditor from 'vue-quill-editor'
import echarts from 'echarts' //引入echarts
/* eslint-disable */
import Blob from './excel/Blob'
import Export2Excel from './excel/Export2Excel'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)


import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import axios from 'axios'

Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts //引入组件
import '@/icons' // icon
import '@/permission' // permission control
import moment from 'moment'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, {locale})
NProgress.configure({showSpinner: false});
Vue.prototype.$axios = axios

// http request 请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  console.log('进入拦截器了')
  const nowTime = new Date().getTime()
  const setTime = UrlHelper.clearCookieTime // 清除cokiede 时间
  const firstLogin = window.localStorage.getItem('firstLogin')
  if ((nowTime - firstLogin) > setTime) {
    removeToken() // 清除cookie中的token
    router.push({name: '/login'})
  }
  // 将当前的时间设置为 缓存中的时间 -- 下次调用接口与这一次比较
  window.localStorage.removeItem('firstLogin')
  window.localStorage.setItem('firstLogin', nowTime)
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 全局响应拦截
axios.interceptors.response.use(function (response) {
  // 用户信息是否超时，重定向到登录页面
  // console.log('全局响应拦截')
  if (response.data.code == 401) {  // 如果是500直接跳转到登录
    localStorage.clear()
    router.replace({
      path: '/login',
      query: {redirect: router.currentRoute.fullPath}
    })
  }else if(response.data.code == 500){
    console.log(response.data.msg)
  }
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

// 定义全局过滤器--时间格式化
Vue.filter('format', function (val, arg) {
  if (!val) return
  val = val.toString()
  return moment(val).format(arg)
})

// 添加一个loading对象
Vue.prototype.openLoading = function() {
  const loading = this.$loading({           // 声明一个loading对象
    lock: true,                             // 是否锁屏
    text: '正在加载...',                     // 加载动画的文字
    spinner: 'el-icon-loading',             // 引入的loading图标
    background: 'rgba(0, 0, 0, 0.3)',       // 背景颜色
    target: '.sub-main',                    // 需要遮罩的区域
    body: true,
    customClass: 'mask'                     // 遮罩层新增类名
  })
  setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    loading.close();                        // 关闭遮罩层
  },10*60*1000)
  return loading;
}
