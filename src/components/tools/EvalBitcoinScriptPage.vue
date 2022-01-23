<template>
  <div>
    <h1 class="text-center">Evaluate Bitcoin Script</h1>
    <div class="mainContainer px-3 pt-3">
      <div class="inputContainer input-group mx-auto row m-3">
        <div class="row col-md-12 col-lg-6">
          <label class="input-group-text col-md-4" for="selectScriptTypeFrom"
            >Format</label
          >
          <select
            class="form-select col-md-8"
            id="selectScriptTypeFrom"
            v-model="expectedScriptType"
            v-on:change="onExpectedTypeChange()"
          >
            <option
              v-for="type in possibleScriptTypes"
              v-bind:key="type"
              :value="type"
              >{{ type }}</option
            >
          </select>
        </div>
        <div
          class="row col-md-12 col-lg-6"
          v-if="
            expectedScriptType !== parsedScriptType &&
              mostMatchedLines !== selectedParsingData.matchCount
          "
        >
          <div class="input-group-text col-md-6">
            But looks like {{ parsedScriptType }}
          </div>
          <input
            type="button"
            class="btn btn-primary form-control col-md-6"
            v-bind:value="`Use ${parsedScriptType}`"
            v-on:click="expectedScriptType = parsedScriptType"
          />
        </div>
      </div>

      <div class="mx-auto row">
        <div
          class="lineNumContainer text-right d-none d-sm-block col-sm-1 col-md-auto"
        >
          <div
            class="scriptLineNumber"
            v-for="i in scriptLines.keys()"
            :key="i"
          >
            <span
              v-bind:class="{
                lineNum: true,
                scriptInterruptedHere:
                  (contextsByLine[i] || {}).interrupted &&
                  !(contextsByLine[i] || {}).endedWithOpReturn,
              }"
            >
              {{ i }}
            </span>
          </div>
        </div>

        <textarea
          type="text"
          wrap="off"
          class="scriptInput text-left form-control col-sm-6 col-md-7"
          v-model="rawScript"
          v-on:scroll="onScriptEditorScroll"
          v-on:input="onScriptEditorInput"
        ></textarea>

        <div class="contextsContainer col px-3">
          <div
            class="scriptLineContext"
            v-for="ctx in contextsByLine"
            :key="ctx.i"
          >
            <div class="row">
              <div class="ctxProp col col-sm-2">
                <div
                  v-if="parsedAsmLines[ctx.i] !== 'undefined'"
                  class="lineParsed customTooltip"
                >
                  code
                  <div class="customTooltipBottom">
                    {{ parsedAsmLines[ctx.i] }} parsed from
                    {{ parsedScriptType }}
                    <i></i>
                  </div>
                </div>
                <div v-else class="elseEl">code</div>
              </div>
              <div class="ctxProp col col-sm-2">
                <div
                  v-if="ctx.interrupted"
                  class="lineEndMessage customTooltip"
                >
                  End
                  <div class="customTooltipBottom">
                    {{ ctx.endMessage }}
                    <i></i>
                  </div>
                </div>
                <div v-else class="elseEl">End</div>
              </div>
              <div class="ctxProp col col-sm-3">
                <div
                  v-if="(ctx.stack || []).length"
                  class="lineStack customTooltip"
                >
                  Stack({{ ctx.stack.length }})
                  <div class="customTooltipBottom">
                    <div
                      class="hideOverflow"
                      v-for="i in ctx.stack.keys()"
                      :key="i"
                    >
                      {{ ctx.stack[i].toString("hex") }}
                    </div>
                    <i></i>
                  </div>
                </div>
                <div v-else class="elseEl">Stack</div>
              </div>
              <div class="ctxProp col col-sm-3">
                <div
                  v-if="(ctx.altStack || []).length"
                  class="lineAltStack customTooltip"
                >
                  Alt({{ ctx.altStack.length }})
                  <div class="customTooltipBottom">
                    <div
                      class="hideOverflow"
                      v-for="i in ctx.altStack.keys()"
                      :key="i"
                    >
                      {{ ctx.altStack[i].toString("hex") }}
                    </div>
                    <i></i>
                  </div>
                </div>
                <div v-else class="elseEl">Alt</div>
              </div>
              <div class="ctxProp col col-sm-2">
                <div
                  v-if="(ctx.opReturn || []).length"
                  class="lineOpReturn customTooltip"
                >
                  Return({{ ctx.opReturn.length }})
                  <div class="customTooltipBottom">
                    <div
                      class="hideOverflow"
                      v-for="i in ctx.opReturn.keys()"
                      :key="i"
                    >
                      {{ opReturnItemToString(ctx.opReturn[i]) }}
                    </div>
                    <i></i>
                  </div>
                </div>
                <div v-else class="elseEl">Return</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row col-md-12 col-lg-6 m-4 mx-auto">
        <label class="input-group-text col px-3" for="selectConvertFrom"
          >Convert from</label
        >
        <select
          class="form-select col px-3"
          id="selectConvertFrom"
          v-model="convertFromSelectType"
          v-on:change="onConvertFromSelectTypeChange"
        >
          <option
            v-for="type in possibleScriptTypes"
            v-bind:key="type"
            :value="type"
            >{{ type }}</option
          >
        </select>
        <label class="input-group-text col px-3" for="selectConvertTo"
          >to</label
        >
        <select
          class="form-select col px-3"
          id="selectConvertTo"
          v-model="convertToSelectType"
        >
          <option
            v-for="type in possibleScriptTypes"
            v-bind:key="type"
            v-bind:disabled="type === convertFromSelectType"
            :value="type"
            >{{ type }}</option
          >
        </select>
        <input
          type="button"
          class="btn btn-danger form-control col px-3"
          v-bind:value="`Convert`"
          v-on:click="convertScript(convertFromSelectType, convertToSelectType)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Buffer } from "../../assets/js/buffer";
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";
import { bitcoinScriptEval } from "../../assets/js/bitcoin-script-eval/index";
import $ from "jquery";
import { getRawTx } from "../../assets/js/whatsOnChain";

