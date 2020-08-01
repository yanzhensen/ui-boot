import Vue from 'vue'
import Router from 'vue-router'
import notfind from './views/404'
import notfind401 from './views/401'
import login from './views/login'
import main from './views/main'
import welcome from './views/welcome.vue'

//懒加载
const userInfo = () => import('./views/sys/userInfo')
const roleInfo = () => import('./views/sys/roleInfo')
const menuInfo = () => import('./views/sys/menuInfo')
const resourceInfo = () => import('./views/sys/resourceInfo')
const roleManager = () => import('./views/sys/roleManager')

Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
const router = new Router({
  mode: process.env.VUE_APP_TITLE == 'online' ? 'history' : "hash",
  // mode: 'history',
  // mode: 'hash',
  routes: [
    {
      path: '/saas',
      name: 'login',
      component: login,
    },
    {
      path: '/main',
      name: 'main',
      meta: {requireAuth: true},
      redirect: '/welcome',
      component: main,
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          meta: {requireAuth: true},// 添加该字段，表示进入这个路由是需要登录的
          component: welcome
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: userInfo,
          meta: {requireAuth: true}
        },
        {
          path: '/roleInfo',
          name: 'roleInfo',
          component: roleInfo,
          meta: {requireAuth: true}
        },
        {
          path: '/menuInfo',
          name: 'menuInfo',
          component: menuInfo,
          meta: {requireAuth: true}
        },
        {
          path: '/resourceInfo',
          name: 'resourceInfo',
          component: resourceInfo,
          meta: {requireAuth: true}
        },
        {
          path: '/roleManager',
          name: 'roleManager',
          component: roleManager,
          meta: {requireAuth: true}
        },
        {//没有权限
          path: '/notfind401',
          name: 'notfind401',
          component: notfind401,
          meta: {requireAuth: true}
        },
      ]
    },
    {
      path: '*',
      name: 'notfind',
      component: notfind
    }
  ]
})

import store from './store'

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
    if (sessionStorage.getItem('spId')) { // 判断当前的spid是否存在 ； 登录存入的spId
      if (store.state.pageAuth[`${to.fullPath}`]
        || to.fullPath == '/welcome'
        || to.fullPath == '/main'
      ) {
        next();
      } else {
        next({
          path: '/notfind'
        })
      }
    }
  } else {
    next()
  }
})

export default router
