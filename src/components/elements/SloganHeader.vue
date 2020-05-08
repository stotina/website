<template>
  <div>
    <div id="appsPageHeader">
      <div id="appsPageHeaderContent" class="sc-bg3" :style="this.contentStyle">
        <div class="title titleFont">{{this.title}}</div>
        <p class="slogan">{{this.description}}</p>
      </div>
      <PhoneElement :style="phone1Style" id="appsPageHeaderPhone" :width="'15rem'"></PhoneElement>
      <PhoneElement :style="phone2Style" id="appsPageHeaderPhone2" :width="'18rem'"></PhoneElement>
    </div>
  </div>
</template>

<script>
import PhoneElement from "./PhoneElement";

export default {
  name: "SloganHeader",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: "STOTINA"
    },
    description: {
      type: String,
      default: "Make the amazing simple."
    },
    contentLeft: { type: Boolean, default: true },
    phone1Rotate: { type: Number, default: 40 },
    phone1PositionLeftPercent: { type: Number, default: 65 },
    phone1PositionTopPercent: { type: Number, default: 5 },
    phone2Rotate: { type: Number, default: 50 },
    phone2PositionLeftPercent: { type: Number, default: 75 },
    phone2PositionTopPercent: { type: Number, default: 5 }
  },
  components: {
    PhoneElement
  },
  computed: {
    phone1Style() {
      return (
        [
          `transform: rotate(${this.phone1Rotate}deg)`,
          `position: fixed`,
          `left: ${this.phone1PositionLeftPercent}%`,
          `top: ${this.phone1PositionTopPercent}%`
        ].join("; ") + ";"
      );
    },
    phone2Style() {
      return (
        [
          `transform: rotate(${this.phone2Rotate}deg)`,
          `position: fixed`,
          `left: ${this.phone2PositionLeftPercent}%`,
          `top: ${this.phone2PositionTopPercent}%`
        ].join("; ") + ";"
      );
    },
    contentStyle() {
      return (
        "position: relative; top: 10%;" +
        (this.contentLeft ? "left: 5%" : "left: 65%")
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#appsPageHeader {
  height: 400px;
  overflow: hidden;
}

#appsPageHeaderContent {
  display: inline-block;
  /* width: 20%; */
  /* min-width: 20rem; */
  z-index: 2;
  padding: 40px 25px;
  border-radius: 50px;
  font-weight: bold;
}

#appsPageHeaderContent .title {
  font-weight: bold;
  font-size: 2.4rem;
}
#appsPageHeaderContent .slogan {
  font-weight: bold;
  font-size: 1.2rem;
}

#appsPageHeaderPhone {
  transition: 0.5s ease-in-out;
  z-index: 1;
}
#appsPageHeaderPhone2 {
  transition: 0.5s ease-in-out;
  z-index: 1;
}
</style>
