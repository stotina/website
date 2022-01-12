<template>
  <div>
    <h1 class="text-center">CONSOLE: BSV 2.0.10</h1>
    <div class="console-wrapper">
      <div id="console-area"></div>
    </div>
  </div>
</template>

<script>
import * as htmlConsole from "../../assets/js/html-console";
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";
import { Buffer } from "../../assets/js/buffer";

window.bsvjs = bsvjs;
window.Buffer = Buffer;

export default {
  name: "BSVJS-2.0.10",
  data() {
    return {};
  },
  mounted: () => {
    htmlConsole.create(document.getElementById("console-area"), {
      height: "30em",
    });
    console.warn(`*** BSV ${bsvjs.version} loaded as variable 'bsvjs' ***`);
    console.log("------------");
    console.info("Some examples:");
    console.info("bsvjs.Tx.fromHex(hexString)");
    console.info("bsvjs.Address.fromPrivKey(bsvjs.PrivKey.fromRandom())");
    console.info("bsvjs.Bip39.fromRandom()");
    console.info(
      "bsvjs.Script.fromHex('76a9145a608ac563f2f15594dcc070c6d9e1fa14db43a988ac')"
    );
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
