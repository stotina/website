<template>
  <div>
    <Phone3DElement
      :showControls="true"
      :positionRight="true"
      :positionSide="150"
      :positionTop="100"
      :y="-20"
      :s="1.1"
    ></Phone3DElement>
    <Phone3DElement
      :showControls="true"
      :positionRight="true"
      :positionSide="220"
      :positionTop="160"
      :y="-12"
      :s="1"
    ></Phone3DElement>
  </div>
</template>

<script>
import Phone3DElement from "./elements/Phone3DElement";

export default {
  name: "AppNewsPage",
  data() {
    return {
      msg: "News App"
    };
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
