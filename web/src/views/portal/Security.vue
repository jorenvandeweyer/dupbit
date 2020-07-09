<template>
    <div class="flex flex-col items-center pt-20 px-12">
        <h1 class="text-4xl">Security</h1>
        <div class="w-full flex-row hidden md:flex border-b font-bold">
            <div class="flex-1">jti</div>
            <!-- <div class="flex-1">Origin</div>
            <div class="flex-1">IP-address</div>
            <div class="flex-1">Info</div> -->
            <div class="flex-1">Created at</div>
            <div class="flex-1">Expires at</div>
            <div class="flex-1">Remove</div>
        </div>
        <div
            v-for="token in tokens"
            :key="token.tji"
            class="w-full flex flex-col md:flex-row text-left md:text-center my-3 pb-3 border-b"
        >
            <div class="flex flex-1 flex-row">
                <div class="flex-1 md:hidden">jti: </div>
                <div class="flex-1">{{ token.jti }}</div>
            </div>
            <!-- <div class="flex"></div>
            <div class="flex"></div>
            <div class="flex"></div> -->
            <div class="flex flex-1 flex-row">
                <div class="flex-1 md:hidden">Created at: </div>
                <div class="flex-1">{{ moment(token.createdAt) }}</div>
            </div>
            <div class="flex flex-1 flex-row">
                <div class="flex-1 md:hidden">Expires at: </div>
                <div class="flex-1">{{ moment(token.exp) }}</div>
            </div>
            <div class="flex flex-1 flex-row justify-center">
                <div @click="deleteToken(token.jti)" class="bg-white text-black rounded py-1 px-2 hover:bg-gray-400 cursor-pointer">Remove</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tokens: [],
        };
    },
    async created() {
        const result = await this.$root.request({
            method: 'GET',
            path: '/account/token/all',
        });

        if (result && result.success) {
            this.tokens = result.tokens;
        } else {
            this.tokens = [];
        }
    },
    methods: {
        async deleteToken(jti) {
            const result = await this.$root.request({
                method: 'DELETE',
                path: `/account/token/${jti}`,
            });

            if (result && result.success) {
                const index = this.tokens.findIndex(t => t.jti === jti);
                this.tokens.splice(index, 1);
            }
        }
    }
}
</script>
