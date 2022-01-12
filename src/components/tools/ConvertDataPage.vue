<template>
  <div>
    <h1 class="text-center">Data Converter</h1>
    <!-- // TODO: Implement this tool -->

    <div class="ml-4">
      <div class="input-group row">
        <select
          class="form-select col-sm-6 col-md-2"
          id="selectFrom"
          v-model="selectedTypeFrom"
          v-on:change="onUpdate()"
        >
          <option
            v-for="option in dataTypes"
            v-bind:key="option"
            :value="option"
            >{{ option }}</option
          >
        </select>
        <label class="input-group-text col-sm-2 col-md-1" for="selectFrom"
          >FROM</label
        >

        <label class="input-group-text col-sm-4 col-md-2" for="selectFrom">
        </label>

        <div
          type="button"
          v-on:click="swap()"
          class="btn btn-secondary col-sm-12 col-md-2"
        >
          ⇔
        </div>

        <label class="input-group-text col-sm-4 col-md-2" for="selectTo">
        </label>

        <label
          class="input-group-text text-end col-sm-2 col-md-1"
          for="selectTo"
          >INTO</label
        >
        <select
          class="form-select col-sm-6 col-md-2"
          id="selectTo"
          v-model="selectedTypeTo"
          v-on:change="onUpdate()"
        >
          <option
            v-for="option in dataTypes"
            v-bind:key="option"
            :value="option"
            >{{ option }}</option
          >
        </select>
      </div>
    </div>
    <div class="my-2"></div>
    <div class="row">
      <div class="form-floating col-sm-12 col-md-6">
        <div class="m-5">
          <textarea
            class="form-control"
            v-model="inputValue"
            v-on:change="onUpdate()"
            v-on:keyup="onUpdate()"
            id="inputArea"
            placeholder="Awaiting Input..."
            rows="15"
          ></textarea>
        </div>
      </div>
      <div class="form-floating col-sm-12 col-md-6">
        <div class="m-5">
          <textarea
            class="form-control"
            v-model="outputValue"
            disabled
            id="inputArea"
            rows="15"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Buffer } from "../../assets/js/buffer";
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";

window.Buffer = Buffer;

const dataTypes = [
  "ascii",
  "utf8",
  "utf16le",
  "ucs2",
  "base64",
  "hex",
  "asm-script",
  "bitcoind-script",
  "base-58",
];

export default {
  name: "Convert-Data",
  data() {
    return {
      dataTypes,
      selectedTypeFrom: "utf8",
      selectedTypeTo: "hex",
      inputValue: "",
      outputValue: "",
    };
  },
  methods: {
    swap() {
      const tempFrom = this.selectedTypeFrom;
      this.selectedTypeFrom = this.selectedTypeTo;
      this.selectedTypeTo = tempFrom;
      this.inputValue = this.outputValue;
      this.onUpdate();
    },
    onUpdate() {
      let inputBuf;
      try {
        if (this.selectedTypeFrom === "base-58") {
          inputBuf = bsvjs.Base58.decode(this.inputValue);
        } else if (this.selectedTypeFrom === "asm-script") {
          inputBuf = bsvjs.Script.fromAsmString(this.inputValue).toBuffer();
        } else if (this.selectedTypeFrom === "bitcoind-script") {
          inputBuf = bsvjs.Script.fromBitcoindString(
            this.inputValue
          ).toBuffer();
        } else {
          inputBuf = Buffer.from(this.inputValue, this.selectedTypeFrom);
        }

        if (this.selectedTypeTo === "base-58") {
          this.outputValue = bsvjs.Base58.encode(inputBuf);
        } else if (this.selectedTypeTo === "asm-script") {
          this.outputValue = bsvjs.Script.fromBuffer(
            inputBuf
          ).toAsmString();
        } else if (this.selectedTypeTo === "bitcoind-script") {
          this.outputValue = bsvjs.Script.fromBuffer(
            inputBuf
          ).toBitcoindString();
        } else {
          this.outputValue = inputBuf.toString(this.selectedTypeTo);
        }
      } catch (error) {
        console.debug(inputBuf);
        this.outputValue = error.stack;
      }
    },
  },
  props: {},
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.text-end {
  text-align: end !important;
}
.swapBtn {
  border-radius: 100px;
  border: none;
}
</style>
