<template>
  <div>
    <h1 class="text-center">Decode Transaction</h1>
    <div class="mainContainer px-5 pb-3">
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

    <div class="mx-5 px-5 mx-auto" v-if="decodedTxParts">
      <div class="text-center pb-3" v-html="txHint"></div>
      <div class="byteContainer">
        <span
          v-bind:class="{
            pointer: true,
            byte: true,
            [`group_${i.group}`]: true,
            [`type_${i.type}`]: true,
          }"
          v-bind:style="{ ...i.style }"
          v-for="i in decodedTxPartsByByte || []"
          :key="i.id"
          v-html="i.str"
          data-toggle="tooltip"
          data-placement="bottom"
          data-html="true"
          v-bind:title="i.type"
          @click="(e) => onByteClick(i)"
        ></span>
      </div>
      <div class="text-right groupHintBox mt-3" v-html="decodedGroupHint"></div>
      <div class="text-right partHintBox" v-html="decodedPartHint"></div>
    </div>

    <div class="resultContainer px-3 pt-3">
      <div class="inputContainer input-group mx-auto row">
        <div class="row col-sm-12 col-md-6">
          <h3 class="col-12 text-center">BSVJS</h3>
          <textarea
            type="text"
            class="form-control col-11 m-auto"
            rows="15"
            v-model="parsedBsvJson"
            disabled
          ></textarea>
        </div>
        <div class="row col-sm-12 col-md-6">
          <h3 class="col-12 text-center">TXO</h3>
          <textarea
            type="text"
            class="form-control col-11 m-auto"
            rows="15"
            v-model="parsedTxoJson"
            disabled
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";
import * as TXO from "../../assets/js/txo/index";
import { decodeTxParts } from "../tools/txDecoder/txDecoder";
import $ from "jquery";
import { getRawTx } from "../../assets/js/whatsOnChain";

