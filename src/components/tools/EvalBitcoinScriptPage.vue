<template>
  <div>
    <h1 class="text-center">Evaluate Bitcoin Script</h1>
    <div class="mainContainer px-3 pt-3">
      <div class="mx-auto row">
        <div
          class="lineNumContainer text-right d-none d-sm-block col-sm-1 col-md-auto"
        >
          <div
            class="scriptLineNumber"
            v-for="ctx in contextsByLine"
            :key="ctx.i"
          >
            {{ ctx.i }}
          </div>
        </div>

        <textarea
          type="text"
          class="scriptInput text-left form-control col-sm-6 col-md-7"
          v-model="rawScript"
          v-on:scroll="onScriptEditorScroll"
        ></textarea>

        <div class="contextsContainer col">
          <div
            class="scriptLineContext"
            v-for="ctx in contextsByLine"
            :key="ctx.i"
          >
            <div class="row">
              <div class="ctxProp col col-sm-2">
                <div class="lineParsed customTooltip">
                  Hex
                  <div class="customTooltipBottom">
                    {{ parsedAsmLines[ctx.i] }} parsed from
                    {{ parsedScriptType }}
                    <i></i>
                  </div>
                </div>
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
                      {{ ctx.opReturn[i] + "" }}
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
    </div>
  </div>
</template>

<script>
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";
import { bitcoinScriptEval } from "../../assets/js/bitcoin-script-eval/index";
import $ from "jquery";

export default {
  name: "Evaluate-Bitcoin-Script",
  data() {
    return {
      rawScript:
        "bb\nOP_TOALTSTACK\nbb\naa\naa\nOP_EQUALVERIFY\nOP_EQUALVERIFY\n",
      detectedScriptType: -1,
      sigsAlwaysPass: true,
    };
  },
  mounted() {
    this.$nextTick(() => {
      //
    });
  },
  methods: {
    onScriptEditorScroll(event) {
      $(".lineNumContainer")[0].scrollTop = event.target.scrollTop;
      $(".contextsContainer")[0].scrollTop = event.target.scrollTop;
    },
  },
  props: {},
  components: {},
  computed: {
    scriptLines() {
      return (this.rawScript + "").split("\n");
    },
    parsed() {
      const tryGet = (action) => {
        try {
          return action();
        } catch (error) {
          return undefined;
        }
      };

      const asmLines = this.scriptLines.map((line) => {
        return tryGet(() =>
          bsvjs.Script.fromAsmString(line || "invalid script")
        );
      });
      const bitdLines = this.scriptLines.map((line) => {
        return tryGet(() =>
          bsvjs.Script.fromBitcoindString(line || "invalid script")
        );
      });
      const hexLines = this.scriptLines.map((line) => {
        return tryGet(() => bsvjs.Script.fromHex(line || "invalid script"));
      });

      const options = [
        {
          type: "ASM Script",
          lines: asmLines,
          matchCount: asmLines.filter((i) => i).length,
        },
        {
          type: "BitcoinD Script",
          lines: bitdLines,
          matchCount: bitdLines.filter((i) => i).length,
        },
        {
          type: "HEX Script",
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
        lineCount: this.scriptLines.length,
        mostMatchedLines,
        detectedScriptIndex,
      };
    },
    selectedParsing() {
      const parsed = this.parsed;
      const selectedOption = parsed.options[parsed.detectedScriptIndex];
      return selectedOption;
    },
    parsedScriptType() {
      return this.selectedParsing.type;
    },
    parsedAsmLines() {
      return this.selectedParsing.lines.map((i) => i?.toAsmString() || `undefined`);
    },
    contextsByLine() {
      const contexts = [];

      let prevCtx = { sigsAlwaysPass: this.sigsAlwaysPass };
      for (let i = 0; i < this.parsedAsmLines.length; i++) {
        const line = this.parsedAsmLines[i];
        const rawLine = this.scriptLines[i];

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

        prevCtx = bitcoinScriptEval(line, "asm", prevCtx);
        contexts.push({ ...prevCtx, i });

        if(prevCtx.opReturn) {
          console.log(prevCtx)
        }
      }
      return contexts;
    },
  },
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
}
.lineNumContainer {
  overflow: hidden;
  background-color: white;
  color: red;
  border-right: 1px solid rgb(177, 177, 177);
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
