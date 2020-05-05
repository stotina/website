<template>
  <div class="interactive-logo">
    <div class="logoBox" :style="`width: ${this.widthPercent}%;`">
      <div class="logoFrame absolutePosition"></div>
      <div class="logoImageBox absolutePosition"></div>
      <div class="logoFilter"></div>
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
      var logos = $(".logoBox");
      if (!logos[0]) return;
      for (let i = 0; i < logos.length; i++) {
        const logoBox = $(logos[i]);
        var center = [
          logoBox.offset().left + logoBox.width() / 2,
          logoBox.offset().top + logoBox.height() / 2
        ];
        var angle =
          Math.atan2(e.pageX - center[0], -(e.pageY - center[1])) *
          (180 / Math.PI);
        angle = Math.floor(angle - 180);

        $(logoBox.find(".logoFrame")).css(
          "background-image",
          `linear-gradient(${angle}deg, #2a9fd6, #06060622, #060606)`
        );
        $(window.find(".logoFilter")).css(
          "background-image",
          `linear-gradient(${angle}deg, transparent, #06060622, #060606)`
        );
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logoBox {
  display: block;
  margin: auto;
  text-align: center;

  position: relative;
  border-radius: 100vw;
}
.logoBox .logoImageBox {
  width: 100%;
  padding-top: 100%;
  border-radius: 100vw;
  background-image: url("/images/logo.png");
  background-size: 100% 100%;
}
.absolutePosition {
  position: absolute;
}
.logoFrame {
  width: 100%;
  padding-bottom: 100%;
  border-radius: 100vw;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  background-image: linear-gradient(180deg, #2a9fd6, #06060622, #060606);
}
.logoFilter {
  width: 100%;
  padding-bottom: 100%;
  border-radius: 100vw;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  transition: 1s ease-in;

  background-image: linear-gradient(180deg, transparent, #06060622, #060606);
}
.logoFilter:hover {
  opacity: 0;
  transition: 1s ease-in;
}
</style>