export default {
  name: "Decode-Raw-Tx",
  data() {
    const rawtx = this.$route.params.rawtx || "";

    return {
      rawtx,
      txHint: "",
      parsedBsv: undefined,
      parsedTxo: undefined,
      decodedTxParts: undefined,
      decodedGroupHint: "",
      decodedPartHint: "",
      colors: {},
    };
  },
  watch: {
    $route() {
      this.parseFromRouteParam();
    },
  },
  mounted() {
    this.$nextTick(function() {
      this.onDecodeClick();
    });
  },
  methods: {
    async onDecodeClick() {
      if (this.$route.params.rawtx !== this.rawtx) {
        this.$router.push(
          "/tools/decoderaw/" + encodeURIComponent(this.rawtx || "")
        );
      }
      this.parseFromRouteParam();
    },
    async parseFromRouteParam() {
      this.rawtx = this.$route.params.rawtx || "";
      this.txHint = "";
      try {
        this.parsedBsv = bsvjs.Tx.fromHex(this.rawtx);
        this.parsedTxo = await TXO.fromTx(this.rawtx);
        this.decodedTxParts = decodeTxParts(this.rawtx);
        this.txHint = "Parsed TX : " + this.parsedBsv.id();
        window.tx = this.parsedBsv;
      } catch (error) {
        if (this.rawtx.length === 64) {
          // This could be a txid. try to get from WhatsOnChain
          const hex = await getRawTx(this.rawtx, "main");
          this.rawtx = hex;
          if (this.$route.params.rawtx !== this.rawtx) {
            this.$router.push(
              "/tools/decoderaw/" + encodeURIComponent(this.rawtx || "")
            );
          }
        } else {
          this.parsedBsv = undefined;
          this.parsedTxo = undefined;
          this.decodedTxParts = undefined;
        }
      }
    },
    calcColor(base, f, change) {
      const c = { ...base };
      c[f] = base[f] + change;
      return [
        `#`,
        c.r.toString(16).padStart(2, "0"),
        c.g.toString(16).padStart(2, "0"),
        c.b.toString(16).padStart(2, "0"),
      ].join("");
    },
    getStyle(group, type) {
      if (type === "versionBytesNum") return { color: "#25c1dd" };
      if (type === "txInsVi") return { color: "#dd5025" };

      if (group?.startsWith("input_")) {
        let groupColor = this.colors[group];
        if (!groupColor) {
          groupColor = {
            r: (150 + Math.random() * 106) | 0,
            g: 255,
            b: (150 + Math.random() * 106) | 0,
          };
          this.colors[group] = groupColor;
        }
        if (type === group + "_txHashBuf")
          return { color: this.calcColor(groupColor, "r", -50) };
        if (type === group + "_txOutNum")
          return { color: this.calcColor(groupColor, "r", 0) };
        if (type === group + "_scriptVi")
          return { color: this.calcColor(groupColor, "r", -50) };
        if (type === group + "_script")
          return { color: this.calcColor(groupColor, "r", 0) };
        if (type === group + "_nSequence")
          return { color: this.calcColor(groupColor, "r", -50) };
        else return { color: "green" };
      }

      if (type === "txOutsVi") return { color: "#dd5025" };

      if (group?.startsWith("output_")) {
        let groupColor = this.colors[group];
        if (!groupColor) {
          groupColor = {
            r: (150 + Math.random() * 106) | 0,
            g: (150 + Math.random() * 106) | 0,
            b: 255,
          };
          this.colors[group] = groupColor;
        }
        if (type === group + "_valueBn")
          return { color: this.calcColor(groupColor, "r", 0) };
        if (type === group + "_scriptVi")
          return { color: this.calcColor(groupColor, "r", -100) };
        if (type === group + "_script")
          return { color: this.calcColor(groupColor, "r", 0) };
        else return { color: "blue" };
      }

      if (type === "nLockTime") return { color: "#dadd25" };

      return { color: "white" };
    },
    onByteClick(byte) {
      $(".selectedGroup").removeClass("selectedGroup");
      $(".selectedType").removeClass("selectedType");
      $(".group_" + byte.group).addClass("selectedGroup");
      $(".type_" + byte.type).addClass("selectedType");

      const part = this.decodedTxParts.find((p) => p.type === byte.type);

      this.decodedGroupHint = "";
      this.decodedPartHint = "";

      if (byte.group.startsWith("input_")) {
        const split = byte.type.split("_");
        const i = split[1];
        const t = split[2];
        this.decodedGroupHint = `This is the '${t}' - a part of the ${i}-th Input`;
        if (t === "script") {
          this.decodedPartHint =
            `<a href="/#/tools/scripteval/?type=ASM&txInput=${this.parsedBsv.id()}_i${i}" target=”_blank”">` +
            `Go to the script evaluator` +
            `</a> to inspect scirpt`;
        } else {
          this.decodedPartHint = part.val;
        }
      } else if (byte.group.startsWith("output_")) {
        const split = byte.type.split("_");
        const i = split[1];
        const t = split[2];
        this.decodedGroupHint = `This is the '${t}' - a part of the ${i}-th Output`;
        this.decodedPartHint = part.val;
        // TODO: if script is OP_RETURN, add URL that redirects to DATA CONVERSION PAGE (convert hex to utf8)
      } else {
        this.decodedGroupHint = `This is the '${byte.type}'`;
        this.decodedPartHint = part?.val;
      }
    },
  },
  props: {},
  components: {},
  computed: {
    parsedBsvJson() {
      return JSON.stringify(this.parsedBsv || "Failed to parse...", null, 4);
    },
    parsedTxoJson() {
      return JSON.stringify(this.parsedTxo || "Failed to parse...", null, 4);
    },
    decodedTxPartsByByte() {
      if (!this.decodedTxParts) return [];

      const byteParts = [];

      for (let iPart = 0; iPart < this.decodedTxParts.length; iPart++) {
        const part = this.decodedTxParts[iPart];
        const buf = Buffer.from(part.buf);
        for (let i = 0; i < buf.length; i++) {
          const byte = buf[i];

          byteParts.push({
            id: iPart + "." + i,
            type: part.type,
            group: part.group || part.type,
            str: byte.toString(16).padStart(2, "0"),
            style: this.getStyle(part.group, part.type),
          });
        }
      }
      return byteParts;
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
  color: #25c1dd;
}
.byteContainer {
  max-height: 30rem;
  overflow-y: scroll;
  overflow-x: unset;
}
.byte {
  display: inline-block;
  padding-bottom: 6px;
  padding-left: 4px;
  text-align: center;
  vertical-align: center;
  border: 1px solid transparent;
}

.byte.selectedGroup {
  background-color: #ffffff22;
}
.byte.selectedType {
  border-bottom: 1px solid white;
  border-top: 1px solid white;
  background-color: #ffffff44;
}
.groupHintBox {
  height: 1rem;
  text-decoration: underline;
}
.partHintBox {
  min-height: 5rem;
  max-height: 5rem;
  overflow: hidden;
}
</style>
