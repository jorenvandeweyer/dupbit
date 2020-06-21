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
  }, {
    path: '/portal/security',
    name: 'Security',
    component: () => import('@/views/portal/Security.vue'),
    meta: {
      login: true,
    }
  }, {
    path: '/portal/connect',
    name: 'Connect',
    component: () => import('@/views/portal/Connect.vue'),
    meta: {
      login: true,
      permissions: ['PROJECTS.CONNECT'],
    }
  }, {
    path: '/portal/connect-api',
    name: 'ConnectApi',
    component: () => import('@/views/portal/ConnectApi.vue'),
    meta: {
      login: true,
      permissions: ['PROJECTS.CONNECT'],
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
