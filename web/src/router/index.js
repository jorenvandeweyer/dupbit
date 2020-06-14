import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
      title: 'Dupbit',
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }, {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Login',
      login: false,
    },
    component: () => import('../views/Login.vue'),
  }, {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }, {
    path: '/portal',
    name: 'Portal',
    meta: {
      login: true,
    },
    component: () => import('../views/portal/Index.vue'),
  }, {
    path: '/portal/account',
    name: 'Account',
    component: () => import('@/views/portal/Account.vue'),
    meta: {
      login: true,
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
