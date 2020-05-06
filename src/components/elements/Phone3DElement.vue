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
      <input type="range" min="0" max="3" step="0.01" v-model="s" /> -
      <input type="number" min="0" max="3" step="0.01" v-model="s" />
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
      <div class="phoneThickness" v-bind:style="this.getThicknessCSS(1, 6)"></div>
      <div class="phoneThickness" v-bind:style="this.getThicknessCSS(2, 6)"></div>
      <div class="phoneThickness" v-bind:style="this.getThicknessCSS(3, 6)"></div>
      <div class="phoneThickness" v-bind:style="this.getThicknessCSS(4, 6)"></div>
      <div class="phoneThickness" v-bind:style="this.getThicknessCSS(5, 6)"></div>
      <div class="phoneThickness" v-bind:style="this.getThicknessCSS(6, 6)"></div>
      <div
        class="phoneFrame"
        v-bind:style=" `border-color:${this.frameColor};` + this.phoneTransformCSS"
      >
        <img :src="this.imagePath" />
      </div>
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
    getThicknessCSS(index, ofTotal) {
      var translateCSS =
        `translateX(${-(this.y / ofTotal) * index}px) ` +
        `translateY(${(this.x / ofTotal) * index}px) ` +
        `translateZ(${(-0.9 / ofTotal) * index}vw) scale(${1 -
          (0.03 / ofTotal) * index})`;
      return this.getRotationsCSS() + " " + translateCSS + ";";
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
      default: "/images/screenshots/idle.jpg"
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
  width: 20vw;
  height: 40vw;
  perspective: 500px;
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
  background-color: #7a7181;
}
</style>