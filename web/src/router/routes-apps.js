export default [
    {
        path: '/apps',
        name: 'Apps',
        component: () => import('@/views/portal/Index.vue'),
    }, {
        path: '/apps/dupbot',
        name: 'Dupbot',
        alias: '/dupbot',
        component: () => import('@/views/apps/Dupbot.vue'),
    }, {
        path: '/apps/snitch',
        name: 'Snitch',
        alias: '/snitch',
        component: () => import('@/views/apps/Snitch.vue'),
    }, {
        path: '/apps/calendar',
        name: 'Calendar',
        component: () => import('@/views/apps/Calendar.vue'),
    },
];
