<template>
  <div class="interactive-logo">
    <div id="logoBox" :style="`width: ${this.widthPercent}%;`">
      <div id="logoFrame" class="absolutePosition"></div>
      <div id="logoImageBox" class="absolutePosition">
        <!-- <img id="logoImage" src="/images/logo.png" /> -->
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
  props: { widthPercent: Number },
  computed: {},
  methods: {},
  created() {
    document.addEventListener("mousemove", e => {
      if (!window.logoBox) return;
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

  position: relative;
  border-radius: 100vw;
}
#logoBox #logoImageBox {
  width: 100%;
  padding-top: 100%;
  border-radius: 100vw;
  background-image: url("/images/logo.png");
  background-size: 100% 100%;
}
.absolutePosition {
  position: absolute;
}
#logoFrame {
  width: 100%;
  padding-bottom: 100%;
  border-radius: 100vw;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  background-image: linear-gradient(180deg, #2a9fd6, #06060622, #060606);
}
#logoFilter {
  width: 100%;
  padding-bottom: 100%;
  border-radius: 100vw;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  transition: 1s ease-in;

  background-image: linear-gradient(180deg, transparent, #06060622, #060606);
}
#logoFilter:hover {
  opacity: 0;
  transition: 1s ease-in;
}
</style>
