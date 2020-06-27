export default [
    {
        path: '/app/dupbot',
        name: 'Dupbot',
        alias: '/dupbot',
        component: () => import('@/views/apps/Dupbot.vue'),
    }, {
        path: '/app/snitch',
        name: 'Snitch',
        alias: '/snitch',
        component: () => import('@/views/apps/Snitch.vue'),
    }, {
        path: '/app/calendar',
        name: 'Calendar',
        component: () => import('@/views/apps/Calendar.vue'),
    },
];
