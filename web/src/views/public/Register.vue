<template>
    <div class="w-full h-full">
        <div class="h-full flex flex-col items-center justify-center px-12">
            <div class="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 flex flex-col">
                <h1 class="font-medium text-lg">Register</h1>
                <div v-if="error" class="text-red-500">{{ error }}</div>
                <input
                    type="text"
                    class="mt-4 px-2 py-1 rounded bg-black border-white border text-white"
                    v-model="username"
                    placeholder="username">
                <input
                    type="text"
                    class="mt-4 px-2 py-1 rounded bg-black border-white border text-white"
                    v-model="email"
                    placeholder="email">
                <input
                    type="password"
                    class="mt-4 px-2 py-1 rounded bg-black border-white border text-white"
                    v-model="password"
                    placeholder="password">
                <input
                    type="password"
                    class="mt-4 px-2 py-1 rounded bg-black border-white border text-white"
                    v-model="password_confirm"
                    placeholder="confirm password">
                <button 
                    @click="register()" 
                    class="mt-8 border-white border rounded mx-4 hover:text-black hover:bg-white"
                >Register</button>
                <router-link class="mt-8 hover:underline" to="/login">Login</router-link>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            error: '',
            username: '',
            email: '',
            password: '',
            password_confirm: '',
        }
    },
    methods: {
        register: async function() {
            this.error = null;

            if (this.password !== this.password_confirm) {
                this.error = 'Passwords do not match';
                return;
            }

            const result = await this.$root.request({
                path: '/account',
                method: 'POST',
                body: {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                }
            });

            if (result && result.success) {
                this.$router.push({ path: '/login' });
            } else {
                this.error = result.errors;
            }
        }
    }
}
</script>
