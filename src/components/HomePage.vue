<template>
  <div>
    <div class="home">
      <div class="row">
        <div class="col-lg-6">
          <IntroTextElement></IntroTextElement>
        </div>
        <div class="col-lg-6">
          <SubscribeElement></SubscribeElement>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IntroTextElement from "./elements/IntroTextElement";
import SubscribeElement from "./elements/SubscribeElement";
export default {
  name: "HomePage",
  data() {
    return {};
  },
  props: {},
  components: { IntroTextElement, SubscribeElement }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
