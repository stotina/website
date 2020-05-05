<template>
  <div class="interactive-logo">
    <div id="logoBox">
      <div id="logoFrame" class="absolutePosition"></div>
      <div class="absolutePosition">
        <img id="logoImage" src="../../assets/logo.png" />
      </div>
      <div id="logoFilter"></div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "InteractiveLogo",
  data() {
    return {};
  },
  props: {},
  computed: {},
  methods: {},
  created() {
    document.addEventListener("mousemove", e => {
      var logoBox = $(window.logoBox);
      var center = [
        logoBox.offset().left + logoBox.width() / 2,
        logoBox.offset().top + logoBox.height() / 2
      ];
      var angle =
        Math.atan2(e.pageX - center[0], -(e.pageY - center[1])) *
        (180 / Math.PI);
      angle = Math.floor(angle - 180);

      $(window.logoFrame).css(
        "background-image",
        `linear-gradient(${angle}deg, #2a9fd6, #06060622, #060606)`
      );
      $(window.logoFilter).css(
        "background-image",
        `linear-gradient(${angle}deg, transparent, #06060622, #060606)`
      );
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#logoBox {
  display: block;
  margin: auto;
  text-align: center;
  width: 40vw;
  height: 40vw;
  border-radius: 40vw;
}
#logoBox img {
  width: 40vw;
  height: 40vw;
  border-radius: 40vw;
}
.absolutePosition {
  position: absolute;
}
#logoFrame,
#logoFilter {
  width: 40vw;
  height: 40vw;
  border-radius: 40vw;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
#logoFrame {
  background-image: linear-gradient(180deg, #2a9fd6, #06060622, #060606);
}
#logoFilter {
  position: relative;
  transition: 1s ease-in;
  background-image: linear-gradient(180deg, transparent, #06060622, #060606);
}
#logoFilter:hover {
  opacity: 0;
  transition: 1s ease-in;
}
</style>
