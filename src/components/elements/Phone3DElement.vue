<!-- Component A -->
<template>
  <div class="wrapper">
    <div class="controls" v-if="this.showControls">
      <div style="font-size:2em;">Controls for 3D element</div>
      <span>X:</span>
      <input type="range" min="-180" max="180" step="0.1" v-model="x" /> -
      <input type="number" min="-180" max="180" step="0.1" v-model="x" />
      <br />
      <span>Y:</span>
      <input type="range" min="-180" max="180" step="0.1" v-model="y" /> -
      <input type="number" min="-180" max="180" step="0.1" v-model="y" />
      <br />
      <span>Z:</span>
      <input type="range" min="-180" max="180" step="0.1" v-model="z" /> -
      <input type="number" min="-180" max="180" step="0.1" v-model="z" />
      <br />
      <br />
      <span>S:</span>
      <input type="range" min="0" max="3" step="0.01" v-model="s" /> -
      <input type="number" min="0" max="3" step="0.01" v-model="s" />
    </div>

    <div class="phoneWrapper">
      <PhoneElement
        class="phone"
        :width="this.width"
        :borderColor="this.frameColor"
        :imagePath="this.imagePath"
        :style="this.getRotationsCSS()"
      >
      </PhoneElement>
    </div>
  </div>
</template>

<script>
import PhoneElement from "./PhoneElement";

export default {
  name: "Phone3DElement",
  components: { PhoneElement },
  data() {
    return {};
  },
  methods: {
    getRotationsCSS() {
      return `transform: scale(${this.s}) rotateX(${this.x}deg) rotateY(${this.y}deg) rotateZ(${this.z}deg)`;
    },
  },
  computed: {},
  props: {
    showControls: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "300px",
    },
    x: {
      type: Number,
      default: 10,
    },
    y: {
      type: Number,
      default: -20,
    },
    z: {
      type: Number,
      default: 0,
    },
    s: {
      type: Number,
      default: 1.1,
    },
    frameColor: {
      type: String,
      default: "#afafaf",
    },
    imagePath: {
      type: String,
      default: "/images/screenshots/idle.jpg",
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.controls {
  padding: 1rem;
  margin: 1rem;
  border: 1px dotted pink;
}
.wrapper {
  width: 100%;
  display: inline-block;
  width: auto;
  display: inline-block;
  width: inherit;
}
.phoneWrapper {
  width: 20vw;
  height: 40vw;
  perspective: 500px;
  transform-style: preserve-3d;
}
</style>
