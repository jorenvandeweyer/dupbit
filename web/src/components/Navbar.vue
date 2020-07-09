<template>
    <div id="nav" class="w-screen fixed px-8 py-4 top-0">
        <div class="w-full flex flex-row bg-black rounded-full py-2 px-4">
            <template v-if="!authenticated">
                <router-link to="/">Dupbit</router-link>
                <router-link to="/apps" class="ml-4">Apps</router-link>
                <router-link to="/contact" class="ml-4">Contact</router-link>
                <router-link to="/login" class="ml-auto">Login</router-link>
            </template>
            <template v-else>
                <router-link to="/portal">Portal</router-link>
                <router-link to="/portal/account" class="ml-auto">Account</router-link>
                <div @click="logout()" class="cursor-pointer font-bold ml-2">Logout</div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        authenticated: function() {
            return this.$root.auth
        }
    },
    methods: {
        logout: async function() {
            const result = await this.$root.request({
                path: '/account/logout',
                method: 'POST'
            });

            if (result && result.success) {
                this.$root.auth = null;
                this.$router.go();
            }
        }
    }
}
</script>

<style lang="scss">
#nav {
  a {
    font-weight: bold;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
