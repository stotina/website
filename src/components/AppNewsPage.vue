<template>
  <div>
    <div class="phones">
      <div class="phones3d">
        <Phone3DElement
          :frameColor="'#535353'"
          :showControls="false"
          :positionRight="true"
          :positionSide="150"
          :positionTop="80"
          :imagePath="'/images/screenshots/idle.jpg'"
          :y="-15 + this.x*30"
          :x="10"
          :s="1.1"
        ></Phone3DElement>
        <Phone3DElement
          :frameColor="'white'"
          :showControls="false"
          :positionRight="true"
          :positionSide="300"
          :positionTop="120"
          :imagePath="'/images/screenshots/idle.jpg'"
          :y="-25 + this.x*50"
          :x="15"
          :s="1"
        ></Phone3DElement>
      </div>
      <div class="phones2d">
        <PhoneElement
          id="phoneFrame2d"
          :width="'300px'"
          :borderColor="'gray'"
          :imagePath="'/images/screenshots/idle.jpg'"
        ></PhoneElement>
      </div>
    </div>

    <div class="content">
      <br />Lorem Ipsum
      <br />Lorem Ipsum
      <br />Lorem Ipsum
      <br />Lorem Ipsum
      <br />Lorem Ipsum
      <br />Lorem Ipsum
      <br />Lorem Ipsum
      <br />Lorem Ipsum
      <br />Lorem Ipsum
      <br />Lorem Ipsum
    </div>

    <div class="footer"></div>
  </div>
</template>

<script>
import Phone3DElement from "./elements/Phone3DElement";
import PhoneElement from "./elements/PhoneElement";

export default {
  name: "AppNewsPage",
  data() {
    return {
      x: 0.5,
      w: document.body.clientWidth
    };
  },
  computed: {},
  created() {
    document.addEventListener("mousemove", this.onMouseUpdate, false);
  },
  methods: {
    onMouseUpdate(e) {
      this.w = document.body.clientWidth;
      this.x = e.pageX / this.w;
    }
  },
  components: {
    Phone3DElement,
    PhoneElement
  },
  props: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.phones2d {
  position: absolute;
  top: 6vw;
  right: 8vw;
  transform: rotate(5deg);
}
.content {
  padding-bottom: 120px;
  border: 1px solid pink;
  width: 50%;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-color: #b9b9b923;
}
@media only screen and (max-width: 1300px) {
  .phones3d {
    display: none;
  }
}
@media only screen and (min-width: 1300px) {
  .phones2d {
    display: none;
  }
}
@media only screen and (max-width: 700px) {
  .phones3d {
    display: none;
  }
  .phones2d {
    display: none;
  }
  .content {
    width: 100%;
  }
}
</style>
