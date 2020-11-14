//实例化路由并导出给vue实例挂载
import Vue from 'vue'
import VueRouter from 'vue-router'

//引入组件
const Home = ()=>import('../components/home/Home.vue')
const Login = ()=>import('../components/login/Login.vue')
const User = ()=>import('../components/user/User.vue')
const Roles = ()=>import('../components/roles/Roles.vue')
const Rights = ()=>import('../components/rights/Rights.vue')
const Category = ()=>import('../components/category/Category.vue')



//安装路由插件
Vue.use(VueRouter)
//实例化路由
const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/home',
      component:Home,
      children:[
        {
          path:'/users',
          component:User
        },
        {
          path:'/roles',
          component:Roles
        },
        {
          path:'/rights',
          component:Rights
        },
        {
          path:'/categories',
          component:Category
        }
      ]
    },
    {
      path:'/login',
      component:Login
    },
    
  ]
})
//导航守卫--对于访问页面路由做登录状态判断
router.beforeEach((to,from,next)=>{
  //判断是否前往登录页
  if(to.path === '/login'){
    next()
  }
  //前往其他页面,要做登录状态判断
  else{
    const token = localStorage.getItem('token')
    token ? next() : next('/login')
  }
})

//导出路由
export default router