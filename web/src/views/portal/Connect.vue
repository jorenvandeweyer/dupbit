<template>
    <div class="flex flex-col items-center pt-20 px-12">
        <h1 class="text-4xl">Connect</h1>
        <div class="flex flex-row justify-end">
            <div @click="update()" class="bg-white text-black rounded py-1 px-2 mt-4 hover:bg-gray-400 cursor-pointer">Update</div>
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
            const result = await this.$root.wsc.send({
                to: 'server',
                type: 'async',
                content: {
                    action: 'list',
                },
            });

            console.log('WOOOW', result);
        }
    }
}
</script>
