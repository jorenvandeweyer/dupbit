export default [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/views/public/Index.vue'),
    }, {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/public/Login.vue'),
        meta: {
            title: 'Login',
            login: false,
        },
    }, {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/public/Register.vue')
    }, {
        path: '/contact',
        name: 'Contact',
        component: () => import('@/views/public/Contact.vue'),
    }
]
