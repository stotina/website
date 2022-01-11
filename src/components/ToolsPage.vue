<template>
  <div>
    <div id="toolListArea">
      <ToolListElement></ToolListElement>
    </div>
  </div>
</template>

<script>
import ToolListElement from "./elements/ToolListElement";

export default {
  name: "ToolsPage",
  data() {
    return {};
  },
  props: {},
  components: {
    ToolListElement
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
