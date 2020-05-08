<template>
  <div>
    <div class="home">
      <div class="row">
        <div class="col-lg-6">
          <IntroTextElement></IntroTextElement>
          <InteractiveLogo style="max-width:200px; margin:auto; padding:1rem;"></InteractiveLogo>
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
import InteractiveLogo from "./elements/InteractiveLogo";
import SubscribeElement from "./elements/SubscribeElement";
export default {
  name: "HomePage",
  data() {
    return {};
  },
  props: {},
  components: { IntroTextElement, InteractiveLogo, SubscribeElement }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
