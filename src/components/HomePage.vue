<template>
  <div>
    <div class="interactive-logo-container">
      <InteractiveLogo :widthPercent="40"></InteractiveLogo>
    </div>
    <div class="statement">make the amazing simple.</div>
  </div>
</template>

<script>
import InteractiveLogo from "./elements/InteractiveLogo";

export default {
  name: "HomePage",
  data() {
    return {};
  },
  props: {},
  components: {
    InteractiveLogo
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.interactive-logo-container {
  margin-top: 1rem;
}
.statement {
  margin-top: 3rem;
  font-size: 2rem;
  font-style: italic;
  text-align: center;
}
</style>
