<template>
    <div class="flex flex-col items-center pt-20 px-12">
        <h1 lass="text-4xl">Connect API</h1>
        <div class="flex flex-row justify-end">
            <div @click="update()" class="bg-white text-black rounded py-1 px-2 mt-4 hover:bg-gray-400 cursor-pointer">Update</div>
        </div>
        <div class="flex flex-row flex-wrap p-8">
            <div
                v-for="socket in sockets"
                :key="socket.uuid"
                clas="w-full md:w-1/2 lg:w-1/3 p-4"
            >
                <div class="p-4 border border-white rounded">
                    <h2 class="text-2xl">{{ socket.name || 'Socket'}}</h2>
                    <div>{{ socket.uuid }}</div>
                    <div @click="test(socket)" class="bg-white text-black rounded py-1 px-2 mt-4 hover:bg-gray-400 cursor-pointer">Test</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sockets: [],
        }
    },
    mounted() {
        this.update();
    },

    methods: {
        async update() {
            const result = await this.$root.request({
                method: 'GET',
                path: '/connect',
            });

            if (result && result.success) {
                this.sockets = result.sockets;
            } else {
                this.sockets = [];
            }
        },
        async action(socket, action, content) {
            const result = await this.$root.request({
                method: 'POST',
                path: '/connect',
                body: {
                    uuid: socket.uuid,
                    action,
                    content,
                }
            });

            return result;
        },
        async test(socket) {
            this.action(socket, 'ping', null);
        }
    }
}
</script>
