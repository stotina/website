<template>
  <div
    class="phone theme-bg-mainFont theme-c-passiveFont"
    :style="inlineStyleValue"
  >
    <div v-if="!imagePath">
      <InteractiveLogo :widthPercent="60"></InteractiveLogo>
      <div class="appPageHeaderPhoneTitle">STOTINA</div>
    </div>
    <img v-if="imagePath" :src="imagePath" />
  </div>
</template>

<script>
import InteractiveLogo from "./InteractiveLogo";

export default {
  name: "PhoneElement",
  data() {
    return {};
  },
  props: {
    width: {
      type: String,
      default: "300px",
    },
    borderColor: {
      type: String,
      default: "var(--border-color-phones)",
    },
    imagePath: {
      type: String,
      default: null,
    },
  },
  computed: {
    inlineStyleValue() {
      var css =
        [
          `width:${this.width}`,
          `height: calc(2 * ${this.width})`,
          `border-style: solid`,
          `border-color: ${this.borderColor}`,
          `border-width: calc(${this.width} / 30)`,
          `border-top-width: calc(${this.width} / 7.5)`,
          `border-bottom-width: calc(${this.width} / 10)`,
          `border-radius: calc(${this.width} / 30)`,
          `font-size: calc(${this.width} / 10)`,
          this.imagePath ? "" : `padding-top: calc(${this.width} / 2.5)`,
        ]
          .map((i) => i + ";")
          .join(" ") + ";";

      return css;
    },
  },
  methods: {},
  components: {
    InteractiveLogo,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.phone {
  text-align: center;
  font-weight: bold;
}
.phone img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
