export default [
    {
        path: '/portal',
        name: 'Portal',
        component: () => import('@/views/portal/Index.vue'),
        meta: {
            login: true,
        },
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
];
