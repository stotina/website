<template>
  <div>
    <div id="appsPageHeader">
      <div id="appsPageHeaderContent" :style="this.contentStyle">
        <h3 class="titleFont">{{this.title}}</h3>
        <p>{{this.description}}</p>
      </div>
      <PhoneElement :style="phone1Style" id="appsPageHeaderPhone" :width="'250px'"></PhoneElement>
      <PhoneElement :style="phone2Style" id="appsPageHeaderPhone2" :width="'280px'"></PhoneElement>
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
  background-color: #ffffff11;
  height: 400px;
  overflow: hidden;
}

#appsPageHeaderContent {
  transition: 1s ease-in-out;
  width: 20%;
  min-width: 20rem;
  z-index: 2;
  padding: 40px 25px;
  background-color: #0e3e53;
  border-radius: 50px;
  font-weight: bold;
}

#appsPageHeaderPhone {
  transition: 1s ease-in-out;
  z-index: 1;
}
#appsPageHeaderPhone2 {
  transition: 1s ease-in-out;
  z-index: 1;
}
</style>
