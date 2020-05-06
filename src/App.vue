<template>
  <div id="app">
    <HeaderElement></HeaderElement>
    <SloganHeader
      :title="this.sloganTitle"
      :description="this.sloganDescription"
      :phone1PositionLeftPercent="this.phone1PositionLeftPercent"
      :phone2PositionLeftPercent="this.phone2PositionLeftPercent"
      :phone1Rotate="phone1Rotate"
      :phone2Rotate="phone2Rotate"
      :contentLeft="sloganContentLeft"
    ></SloganHeader>

    <div class="bellow-slogan">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderElement from "./components/elements/HeaderElement";
import SloganHeader from "./components/elements/SloganHeader";
export default {
  name: "App",
  data() {
    return {
      sloganTitle: "",
      sloganDescription: "",
      phone1PositionLeftPercent: 70,
      phone2PositionLeftPercent: 75,
      phone1Rotate: 40,
      phone2Rotate: 50,
      sloganContentLeft: true
    };
  },
  components: { HeaderElement, SloganHeader },
  methods: {
    updateSloganHeader() {
      var path = window.location.hash.substr(1);
      switch (path) {
        case "/":
          this.sloganTitle = "STOTINA";
          this.sloganDescription = "Make the amazing simple.";
          this.phone1PositionLeftPercent = 60;
          this.phone2PositionLeftPercent = 75;
          this.phone1Rotate = 40;
          this.phone2Rotate = 50;
          this.sloganContentLeft = true;
          break;
        case "/apps":
          this.sloganTitle = "APPS";
          this.sloganDescription = "Our applications so far...";
          this.phone1PositionLeftPercent = 55;
          this.phone2PositionLeftPercent = 45;
          this.phone1Rotate = 50;
          this.phone2Rotate = 30;
          this.sloganContentLeft = true;
          break;
        default:
          this.sloganTitle = "Stotina";
          this.sloganDescription = "";
          this.phone1PositionLeftPercent = 60;
          this.phone2PositionLeftPercent = 75;
          this.phone1Rotate = 40;
          this.phone2Rotate = 50;
          this.sloganContentLeft = true;
          break;
      }
    }
  },
  created() {
    setInterval(this.updateSloganHeader, 200);
  }
};
</script>

<style>
html {
  overflow: -moz-scrollbars-vertical;
  overflow-y: scroll;
}
* {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #060606;
}
.titleFont {
  font-weight: bold;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
.bellow-slogan {
  background-color: #060606;
  position: relative;
  z-index: 2;
  min-height: max(20vw, 20vh);
}
</style>
