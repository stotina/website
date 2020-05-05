<template>
  <div>
    <div id="appsPageHeader">
      <div id="appsPageHeaderContent">
        <h3>Applications:</h3>
        <p>These are the applications we have developed so far.</p>
      </div>
      <div id="appsPageHeaderPhone">
        <InteractiveLogo :widthPercent="60"></InteractiveLogo>
        <div class="appPageHeaderPhoneTitle">STOTINA</div>
      </div>
    </div>
    <div id="appListArea">
      <AppListElement></AppListElement>
    </div>
  </div>
</template>

<script>
import AppListElement from "./elements/AppListElement";
import InteractiveLogo from "./elements/InteractiveLogo";

export default {
  name: "AppsPage",
  data() {
    return {};
  },
  props: {},
  components: {
    AppListElement,
    InteractiveLogo
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
  border: 1px solid pink;
  transition: 1s ease-in-out;

  width: 50%;
  height: 200px;
  position: relative;
  top: 100px;
  padding: 20px;
}

#appsPageHeaderPhone {
  width: 300px;
  height: 600px;
  background-color: #d5f0ff2d;
  border: 10px solid black;
  border-top: 40px solid black;
  border-bottom: 30px solid black;
  border-radius: 10px;
  transform: rotate(50deg);
  position: fixed;
  left: 70%;
  top: 5%;
  z-index: 1;
  padding-top: 130px;
  text-align: center;
  color: black;
  font-size: 30px;
  font-weight: bold;
}
#appListArea {
  background-color: #060606;
  position: relative;
  z-index: 2;
}
</style>
