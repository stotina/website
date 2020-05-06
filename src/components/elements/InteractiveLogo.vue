<template>
  <div class="interactive-logo">
    <div class="logoBox" :style="`width: ${this.widthPercent}%;`">
      <div class="logoFrame absolutePosition"></div>
      <div class="logoImageBox"></div>
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
  methods: {
    getOwnRotation(logoBox) {
      var st = window.getComputedStyle(logoBox.parentNode.parentNode, null);
      var tr =
        st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform") ||
        st.getPropertyValue("transform") ||
        "fail...";

      if (tr === "none") return 0;

      var v = tr.split("(")[1];
      v = v.split(")")[0];
      v = v.split(",");
      var a = v[0];
      var b = v[1];
      // var c = v[2];
      // var d = v[3];
      // var scale = Math.sqrt(a * a + b * b);

      var radians = Math.atan2(b, a);
      if (radians < 0) radians += 2 * Math.PI;

      var angle = radians * (180 / Math.PI);

      return angle;
    },
    onMouseMove(e) {
      var logos = $(".logoBox");
      if (!logos[0]) return;
      for (let i = 0; i < logos.length; i++) {
        const domLogoBox = logos[i];
        const logoBox = $(domLogoBox);
        var center = [
          logoBox.offset().left + logoBox.width() / 2,
          logoBox.offset().top + logoBox.height() / 2
        ];
        var angle =
          Math.atan2(e.pageX - center[0], -(e.pageY - center[1])) *
            (180 / Math.PI) -
          180;
        angle = angle - this.getOwnRotation(domLogoBox);

        if (angle < -360) angle = angle + 360;

        $(logoBox.find(".logoFrame")).css(
          "background-image",
          `linear-gradient(${angle}deg, #2a9fd6, #2a9fd633, #00000000)`
        );
      }
    }
  },
  created() {
    document.addEventListener("mousemove", this.onMouseMove);
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
  /* z-index: -1; */
  background-image: linear-gradient(180deg, #2a9fd6, #2a9fd633, #00000000);
}
</style>
