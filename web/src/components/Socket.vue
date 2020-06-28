<template>
    <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4" v-bind:key="socket.uuid">
        <div v-bind:class="isSelf(socket)" class="p-4 border rounded">
            <h2 class="text-2xl">{{ socket.name || 'Socket' }}</h2>
            <div class="text-sm">{{ socket.uuid }}</div>
            <div class="text-sm">ping: {{ socket.ping || '?' }}ms</div>

            <div @click="ping(socket)" v-bind:class="isSelfButton(socket)" class="rounded py-1 mt-4 cursor-pointer">
                Ping
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['socket'],
    methods: {
        async ping(socket) {
            const result = await this.$parent.action(socket, 'ping', Date.now());

            const s = this.$parent.sockets.find(s => s.uuid === socket.uuid);
            console.log(s);

            s.ping = Date.now() - result;

            console.log(s);
        },
        isSelfButton(socket) {
            if(socket.uuid === this.$root.wsc.uuid) {
                return 'bg-primary-500 text-white hover:bg-primary-700';
            } else {
                return 'bg-white text-black hover:bg-gray-400'
            }
        },
        isSelf(socket) {
            if(socket.uuid === this.$root.wsc.uuid) {
                return 'border-primary-500 text-primary-500';
            } else {
                return 'border-white text-white'
            }
        },

    }
}
</script>
