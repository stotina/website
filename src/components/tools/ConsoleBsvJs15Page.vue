<template>
  <div>
    <h1 class="text-center">CONSOLE: BSV 1.5.6</h1>
    <div class="console-wrapper">
      <div id="console-area"></div>
    </div>
  </div>
</template>

<script>
import * as htmlConsole from "../../assets/js/html-console";
import bsv from "../../assets/js/bsb.1.5.6/bsv.min";
import bsvMnemonic from "../../assets/js/bsb.1.5.6/bsv-mnemonic.min";
import bsvMessage from "../../assets/js/bsb.1.5.6/bsv-message.min";
import bsvEcies from "../../assets/js/bsb.1.5.6/bsv-ecies.min";

window.bsv = bsv
window.bsvMnemonic = bsvMnemonic
window.bsvMessage = bsvMessage
window.bsvEcies = bsvEcies

export default {
  name: "BSVJS-1.5.6",
  data() {
    return {};
  },
  mounted: () => {
    htmlConsole.create(document.getElementById("console-area"), {
      height: "30em",
    });
    console.warn(`*** BSV ${bsv.version} loaded as variable 'bsv' ***`);
    console.log("------------");
    console.info("Some examples:")
    console.info("bsv.Transaction.fromHex(hexString)")
    console.info("bsv.PrivateKey.fromRandom().toAddress()")
    console.info("bsv.Mnemonic.fromRandom().toString()")
    console.info("bsv.Script.fromHex('76a9145a608ac563f2f15594dcc070c6d9e1fa14db43a988ac')")
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
