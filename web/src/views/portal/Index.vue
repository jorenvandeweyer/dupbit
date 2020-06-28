<template>
    <div class="w-full md:w-3/4 lg:w-2/3 pt-20 mx-auto">
        <h1 class="text-4xl">Apps</h1>
        <div class="flex flex-row flex-wrap p-8">
            <div
                v-for="app in apps"
                :key="app.title"
                class="w-full md:w-1/2 lg:w-1/3 p-4"
            >
                <div class="p-4 border border-white rounded">
                    <h2 class="font-medium text-xl">{{ app.title }}</h2>
                    <div class="h-20">{{ app.description }}</div>
                    <div>
                        <router-link
                            class="inline-block bg-white rounded text-black py-1 px-2 mt-4 hover:bg-gray-400"
                            :to="$root.authenticated ? app.portal : app.info"
                        >
                            Open
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const apps = [
    {
        title: 'Connect',
        description: 'Interact with your connected devices through the web browser',
        info: '/portal/connect',
        portal: '/portal/connect',
    }, {
        title: 'Connect API',
        description: 'Interact with your connected devices through the web browser',
        info: '/portal/connect-api',
        portal: '/portal/connect-api',
    }, {
        title: 'Dupbot',
        description: 'A discord bot for discord',
        info: '/apps/dupbot',
        portal: '/apps/dupbot',
    }, {
        title: 'Snitch',
        description: 'A discord bot that snitches',
        info: '/apps/snitch',
        portal: '/apps/snitch',
    }, {
        title: 'Calendar',
        description: 'Filter ICS calendars',
        info: '/apps/calendar',
        portal: '/apps/calendar'
    }
]
export default {
    data() {
        return {
            apps,
        };
    }
}
</script>
