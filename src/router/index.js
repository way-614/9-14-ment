import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/Home.vue'),
    redirect:"/welcome",
    children:[
      {
        path:"/welcome",
        name:'Welcome',
        component: () => import('../views/chirden/welcome.vue')
      },
      {
        path:"/users",
        name:'Users',
        component: () => import('../views/chirden/users.vue')
      },
      {
        path:"/users",
        name:'Users',
        component: () => import('../views/chirden/users.vue')
      },
      {
        path:"/roles",
        name:'Roles',
        component: () => import('../views/chirden/roles.vue')
      },
      {
        path:"/rights",
        name:'Rights',
        component: () => import('../views/chirden/rights.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/login.vue')
  },

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path=="/login") return next();

  const tken = window.sessionStorage.getItem('token');
  if(!tken) return next('/login')
  next();
})

export default router
