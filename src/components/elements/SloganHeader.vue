<template>
  <div>
    <div id="appsPageHeader">
      <div id="appsPageHeaderContent">
        <h3 class="titleFont">{{this.title}}</h3>
        <p>{{this.description}}</p>
      </div>
      <PhoneElement :style="phone1Style" id="appsPageHeaderPhone" :widthPx="250"></PhoneElement>
      <PhoneElement :style="phone2Style" id="appsPageHeaderPhone2" :widthPx="280"></PhoneElement>
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#appsPageHeader {
  background-color: #ffffff11;
  padding: 0 10%;
  height: 400px;
  overflow: hidden;
}

#appsPageHeaderContent {
  width: 50%;
  min-width: 15rem;
  position: relative;
  z-index: 2;
  top: 100px;
  padding: 40px 25px;
  background-color: #ffffff11;
  border-radius: 50px;
}

#appsPageHeaderPhone {
  transition: 1s ease-in-out;
}
#appsPageHeaderPhone2 {
  transition: 1s ease-in-out;
}
</style>
