<template>
  <div>
    <div id="appListArea">
      <AppListElement></AppListElement>
    </div>
  </div>
</template>

<script>
import AppListElement from "./elements/AppListElement";

export default {
  name: "AppsPage",
  data() {
    return {};
  },
  props: {},
  components: {
    AppListElement
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
