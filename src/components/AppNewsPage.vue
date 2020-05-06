<template>
  <div>
    <div class="phones">
      <Phone3DElement
        :frameColor="'#535353'"
        :showControls="false"
        :positionRight="true"
        :positionSide="150"
        :positionTop="100"
        :y="-15 + this.x*30"
        :x="10"
        :s="1.1"
      ></Phone3DElement>
      <Phone3DElement
        :frameColor="'white'"
        :showControls="false"
        :positionRight="true"
        :positionSide="300"
        :positionTop="160"
        :y="-25 + this.x*50"
        :x="15"
        :s="1"
      ></Phone3DElement>
    </div>
  </div>
</template>

<script>
import Phone3DElement from "./elements/Phone3DElement";

export default {
  name: "AppNewsPage",
  data() {
    return {
      x: 2
    };
  },
  computed: {},
  created() {
    document.addEventListener("mousemove", e => {
      this.x = e.pageX / window.screen.width;
    });
  },
  components: {
    Phone3DElement
  },
  props: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
