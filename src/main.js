// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

//引入element-ui插件
import ElementUI from 'element-ui'
  //引入elementui的css样式模块
import 'element-ui/lib/theme-chalk/index.css'
//引入公共样式
import './assets/common.css'
//引入axios
import axios from 'axios'
//引入路由挂载
import router from './router/router' 

Vue.config.productionTip = false
//全局配置axios的基础地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
//设置请求拦截器,给请求头加上token
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = localStorage.getItem('token')
  return config
},function (error) {
  return Promise.reject(error)
})

//安装elementui插件
Vue.use(ElementUI)


new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router
})
