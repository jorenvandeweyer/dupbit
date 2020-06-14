<template>
  <div id="app" class="flex flex-col">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  computed: {
    loading() {
      return this.$root.loading;
    }
  },
  components: {
    Navbar,
  }
}
</script>


