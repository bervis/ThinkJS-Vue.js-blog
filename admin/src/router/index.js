import Vue from 'vue'
import VueRouter from 'vue-router'
import { routers } from './router'
import { Base64 } from 'js-base64'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  //mode: 'history',
  routes: routers
}

const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  // 设置title
  window.document.title = to.meta.title
  let token = localStorage.getItem('token')
  let requiresAuth = to.meta.requiresAuth

  if (!token && requiresAuth === true) {
    next('/login')
  }

  let tokenArray = token.split('.')
  if (tokenArray.length !== 3) {
    next('/login')
  }
  let payload = Base64.decode(tokenArray[1])
  if (Date.now() > payload.exp * 1000) {
    next('/login')
  }

  if (localStorage.getItem('token') && to.name === 'login') {
    next('/home')
  }
  // 权限检测 TODO
  next()
})

router.afterEach((to) => {
  // 返回顶部
  window.scrollTo(0, 0)
})
export default router
