<template>
  <div id="app">
    <HeaderElement></HeaderElement>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderElement from "./components/elements/HeaderElement";
export default {
  name: "App",
  components: { HeaderElement }
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