const possibleScriptTypes = ["ASM", "BITD", "HEX"];

export default {
  name: "Evaluate-Bitcoin-Script",
  data() {
    return {
      possibleScriptTypes,
      expectedScriptType: possibleScriptTypes[0],
      rawScript: "",
      scriptLines: [],
      mostMatchedLines: 0,
      asmParsedData: {},
      bitdParsedData: {},
      hexParsedData: {},
      selectedParsingData: {},
      parsedScriptType: possibleScriptTypes[0],
      parsedAsmLines: [],
      contextsByLine: [],
      sigsAlwaysPass: true,
      convertFromSelectType: possibleScriptTypes[0],
      convertToSelectType: possibleScriptTypes[1],
    };
  },
  mounted() {
    this.$nextTick(async () => {
      this.rawScript = this.$route.params.rawscript || "";
      this.expectedScriptType =
        this.$route.query.type?.toUpperCase() || possibleScriptTypes[0];

      const txInput = this.$route.query.txInput;
      if (txInput) await this.fromTxInputPointer(txInput);
      this.onScriptEditorInput();
    });
  },
  methods: {
    async fromTxInputPointer(txInput) {
      try {
        const [txid, vinStr] = txInput.split("_i");
        const vin = parseInt(vinStr || "0");
        const hex = await getRawTx(txid, "main");
        const tx = bsvjs.Tx.fromHex(hex);
        const parentHex = await getRawTx(
          tx.txIns[vin].txHashBuf.reverse().toString("hex"),
          "main"
        );
        const parentTx = bsvjs.Tx.fromHex(parentHex);
        const output = parentTx.txOuts[tx.txIns[vin].txOutNum];
        const script = bsvjs.Script.fromHex(
          tx.txIns[vin].script.toHex() + output.script.toHex()
        );
        if (this.expectedScriptType === possibleScriptTypes[0]) {
          this.rawScript = script
            .toAsmString()
            .split(" ")
            .join("\n");
        } else if (this.expectedScriptType === possibleScriptTypes[1]) {
          this.rawScript = script
            .toBitcoindString()
            .split(" ")
            .join("\n");
        } else if (this.expectedScriptType === possibleScriptTypes[2]) {
          this.rawScript = script
            .toBitcoindString()
            .split(" ")
            .map((line) => bsvjs.Script.fromBitcoindString(line).toHex())
            .join("\n");
        }
      } catch (error) {
        console.warn(`Failed to parse txInput (${txInput}): ${error.message}`);
      }
    },
    onExpectedTypeChange() {
      if (this.convertFromSelectType !== this.expectedScriptType) {
        this.convertFromSelectType = this.expectedScriptType;
        this.onConvertFromSelectTypeChange();
      }
      this.onScriptEditorInput();
    },
    onConvertFromSelectTypeChange() {
      if (this.convertFromSelectType === this.convertToSelectType) {
        this.convertToSelectType = this.possibleScriptTypes.find(
          (i) => this.convertToSelectType !== i
        );
      }
    },
    opReturnItemToString(opReturnItem) {
      return Buffer.from(opReturnItem).toString();
    },
    onScriptEditorScroll() {
      const scrollTop = $(".scriptInput")[0]?.scrollTop;
      if (scrollTop) {
        $(".lineNumContainer")[0].scrollTop = scrollTop;
        $(".contextsContainer")[0].scrollTop = scrollTop;
      }
    },
    setUrlPathParameters() {
      if (
        this.$route.params.rawscript !== this.rawScript ||
        this.$route.query.type !== this.expectedScriptType
      ) {
        this.$router.push({
          path: "/tools/scripteval/" + encodeURIComponent(this.rawScript || ""),
          query: { type: this.expectedScriptType },
        });
      }
    },
    onScriptEditorInput() {
      this.onScriptEditorScroll();
      this.setUrlPathParameters();
      this.scriptLines = (this.rawScript + "").split("\n");
      this.lineCount = this.scriptLines.length;

      const { options, mostMatchedLines, detectedScriptIndex } = this.parse(
        this.scriptLines
      );

      this.mostMatchedLines = mostMatchedLines;
      this.asmParsedData = options[0];
      this.bitdParsedData = options[1];
      this.hexParsedData = options[2];

      this.parsedScriptType = options[detectedScriptIndex].type;

      const expectedIndex = this.possibleScriptTypes.indexOf(
        this.expectedScriptType
      );
      this.selectedParsingData = options[expectedIndex];

      this.parsedAsmLines = this.selectedParsingData.lines.map(
        (i) => i?.toAsmString() || `undefined`
      );

      this.contextsByLine = [];
      // TODO: parse until error or end (don't fail arr if error is on line 100)
      // TODO: show error in the line numbers
      this.contextsByLine = this.evaluate(
        this.parsedAsmLines,
        this.scriptLines,
        this.sigsAlwaysPass
      );
    },
    parse(scriptLines) {
      const tryGet = (action) => {
        try {
          return action();
        } catch (error) {
          return undefined;
        }
      };

      const asmLines = scriptLines.map((line) => {
        return tryGet(() =>
          bsvjs.Script.fromAsmString(line || "invalid script")
        );
      });
      const bitdLines = scriptLines.map((line) => {
        return tryGet(() =>
          bsvjs.Script.fromBitcoindString(line || "invalid script")
        );
      });
      const hexLines = scriptLines.map((line) => {
        return tryGet(() => bsvjs.Script.fromHex(line || "invalid script"));
      });

      const options = [
        {
          type: this.possibleScriptTypes[0],
          lines: asmLines,
          matchCount: asmLines.filter((i) => i).length,
        },
        {
          type: this.possibleScriptTypes[1],
          lines: bitdLines,
          matchCount: bitdLines.filter((i) => i).length,
        },
        {
          type: this.possibleScriptTypes[2],
          lines: hexLines,
          matchCount: hexLines.filter((i) => i).length,
        },
      ];
      const mostMatchedLines = Math.max(...options.map((i) => i.matchCount));
      const detectedScriptIndex = options.findIndex(
        (option) => option.matchCount === mostMatchedLines
      );

      return {
        options,
        mostMatchedLines,
        detectedScriptIndex,
      };
    },
    evaluate(asmLines, rawLines, sigsAlwaysPass) {
      const contexts = [];

      let prevCtx = { sigsAlwaysPass: sigsAlwaysPass };
      for (let i = 0; i < asmLines.length; i++) {
        const line = asmLines[i];
        const rawLine = rawLines[i];

        if (!rawLine) {
          contexts.push({ i });
          continue;
        }
        if (!line) {
          contexts.push({
            ...prevCtx,
            i,
            ended: true,
            interrupted: true,
            endMessage: `Failed to parse script line`,
          });
          break;
        }

        try {
          prevCtx = bitcoinScriptEval(line, "asm", prevCtx);
          contexts.push({ ...prevCtx, i });
        } catch (error) {
          contexts.push({
            i,
            ended: true,
            interrupted: true,
            endMessage: error.toString(),
          });
          break;
        }
      }
      return contexts;
    },
    convertScript(fromType, toType) {
      const errorDetectedShown = false;
      const converted = [];

      const scripts =
        fromType === this.possibleScriptTypes[0]
          ? this.asmParsedData.lines
          : fromType === this.possibleScriptTypes[1]
          ? this.bitdParsedData.lines
          : fromType === this.possibleScriptTypes[2]
          ? this.hexParsedData.lines
          : this.selectedParsingData.lines;

      for (let i = 0; i < scripts.length; i++) {
        const line = scripts[i];

        if (!line && this.parsedAsmLines[i] !== "undefined") {
          if (!errorDetectedShown) {
            // TODO: Show error and ask to continue parse or to stop
            // if continue: set errorDetectedShown to TRUE and go out of the if
            // else - exit this function
          }
          converted.push(this.scriptLines[i]); // push original line, because parse is failing
        } else if (!line) {
          converted.push("");
        } else {
          if (toType === this.possibleScriptTypes[0]) {
            converted.push(line.toAsmString());
          } else if (toType === this.possibleScriptTypes[1]) {
            converted.push(line.toBitcoindString());
          } else if (toType === this.possibleScriptTypes[2]) {
            converted.push(line.toHex());
          }
        }
      }

      this.rawScript = converted.join("\n");
      this.expectedScriptType = toType;
      this.onScriptEditorInput();
    },
  },
  props: {},
  components: {},
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainContainer {
  overflow: hidden;
}

.scriptInput,
.lineNumContainer,
.contextsContainer {
  min-height: 35rem;
  max-height: 35rem;
  font-size: 1rem;
  padding-top: 10px;
  padding-bottom: 10px;
}

.scriptInput {
  border-radius: 0;
  overflow-x: scroll;
}
.lineNumContainer {
  overflow: hidden;
  background-color: white;
  color: #8f8f8f;
  border-right: 1px solid rgb(177, 177, 177);
}
.lineNumContainer .lineNum {
  padding: 0 5px;
  border-radius: 1em;
}
.lineNumContainer .lineNum.scriptInterruptedHere {
  background-color: #fd3636;
  color: black;
}
.contextsContainer {
  color: #25c1dd;
  background-color: #282828;
  border: 1px solid transparent;
  overflow-x: visible;
  overflow-y: hidden;
  color: white;
}
.scriptLineContext {
  display: block;
}
.ctxProp,
.ctxProp.col {
  padding: 0;
}
.ctxProp > * {
  border-radius: 10px;
  width: 100%;
  padding: 0 10px;
}

.ctxProp > .elseEl {
  color: #ffffff11;
}

.lineParsed {
  background-color: #94949433;
}
.lineEndMessage {
  background-color: #be636333;
}
.lineStack {
  background-color: #55bb5a33;
}
.lineAltStack {
  background-color: #5568d333;
}
.lineOpReturn {
  background-color: #c5b74c33;
}

.hideOverflow {
  overflow: hidden;
}
</style>
