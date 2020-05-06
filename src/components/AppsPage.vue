<template>
  <div>
    <div id="sloganArea">
      <SloganHeader :title="title" :description="description"></SloganHeader>
    </div>
    <div id="appListArea">
      <AppListElement></AppListElement>
    </div>
  </div>
</template>

<script>
import SloganHeader from "./elements/SloganHeader";
import AppListElement from "./elements/AppListElement";

export default {
  name: "AppsPage",
  data() {
    return {
      title: "Apps",
      description: "Our applications so far..."
    };
  },
  props: {},
  components: {
    SloganHeader,
    AppListElement
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#appListArea {
  background-color: #060606;
  position: relative;
  z-index: 2;
}
</style>
