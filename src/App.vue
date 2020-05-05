<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <nav>
      <router-link to="/">Home</router-link>...
      <router-link to="/apps">Apps</router-link>...
      <router-link to="/apps/news">News App</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {}
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
