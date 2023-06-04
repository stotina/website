<template>
  <div>
    <div id="jokeAppListArea">
      <JokeAppListElement></JokeAppListElement>
    </div>
  </div>
</template>

<script>
import JokeAppListElement from "./elements/JokeAppListElement";

export default {
  name: "JokeAppsPage",
  data() {
    return {};
  },
  props: {},
  components: {
    JokeAppListElement
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
