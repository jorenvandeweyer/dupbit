<template>
    <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4" v-bind:key="socket.uuid">
        <div v-bind:class="isSelf(socket)" class="p-4 border rounded">
            <h2 class="text-2xl">{{ socket.name || 'Socket' }}</h2>
            <div class="text-sm">{{ socket.uuid }}</div>
            <div class="text-sm">ping: {{ socket.ping || '?' }}ms</div>

            <div @click="ping(socket)" v-bind:class="isSelfButton(socket)" class="rounded py-1 mt-4 cursor-pointer">
                Ping
            </div>

            <div @click="list(socket)" v-bind:class="isSelfButton(socket)" class="rounded py-1 mt-4 cursor-pointer">
                List
            </div>

            <template v-for="(action, name) of controls">
                <div :key="name" class="mt-4 px-4">
                    <div
                        v-if="action.input.type === 'button'"
                        v-bind:class="isSelfButton(socket)"
                        class="rounded py-1 mt-4 cursor-pointer"
                        @click="button(name)"
                    >
                        {{ action.description }}
                    </div>

                    <div
                        v-if="action.input.type === 'slider'"
                        class="text-left"
                    >
                        <span>{{ action.description }}</span>
                        <vue-slider
                            v-model="action.value"
                            @change="slider(name, action.value)"
                        />
                    </div>

                    <div
                        v-if="action.input.type === 'switch'"
                        class="flex justify-between"
                    >
                        <span>{{ action.description }}</span>
                        <vs-switch
                            v-model="action.value"
                            @input="toggle(name, action.value)"
                        />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
    props: ['socket'],
    data() {
        return {
            actions: {},
            sliderTimeout: null,
        };
    },
    computed: {
        controls() {
            const list = {}

            for (let key in this.actions) {
                const action = this.actions[key];
                if (action.input) {
                    list[key] = action;
                }
            }

            return list;
        }
    },
    components: {
        VueSlider,
    },
    methods: {
        async ping(socket) {
            const result = await this.$parent.action(socket, 'ping', Date.now());

            const s = this.$parent.sockets.find(s => s.uuid === socket.uuid);

            s.ping = Date.now() - result;
        },
        async list(socket) {
            const result = await this.$parent.action(socket, 'async', { action: 'list'});

            for (let key in result) {
                const action = result[key];
                if (!action.input) continue;

                if (typeof action.input.default !== 'object') {
                    action.value = action.input.default;
                    continue;
                }

                action.value = await this.$parent.action(socket, 'async', action.input.default);
            }

            this.actions = result;
        },
        async button(action) {
            await this.$parent.action(this.socket, 'async', { action });
        },
        async slider(action, data) {
            if (!this.sliderTimeout) {
                this.sliderTimeout = setTimeout(() => {
                    this.sliderTimeout = null;
                }, 50);
                await this.$parent.action(this.socket, 'async', { action, data });
            } else {
                clearTimeout(this.sliderTimeout);
                this.sliderTimeout = setTimeout(async () => {
                    await this.$parent.action(this.socket, 'async', { action, data });
                    this.sliderTimeout = null;
                }, 50);
            }
        },
        async toggle(action, data) {
            await this.$parent.action(this.socket, 'async', { action, data });
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
