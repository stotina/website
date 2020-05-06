<!-- Component A -->
<template>
  <div class="wrapper">
    <div id="controls" style="padding:1rem;" v-if="this.showControls">
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
      <input type="range" min="-5" max="3" step="0.01" v-model="s" /> -
      <input type="number" min="-5" max="3" step="0.01" v-model="s" />
      <br />
      <br />
      <span>top :</span>
      <input type="range" min="0" max="500" step="10" v-model="positionTop" /> -
      <input type="number" min="0" max="500" step="10" v-model="positionTop" />
      <br />
      <span>side:</span>
      <input type="range" min="0" max="500" step="10" v-model="positionSide" /> -
      <input type="number" min="0" max="500" step="10" v-model="positionSide" />
    </div>

    <div class="phoneWrapper" v-bind:style="this.wrapperPositionCss">
      <div class="phoneFrame" v-bind:style="this.phoneTransformCSS">
        <img :src="this.imagePath" />
      </div>
      <div class="phoneThickness phoneThickness1" v-bind:style="this.thickness1TransformCSS"></div>
      <div class="phoneThickness phoneThickness2" v-bind:style="this.thickness2TransformCSS"></div>
      <div class="phoneThickness phoneThickness3" v-bind:style="this.thickness3TransformCSS"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Phone3DElement",
  components: {},
  data() {
    return {};
  },
  methods: {
    getRotationsCSS() {
      return `transform: scale(${this.s}) rotateX(${this.x}deg) rotateY(${this.y}deg) rotateZ(${this.z}deg)`;
    },
    getThicknessCSSPart(step) {
      return (
        `translateX(${(this.x / 3) * step}px) ` +
        `translateY(${(this.y / 10) * step}px) ` +
        `translateZ(${-0.15 * step}vw)`
      );
    }
  },
  computed: {
    wrapperPositionCss() {
      return (
        `position: absolute; ` +
        `top: ${this.positionTop}px; ` +
        `${this.positionRight ? "right" : "left"}: ${this.positionSide}px;`
      );
    },
    phoneTransformCSS() {
      console.log("phoneTransformCSS CALLED");
      return this.getRotationsCSS() + ";";
    },
    thickness1TransformCSS() {
      return this.getRotationsCSS() + " " + this.getThicknessCSSPart(1) + ";";
    },
    thickness2TransformCSS() {
      return this.getRotationsCSS() + " " + this.getThicknessCSSPart(2) + ";";
    },
    thickness3TransformCSS() {
      return this.getRotationsCSS() + " " + this.getThicknessCSSPart(3) + ";";
    }
  },
  props: {
    positionRight: {
      type: Boolean,
      default: true
    },
    positionSide: {
      type: Number,
      default: 150
    },
    positionTop: {
      type: Number,
      default: 100
    },
    showControls: {
      type: Boolean,
      default: false
    },
    x: {
      type: Number,
      default: 10
    },
    y: {
      type: Number,
      default: -20
    },
    z: {
      type: Number,
      default: 0
    },
    s: {
      type: Number,
      default: 1.1
    },
    frameColor: {
      type: String,
      default: "#afafaf"
    },
    imagePath: {
      type: String,
      default: "/images/screenshots/vulcano.jpg"
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  overflow: hidden;
  width: 100%;
  display: inline-block;
  width: auto;
}
.phoneWrapper {
  perspective: 500px;
  width: 20vw;
  height: 40vw;
  transform-style: preserve-3d;
}
.phoneFrame {
  display: block;
  width: 100%;
  height: 100%;
  border-style: solid;
  border-color: white;
  border-radius: 0.75vw;
  border-width: 0.75vw;
  border-top-width: 3vw;
  border-bottom-width: 1.5vw;
  position: absolute;
}
.phoneFrame img {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid black;
}
.phoneThickness {
  position: absolute;
  border-radius: 15px;
  display: block;
  width: 100%;
  height: 100%;
  background-color: #818181;
  border: 1px solid #5e5e5e;
}
</style>