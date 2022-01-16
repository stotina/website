<template>
  <div>
    <h1 class="text-center">Bitcoin URI Parser</h1>

    <div class="ml-4">
      <div class="inputContainer input-group row">
        <textarea
          type="text"
          id="uriInput"
          class="form-control col-sm-12 col-md-9"
          v-model="uri"
        ></textarea>
        <input
          type="button"
          id="uriParseBtn"
          class="btn btn-primary form-control col-sm-12 col-md-3"
          value="Parse"
          @click="onParseBtnClick"
        />
      </div>

      <div class="resultsContainer pr-5">
        <div class="ml-4" v-if="parsed">
          <div class="row">
            <div class="uriSummaryField col-sm-6 col-md-4">
              <span
                v-bind:class="{
                  'text-success': parsed.isBSV,
                  'text-danger': !parsed.isBSV,
                }"
              >
                {{ parsed.isBSV ? "Bitcoin SV" : "Potentially BTC" }}
              </span>
              Protocol
            </div>
            <div class="uriSummaryField col-sm-6 col-md-8">
              <span class="text-primary">
                {{ parsed.mainProtocol.toUpperCase() }} ({{
                  parsed.type
                }})
              </span>
            </div>
          </div>
          <div class="row">
            <div class="uriSummaryField col-sm-6 col-md-4">MEMO:</div>
            <div class="uriSummaryField col-sm-6 col-md-8">
              <span class="text-warning">
                {{ parsed.memo }}
              </span>
            </div>
          </div>
          <div class="row">
            <div
              class="uriSummaryField col-sm-6 col-md-4"
              v-if="totalOutputSatoshis - totalInputSatoshis >= 0"
            >
              TO PAY:
            </div>
            <div
              class="uriSummaryField col-sm-6 col-md-4"
              v-if="totalOutputSatoshis - totalInputSatoshis < 0"
            >
              TO RECIEVE:
            </div>
            <div class="uriSummaryField col-sm-6 col-md-8">
              <span class="text-warning">
                {{ Math.abs(totalOutputSatoshis - totalInputSatoshis) }}
              </span>
              satoshis
            </div>
          </div>

          <div class="row jsonContainer">
            <textarea
              class="col-md-10 mx-auto"
              rows="20"
              v-bind:value="parsedJsonString"
              disabled
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bitUriParser } from "../../assets/js/bitUriParser/index";

export default {
  name: "Parse-URI",
  data() {
    const uri =
      this.$route.params.uri || "bitcoin:1FMif2XbHJx5L2x6QWYKyWEWPpxJC1ipXw?amount=1";

    return {
      uri,
      parsed: undefined,
    };
  },
  watch: {
    $route() {
      this.parseFromRouteParam();
    },
  },
  mounted() {
    this.$nextTick(function() {
      this.onParseBtnClick();
    });
  },
  methods: {
    async onParseBtnClick() {
      if (this.$route.params.uri !== this.uri) {
        this.$router.push("/tools/parseuri/" + encodeURIComponent(this.uri));
      }

      this.parseFromRouteParam();
    },
    async parseFromRouteParam() {
      this.uri = this.$route.params.uri || "";
      try {
        const parsed = await bitUriParser.parse(this.uri);
        this.parsed = parsed;
      } catch (error) {
        this.parsed = undefined;
      }
    },
  },
  props: {},
  computed: {
    totalOutputSatoshis() {
      let sum = this.parsed?.outputs?.reduce(
        (sum, o) => sum + o.satoshis,
        0
      );
      if (sum === undefined) sum = 0;
      return sum;
    },
    totalInputSatoshis() {
      let sum = this.parsed?.inputs?.reduce((sum, i) => sum + i.satoshis, 0);
      if (sum === undefined) sum = 0;
      return sum;
    },
    parsedJsonString() {
      return JSON.stringify(this.parsed, null, 2);
      // .replace(/\n/g, "<br/>")
      // .replace(/ /g, "&nbsp;");
    },
  },
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#uriInput {
  min-height: 4rem;
  max-height: 4rem;
}
#uriParseBtn {
  height: 4rem;
}

.inputContainer {
  margin-bottom: 3rem;
}
.jsonContainer textarea {
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.resultsContainer .row {
  border-bottom: 1px solid white;
}
.resultsContainer .row:first-child {
  border-top: 1px solid white;
}

.uriSummaryField {
  font-size: 1.4rem;
  background-color: #c9c9c911;
}
</style>
