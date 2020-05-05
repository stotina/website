<template>
  <div class="phone" :style="inlineStyleValue">
    <InteractiveLogo :widthPercent="60"></InteractiveLogo>
    <div class="appPageHeaderPhoneTitle">STOTINA</div>
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
    widthPx: Number
  },
  computed: {
    heightPx() {
      return this.widthPx * 2;
    },
    borderSide() {
      return Math.floor(this.widthPx / 30);
    },
    borderTop() {
      return Math.floor(this.borderSide * 4);
    },
    borderBottom() {
      return Math.floor(this.borderSide * 3);
    },
    fontSize() {
      return Math.floor(this.borderSide * 3);
    },
    paddingTop() {
      return Math.floor(this.borderSide * 13);
    },
    inlineStyleValue() {
      return (
        [
          `width:${this.widthPx}px`,
          `height:${this.heightPx}px`,
          `border: ${this.borderSide}px solid black`,
          `border-top: ${this.borderTop}px solid black`,
          `border-bottom: ${this.borderBottom}px solid black`,
          `border-radius: ${this.borderSide}px`,
          `font-size: ${this.fontSize}px`,
          `padding-top: ${this.paddingTop}px`
        ]
          .map(i => i + ";")
          .join(" ") + ";"
      );
    }
  },
  methods: {},
  components: {
    InteractiveLogo
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.phone {
  background-color: #a5a5a5;
  text-align: center;
  color: black;
  font-weight: bold;
}
</style>
