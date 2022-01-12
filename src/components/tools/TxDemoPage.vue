<template>
  <div>
    <h1 class="text-center">BSV Transaction Demo</h1>
    <div class="console-wrapper">
      <div id="console-area"></div>
    </div>
  </div>
</template>

<script>
import * as bsvDemo from "./txdemo/bsvDemo";
import * as htmlConsole from "../../assets/js/html-console";
import { Buffer } from "../../assets/js/buffer";

window.Buffer = Buffer;

export default {
  name: "TX-Demo-Console",
  data() {
    return {};
  },
  mounted: () => {
    htmlConsole.create(document.getElementById("console-area"), {
      height: "30em",
    });
    console.warn("*** Welcome to the BSV Transaction Builder ***");
    console.log("------------");
    bsvDemo.help();
  },
  props: {},
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.console-wrapper {
  padding: 20px;
}
</style>
