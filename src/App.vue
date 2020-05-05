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
* {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #060606;
}
</style>
