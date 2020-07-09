<template>
    <div class="flex flex-col items-center pt-20 px-12">
        <h1 class="text-4xl">Connect</h1>
        <div class="flex flex-row justify-end">
            <div @click="update()" class="bg-white text-black rounded py-1 px-2 mt-4 hover:bg-gray-400 cursor-pointer">Update</div>
        </div>

        <div class="w-full flex flew-row flex-wrap md:px-20">
            <Socket
                v-for="socket in sockets"
                v-bind:key="socket.uuid"
                v-bind:socket="socket"
            />
        </div>
    </div>
</template>

<script>
import Socket from '@/components/Socket.vue';

export default {
    data() {
        return {
            sockets: [],
        }
    },
    components: {
        Socket,
    },
    mounted() {
        this.update();
    },
    methods: {
        async update() {
            this.sockets = await this.action(null, 'async', {
                action: 'list',
            });
        },
        async action(socket, type, content) {
            return await this.$root.wsc.send({
                to: socket ? socket.uuid : 'server',
                type,
                content,
            }).then(result => result.response);
        }
    }
}
</script>
