<template>
  <div>
    <div id="appsPageHeader">
      <div id="appsPageHeaderContent">
        <h3>Applications:</h3>
        <p>These are the applications we have developed so far.</p>
      </div>
      <PhoneElement id="appsPageHeaderPhone" :widthPx="250"></PhoneElement>
      <PhoneElement id="appsPageHeaderPhone2" :widthPx="280"></PhoneElement>
      <!-- <div id="appsPageHeaderPhone">
        <InteractiveLogo :widthPercent="60"></InteractiveLogo>
        <div class="appPageHeaderPhoneTitle">STOTINA</div>
      </div>-->
    </div>
    <div id="appListArea">
      <AppListElement></AppListElement>
    </div>
  </div>
</template>

<script>
import AppListElement from "./elements/AppListElement";
import PhoneElement from "./elements/PhoneElement";

export default {
  name: "AppsPage",
  data() {
    return {};
  },
  props: {},
  components: {
    AppListElement,
    PhoneElement
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
  position: relative;
  top: 100px;
  padding: 40px 25px;
  background-color: #ffffff11;
  border-radius: 50px;
}

#appsPageHeaderPhone {
  transform: rotate(40deg);
  position: fixed;
  left: 65%;
  top: 5%;
  z-index: 1;
}
#appsPageHeaderPhone2 {
  transform: rotate(50deg);
  position: fixed;
  left: 75%;
  top: 5%;
  z-index: 1;
}
#appListArea {
  background-color: #060606;
  position: relative;
  z-index: 2;
}
</style>
