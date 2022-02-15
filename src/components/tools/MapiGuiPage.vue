<template>
  <div>
    <h1 class="text-center">MAPI User Interface</h1>

    <!-- URL -->

    <div class="row">
      <div class="mapiSettings col-md-8 row m-auto pb-5">
        <input
          class="col-md-12 col-sm-12"
          type="text"
          v-model="MAPI_URL"
          placeholder="MAPI_URL"
        />
      </div>
    </div>

    <!-- ACCORDION -->

    <div class="accordion" id="accordionOptions">
      <!-- ACCORDION: INFO -->

      <div class="accordion-item">
        <h3 class="accordion-header" v-on:click="expandedElement = 'info'">
          <div class="accordion-button collapsed">
            MAPI Info
          </div>
        </h3>
        <div
          v-bind:class="{
            'accordion-collapse': true,
            collapse: true,
            show: expandedElement === 'info',
          }"
        >
          <div v-if="mapiData.info">
            <div v-if="mapiData.info.message" class="text-danger text-center">
              {{ mapiData.info.message }}
            </div>
            <div v-else>
              <div class="row">
                <div class="col-md-4">VERSION</div>
                <div class="col-md-8">
                  {{ mapiData.info.apiVersion }}
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">MINER ID</div>
                <div class="col-md-8">
                  {{ mapiData.info.minerId }}
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">HIGHEST BLOCK HASH</div>
                <div class="col-md-8">
                  {{ mapiData.info.currentHighestBlockHash }}
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">HIGHEST BLOCK INDEX</div>
                <div class="col-md-8">
                  {{ mapiData.info.currentHighestBlockHeight }}
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">STANDARD FEE</div>
                <div class="col-md-8">
                  {{ parsedFeeData.standard }}
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">DATA FEE</div>
                <div class="col-md-8">
                  {{ parsedFeeData.data }}
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">STANDARD RELAY FEE</div>
                <div class="col-md-8">
                  {{ parsedFeeData.standardRelay }}
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">DATA RELAY FEE</div>
                <div class="col-md-8">
                  {{ parsedFeeData.dataRelay }}
                </div>
              </div>

              <!-- 
                apiVersion
                minerId
                currentHighestBlockHash
                currentHighestBlockHeight
                fees: [
                  {
                    id: 1,
                    feeType: "standard",
                    miningFee: { satoshis: 500, bytes: 1000 },
                    relayFee: { satoshis: 250, bytes: 1000 },
                  },
                  {
                    id: 2,
                    feeType: "data",
                    miningFee: { satoshis: 500, bytes: 1000 },
                    relayFee: { satoshis: 250, bytes: 1000 },
                  },
                ],
               -->
            </div>
          </div>
        </div>
      </div>

      <!-- ACCORDION: QUERY -->

      <div class="accordion-item">
        <h3 class="accordion-header" v-on:click="expandedElement = 'query'">
          <div class="accordion-button collapsed">
            Query Transaction Status
          </div>
        </h3>
        <div
          v-bind:class="{
            'accordion-collapse': true,
            collapse: true,
            show: expandedElement === 'query',
          }"
        >
          <div v-if="mapiData.query">
            <div v-if="mapiData.query.message" class="text-danger text-center">
              {{ mapiData.query.message }}
            </div>
            <div v-else>
              {{ JSON.stringify(mapiData.query) }}
            </div>
          </div>
        </div>
      </div>

      <!-- ACCORDION: SUBMIT -->

      <div class="accordion-item">
        <h3 class="accordion-header" v-on:click="expandedElement = 'submit'">
          <div class="accordion-button collapsed">
            Submit Transaction(s)
          </div>
        </h3>
        <div
          v-bind:class="{
            'accordion-collapse': true,
            collapse: true,
            show: expandedElement === 'submit',
          }"
        >
          <div v-if="mapiData.submit">
            <div v-if="mapiData.submit.message" class="text-danger text-center">
              {{ mapiData.submit.message }}
            </div>
            <div v-else>
              {{ JSON.stringify(mapiData.submit) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import axios from "../../assets/js/axios";

export default {
  name: "MAPI-GUI",
  data() {
    return {
      MAPI_URL: "https://mapi.taal.com/mapi",
      expandedElement: "info",
      mapiData: {
        info: undefined,
        query: undefined,
        submit: undefined,
      },
    };
  },
  props: {},
  mounted() {
    this.updateMapiInfo();
  },
  watch: {
    MAPI_URL() {
      this.updateMapiInfo();
    },
  },
  methods: {
    feeToString(satoshis, bytes) {
      console.log(satoshis, bytes);
      return `${satoshis} sats per ${bytes / 1000} KB`;
    },
    async updateMapiInfo() {
      this.mapiData.info = { message: "Loading..." };

      this.mapiData.info = {
        apiVersion: "1.4.1",
        timestamp: "2022-02-15T08:36:19.407Z",
        expiryTime: "2022-02-15T08:46:19.407Z",
        minerId:
          "03e92d3e5c3f7bd945dfbf48e7a99393b1bfb3f11f380ae30d286e7ff2aec5a270",
        currentHighestBlockHash:
          "00000000000000000bed3cb582a84d14828ea7570b8cdde9654cedc6a39c5934",
        currentHighestBlockHeight: 726758,
        minerReputation: null,
        fees: [
          {
            id: 1,
            feeType: "standard",
            miningFee: { satoshis: 500, bytes: 1000 },
            relayFee: { satoshis: 250, bytes: 1000 },
          },
          {
            id: 2,
            feeType: "data",
            miningFee: { satoshis: 500, bytes: 1000 },
            relayFee: { satoshis: 250, bytes: 1000 },
          },
        ],
      };

      // const feePromise = axios
      //   .get(this.MAPI_URL + "/feeQuote")
      //   .then((i) => JSON.parse(i.data.payload));

      // this.mapiData.info = await feePromise
    },
  },
  computed: {
    parsedFeeData() {
      const stFee = this.mapiData.info.fees?.find(
        (i) => i.feeType === "standard"
      );
      const dtFee = this.mapiData.info.fees?.find((i) => i.feeType === "data");

      return {
        standard: this.feeToString(
          stFee.miningFee.satoshis,
          stFee.miningFee.bytes
        ),
        data: this.feeToString(dtFee.miningFee.satoshis, dtFee.miningFee.bytes),
        standardRelay: this.feeToString(
          stFee.relayFee.satoshis,
          stFee.relayFee.bytes
        ),
        dataRelay: this.feeToString(
          dtFee.relayFee.satoshis,
          dtFee.relayFee.bytes
        ),
      };
    },
  },
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#accordionOptions div.accordion-button {
  display: block;
  width: 100%;
  margin: auto;
  padding: 5px 20px;
  /* background-color: #525252; */
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

#accordionOptions .accordion-header {
  margin-bottom: 0;
}

#accordionOptions div.accordion-collapse {
  border: 2px solid black;
  border-top: none;
  margin-bottom: 1rem;
  padding: 1rem;
}
</style>
