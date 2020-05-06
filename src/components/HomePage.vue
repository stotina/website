<template>
  <div>
    <div class="slogan">
      <SloganHeader :phone1PositionLeftPercent="60"></SloganHeader>
    </div>
    <div class="bellow-slogan">
      <!-- content -->
    </div>
  </div>
</template>

<script>
import SloganHeader from "./elements/SloganHeader";

export default {
  name: "HomePage",
  data() {
    return {};
  },
  props: {},
  components: {
    SloganHeader
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bellow-slogan {
  background-color: #060606;
  position: relative;
  z-index: 2;
  min-height: max(20vw, 20vh);
}
</style>
