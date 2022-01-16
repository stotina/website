<template>
  <div>
    <h1 class="text-center">Decode Transaction</h1>
    <div class="mainContainer px-5">
      <div class="inputContainer input-group mx-auto row">
        <textarea
          type="text"
          id="decodeInput"
          class="form-control col-sm-12 col-md-9"
          v-model="rawtx"
        ></textarea>
        <input
          type="button"
          id="decodeBtn"
          class="btn btn-primary form-control col-sm-12 col-md-3"
          value="Decode"
          @click="onDecodeClick"
        />
      </div>
    </div>
    <div class="resultContainer px-3 pt-5">
      <div class="inputContainer input-group mx-auto row">
        <div class="row col-sm-12 col-md-6">
          <h3 class="col-12 text-center">BSVJS</h3>
          <textarea
            type="text"
            class="form-control col-11 m-auto"
            rows="15"
            v-model="parsedBsvJson"
          ></textarea>
        </div>
        <div class="row col-sm-12 col-md-6">
          <h3 class="col-12 text-center">TXO</h3>
          <textarea
            type="text"
            class="form-control col-11 m-auto"
            rows="15"
            v-model="parsedTxoJson"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";
import * as TXO from "../../assets/js/txo/index";

export default {
  name: "Decode-Raw-Tx",
  data() {
    return {
      rawtx:
        "01000000016781845c895e2d890f771945a34df5d61250603739d978ba13113aa278eeeb6b050000006a47304402200cc1ef10239c86283933ae4c95c137cb9b6d7e5da3e6bc28adc4b6a3b95b771b02205a7b76dfd04d87b473e1b943aace1e067a6bd92b361c360c23775af092c15f26412102d192abc5743b82d48572dd088656e4a25697fac3780d49dc6a5e6a543670937fffffffff0123020000000000001976a9140a543bb97f54ec5a79f4d3e73bb82755d22b6bf788ac00000000",
      parsedBsv: undefined,
      parsedTxo: undefined,
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.onDecodeClick();
    });
  },
  methods: {
    async onDecodeClick() {
      this.parsedBsv = bsvjs.Tx.fromHex(this.rawtx);
      this.parsedTxo = await TXO.fromTx(this.rawtx);
    },
  },
  props: {},
  components: {},
  computed: {
    parsedBsvJson() {
      return JSON.stringify(this.parsedBsv, null, 4);
    },
    parsedTxoJson() {
      return JSON.stringify(this.parsedTxo, null, 4);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#decodeInput {
  min-height: 6rem;
  max-height: 6rem;
}
#decodeBtn {
  height: 6rem;
}
</style>
