import Vue from 'vue'
import VueRouter from 'vue-router'

import routesPortal from './routes-portal';
import routesPublic from './routes-public';
import routesApps from './routes-apps';

Vue.use(VueRouter)

const routes = [
    ...routesPublic,
    ...routesPortal,
    ...routesApps,
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
