<!-- Component A -->
<template>
  <div class="wrapper">
    <div class="controlsWrapper">
      <div class="controls controls1" v-if="this.showControls">
        <div style="font-size:2em;">Controls for 3D element</div>
        <span>X:</span>
        <input type="range" min="-180" max="180" step="0.1" v-model="x1" /> -
        <input type="number" min="-180" max="180" step="0.1" v-model="x1" />
        <br />
        <span>Y:</span>
        <input type="range" min="-180" max="180" step="0.1" v-model="y1" /> -
        <input type="number" min="-180" max="180" step="0.1" v-model="y1" />
        <br />
        <span>Z:</span>
        <input type="range" min="-180" max="180" step="0.1" v-model="z1" /> -
        <input type="number" min="-180" max="180" step="0.1" v-model="z1" />
        <br />
        <br />
        <span>S:</span>
        <input type="range" min="0" max="3" step="0.01" v-model="s1" /> -
        <input type="number" min="0" max="3" step="0.01" v-model="s1" />
      </div>
      <div class="controls controls2" v-if="this.showControls">
        <div style="font-size:2em;">Controls for 3D element</div>
        <span>X:</span>
        <input type="range" min="-180" max="180" step="0.1" v-model="x2" /> -
        <input type="number" min="-180" max="180" step="0.1" v-model="x2" />
        <br />
        <span>Y:</span>
        <input type="range" min="-180" max="180" step="0.1" v-model="y2" /> -
        <input type="number" min="-180" max="180" step="0.1" v-model="y2" />
        <br />
        <span>Z:</span>
        <input type="range" min="-180" max="180" step="0.1" v-model="z2" /> -
        <input type="number" min="-180" max="180" step="0.1" v-model="z2" />
        <br />
        <br />
        <span>S:</span>
        <input type="range" min="0" max="3" step="0.01" v-model="s2" /> -
        <input type="number" min="0" max="3" step="0.01" v-model="s2" />
      </div>
    </div>
    <div class="phoneWrapper">
      <div class="phone phone1">
        <PhoneElement
          :width="this.width"
          :borderColor="this.frameColor1"
          :imagePath="this.imagePath"
          :style="this.getRotationsCSS_1() + this.getDistanceCSS_1()"
        >
        </PhoneElement>
      </div>
      <div class="phone phone2">
        <PhoneElement
          :width="this.width"
          :borderColor="this.frameColor2"
          :imagePath="this.imagePath"
          :style="this.getRotationsCSS_2() + this.getDistanceCSS_2()"
        >
        </PhoneElement>
      </div>
    </div>
  </div>
</template>

<script>
import PhoneElement from "./PhoneElement";

export default {
  name: "DoublePhone3DElement",
  components: { PhoneElement },
  data() {
    return {};
  },
  methods: {
    getRotationsCSS_1() {
      return (
        `transform: scale(${this.s1}) rotateX(${this.x1}deg) rotateY(${this.y1}deg) rotateZ(${this.z1}deg);` +
        `box-shadow: ${1 * -this.y1}px ${1 *
          -this.x1}px 5px 0px rgba(0,0,0,0.75);`
      );
    },
    getRotationsCSS_2() {
      return (
        `transform: scale(${this.s2}) rotateX(${this.x2}deg) rotateY(${this.y2}deg) rotateZ(${this.z2}deg);` +
        `box-shadow: ${1 * -this.y2}px ${1 *
          -this.x2}px 5px 0px rgba(0,0,0,0.75);`
      );
    },
    getDistanceCSS_1() {
      return `position: relative; left: calc(${this.distanceBetweenPhones} / 2);`;
    },
    getDistanceCSS_2() {
      return `position: relative; right: calc(${this.distanceBetweenPhones} / 2);`;
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
    imagePath: {
      type: String,
      default: "/images/screenshots/idle.jpg",
    },
    distanceBetweenPhones: {
      type: String,
      default: "100px",
    },
    x1: {
      type: Number,
      default: 10,
    },
    y1: {
      type: Number,
      default: -20,
    },
    z1: {
      type: Number,
      default: 0,
    },
    s1: {
      type: Number,
      default: 1.1,
    },
    frameColor1: {
      type: String,
      default: "#afafaf",
    },
    x2: {
      type: Number,
      default: 10,
    },
    y2: {
      type: Number,
      default: -20,
    },
    z2: {
      type: Number,
      default: 0,
    },
    s2: {
      type: Number,
      default: 1.1,
    },
    frameColor2: {
      type: String,
      default: "#afafaf",
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.controlsWrapper {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(63, 7, 10, 0.521);
  z-index: 9999;
}
.controls {
  padding: 1rem;
  margin: 1rem;
  border: 1px dotted pink;
}
.wrapper {
  width: 100%;
  width: auto;
}
.phoneWrapper {
  width: 20vw;
  height: 40vw;
  perspective: 500px;
  transform-style: preserve-3d;
}

.phone1 {
  position: absolute;
}
</style>
