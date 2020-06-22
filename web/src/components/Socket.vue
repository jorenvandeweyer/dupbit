<template>
    <div class="w-full md:w-1/2 lg:w-1/3 p-4" v-bind:key="socket.uuid">
        <div v-bind:class="isSelf(socket)" class="p-4 border border-white rounded">
            <h2 class="text-2xl">{{ socket.name || 'Socket' }}</h2>
            <div class="text-sm">{{ socket.uuid }}</div>
            <div class="text-sm">ping: {{ socket.ping || '?' }}ms</div>

            <div @click="ping(socket)" class="bg-white text-black rounded py-1 mt-4 hover:bg-gray-400 cursor-pointer">
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
        isSelf(socket) {
            if(socket.uuid === this.$root.wsc.uuid) {
                return 'border-primary text-primary';
            } else {
                return 'border-white text-white'
            }
        }
    }
}
</script>
