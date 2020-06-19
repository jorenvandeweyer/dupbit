<template>
  <div class="flex flex-col items-center pt-20 px-4">
    <h1 class="text-4xl font-semi text-white">Your account</h1>
    <div class="flex flex-row flex-wrap w-full mt-8 md:w-1/2 lg:w-1/3 border border-white rounded p-4">

      <div v-if="errors[0]" class="w-full text-red-500">{{ errors[0] }}</div>
      <div v-if="info[0]" class="w-full">{{ info[0] }}</div>

      <div class="w-full md:w-1/2 text-left p-2">
        <label>Username</label>
        <input type="text" class="w-full" v-model="username" v-on:keyup.enter="saveUsername()" placeholder="username">
      </div>

      <div class="w-full md:w-1/2 text-left p-2">
        <label>Email</label>
        <input type="text" class="w-full" v-model="email" placeholder="email" disabled>
      </div>

      <div class="w-full text-left p-2 flex items-end">
        <button @click="saveUsername" class="w-full rounded bg-white text-black py-1 px-2 hover:bg-gray-400">Save</button>
      </div>

      <hr class="w-full my-4">


      <div v-if="errors[1]" class="w-full text-red-500">{{ errors[1] }}</div>
      <div v-if="info[1]" class="w-full">{{ info[1] }}</div>

      <div class="w-full md:w-1/2 text-left p-2">
        <label>Old password</label>
        <input type="password" class="w-full" v-model="password_old" v-on:keyup.enter="changePassword()" placeholder="password">
      </div>

      <div class="w-full md:w-1/2 text-left p-2">
        <label>New password</label>
        <input type="password" class="w-full" v-model="password" v-on:keyup.enter="changePassword()" placeholder="password">
      </div>

      <div class="w-full md:w-1/2 text-left p-2">
        <label>Confirm password</label>
        <input type="password" class="w-full" v-model="password_confirm" v-on:keyup.enter="changePassword()" placeholder="password">
      </div>

      <div class="w-full md:w-1/2 text-left p-2 flex items-end">
        <button @click="changePassword" class="w-full rounded bg-white text-black py-1 px-2 hover:bg-gray-400">Change password</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      info: [null, null],
      errors: [null, null],

      username: this.$root.auth.username,
      email: this.$root.auth.email,

      password: '',
      password_confirm: '',
      password_old: '',
    }
  },
  methods: {
    changePassword: async function() {
      this.$set(this.errors, 1, null);
      this.$set(this.info, 1, null);


      if (this.password !== this.password_confirm) {
        this.$set(this.errors, 1, 'Passwords do not match');
        return;
      }

      const result = await this.$root.request({
        method: 'PUT',
        path: '/account',
        body: {
          password: this.password_old,
          password_new: this.password
        }
      });

      if (result && result.success) {
        this.$set(this.info, 1, 'Succesfully updated password');
        this.password = this.password_confirm = this.password_old = null;
      } else {
        this.$set(this.errors, 1, result.reason || result.errors);
      }
    },
    saveUsername: async function() {
      this.$set(this.info, 0, null);
      this.$set(this.errors, 0, null);

      if (this.username === this.$root.auth.username) {
        return;
      }

      const result = await this.$root.request({
        method: 'PUT',
        path: '/account',
        body: {
          username: this.username,
        }
      })

      if (result && result.success) {
        this.$root.auth = result;
        this.$set(this.info, 0, 'Succesfully updated username');
      } else {
        this.$set(this.errors, 0, result.reason);
      }
    }
  }
}
</script>
