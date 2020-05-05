<template>
  <div class="header">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/apps">Apps</router-link>
      <router-link to="/apps/news">News App</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "HeaderElement",
  data() {
    return {};
  },
  props: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
