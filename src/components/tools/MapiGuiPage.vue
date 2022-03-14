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
        <h3 class="accordion-header" v-on:click="focusedElement = 'info'">
          <div class="accordion-button collapsed">
            MAPI Info
          </div>
        </h3>
        <div
          v-bind:class="{
            'accordion-collapse': true,
            collapse: true,
            show: true, // focusedElement === 'info',
          }"
        >
          <div v-if="mapiData.info">
            <div v-if="mapiData.info.message" class="text-danger text-center">
              {{ mapiData.info.message }}
            </div>
            <div v-else>
              <KeyValueRow
                :name="'Version'"
                :value="mapiData.info.apiVersion"
              ></KeyValueRow>
              <KeyValueRow
                :name="'MINER ID'"
                :value="mapiData.info.minerId"
              ></KeyValueRow>
              <KeyValueRow
                :name="'HIGHEST BLOCK HASH'"
                :value="mapiData.info.currentHighestBlockHash"
              ></KeyValueRow>
              <KeyValueRow
                :name="'HIGHEST BLOCK INDEX'"
                :value="mapiData.info.currentHighestBlockHeight"
              ></KeyValueRow>
              <KeyValueRow
                :name="'STANDARD FEE'"
                :value="parsedFeeData.standard"
              ></KeyValueRow>
              <KeyValueRow
                :name="'DATA FEE'"
                :value="parsedFeeData.data"
              ></KeyValueRow>
              <KeyValueRow
                :name="'STANDARD RELAY FEE'"
                :value="parsedFeeData.standardRelay"
              ></KeyValueRow>
              <KeyValueRow
                :name="'DATA RELAY FEE'"
                :value="parsedFeeData.dataRelay"
              ></KeyValueRow>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12 col-lg-6">
            <!-- ACCORDION: QUERY -->

            <div class="accordion-item">
              <h3
                class="accordion-header"
                v-on:click="focusedElement = 'query'"
              >
                <div class="accordion-button collapsed">
                  Query Transaction Status
                </div>
              </h3>
              <div
                v-bind:class="{
                  'accordion-collapse': true,
                  collapse: true,
                  show: true, //focusedElement === 'query',
                }"
              >
                <div class="container-fluid">
                  <div class="input-group row  mx-auto">
                    <input
                      v-model="queryTxid"
                      v-bind:class="
                        `form-control col-md-9 ${
                          queryTxidIsValid > 0
                            ? 'border border-primary'
                            : queryTxidIsInvalid
                            ? 'border border-danger'
                            : 'border border-light'
                        }`
                      "
                      placeholder="TXID"
                    />
                    <input
                      type="button"
                      v-bind:class="
                        `btn ${
                          queryTxidIsValid ? 'btn-primary' : 'btn-light'
                        } form-control col-md-3`
                      "
                      @click="
                        () => {
                          if (queryTxidIsValid) queryTxStatus();
                        }
                      "
                      value="Check"
                    />
                  </div>
                </div>
                <div v-if="mapiData.query">
                  <div
                    v-if="mapiData.query.message"
                    class="text-danger text-center"
                  >
                    {{ mapiData.query.message }}
                  </div>
                  <div v-else>
                    <div class="mt-3"></div>
                    <KeyValueRow
                      name="Status"
                      :keyColumnSize="3"
                      :value="mapiData.query.returnResult"
                    >
                      <div
                        v-bind:class="
                          'text-uppercase ' +
                            (mapiData.query.returnResult === 'success'
                              ? 'text-success'
                              : 'text-danger')
                        "
                      >
                        {{ mapiData.query.returnResult }}
                      </div>
                    </KeyValueRow>
                    <KeyValueRow
                      name="Error"
                      :keyColumnSize="3"
                      :value="mapiData.query.resultDescription"
                      :showIfValueMissing="false"
                    ></KeyValueRow>
                    <KeyValueRow
                      name="Confirmations"
                      :keyColumnSize="3"
                      :value="mapiData.query.confirmations"
                      :showIfValueMissing="false"
                    ></KeyValueRow>
                    <KeyValueRow
                      name="Block Hash"
                      :keyColumnSize="3"
                      :value="mapiData.query.blockHash"
                      :showIfValueMissing="false"
                    >
                      <a
                        v-bind:href="
                          `https://whatsonchain.com/block/${mapiData.query.blockHash}`
                        "
                        target="_blank"
                        >{{ mapiData.query.blockHash }}</a
                      >
                    </KeyValueRow>
                    <KeyValueRow
                      name="Block Height"
                      :keyColumnSize="3"
                      :value="mapiData.query.blockHeight"
                      :showIfValueMissing="false"
                    ></KeyValueRow>
                    <KeyValueRow
                      name="Miner ID"
                      :keyColumnSize="3"
                      :value="mapiData.query.minerId"
                    ></KeyValueRow>
                    <KeyValueRow
                      name="Timestamp"
                      :keyColumnSize="3"
                      :value="mapiData.query.timestamp"
                    ></KeyValueRow>
                    <KeyValueRow
                      name="Mempool Expiry"
                      :keyColumnSize="3"
                      :value="mapiData.query.txSecondMempoolExpiry"
                      :showIfValueMissing="false"
                    ></KeyValueRow>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 col-lg-6">
            <!-- ACCORDION: SUBMIT -->

            <div class="accordion-item">
              <h3
                class="accordion-header"
                v-on:click="focusedElement = 'submit'"
              >
                <div class="accordion-button collapsed">
                  Submit Transaction(s)
                </div>
              </h3>
              <div
                v-bind:class="{
                  'accordion-collapse': true,
                  collapse: true,
                  show: true, //focusedElement === 'submit',
                }"
              >
                <div class="container-fluid">
                  <div class="input-group row mx-auto">
                    <textarea
                      wrap="off"
                      v-model="rawTxsToSubmit"
                      v-bind:class="
                        `form-control col-md-9 ${
                          transactionsToSubmit.length === 0
                            ? 'border border-light'
                            : transactionsToSubmitParsingError
                            ? 'border border-danger'
                            : 'border border-primary'
                        }`
                      "
                      style="min-height: 8rem;"
                      placeholder="Paste raw transactions, where each transaction is on a separate row."
                    />
                    <button
                      style="height: 8rem"
                      type="button"
                      v-bind:class="
                        `btn ${
                          transactionsToSubmit.length &&
                          transactionsToSubmitParsingError
                            ? 'btn-light'
                            : 'btn-primary'
                        } form-control col-md-3`
                      "
                      @click="
                        () => {
                          if (
                            transactionsToSubmit.length &&
                            !transactionsToSubmitParsingError
                          )
                            submitTransactions();
                        }
                      "
                    >
                      Submit<br />{{ transactionsToSubmit.length }} TX(s)
                    </button>
                  </div>
                  <div
                    v-if="transactionsToSubmitParsingError"
                    class="text-danger"
                  >
                    {{ transactionsToSubmitParsingError }}
                  </div>
                </div>
                <div v-if="mapiData.submit">
                  <div
                    v-if="mapiData.submit.message"
                    class="text-danger text-center"
                  >
                    {{ mapiData.submit.message }}
                  </div>
                  <div v-else>
                    <div
                      v-for="tx in mapiData.submit.txs"
                      :key="tx.txid + Math.random()"
                    >
                      <div class="border m-3 p-1">
                        <KeyValueRow
                          :keyColumnSize="3"
                          name="TxID"
                          :value="tx.txid"
                        >
                          <a
                            v-bind:href="
                              `https://whatsonchain.com/tx/${tx.txid}`
                            "
                            target="_blank"
                            >{{ tx.txid }}</a
                          >
                        </KeyValueRow>

                        <KeyValueRow
                          :keyColumnSize="3"
                          name="Status"
                          :value="tx.returnResult"
                        >
                          <div
                            v-bind:class="
                              'text-uppercase ' +
                                (tx.returnResult === 'success'
                                  ? 'text-success'
                                  : 'text-danger')
                            "
                          >
                            {{ tx.returnResult }}
                          </div>
                        </KeyValueRow>
                        <KeyValueRow
                          v-if="tx.resultDescription"
                          :keyColumnSize="3"
                          name="Error"
                          :value="tx.resultDescription"
                        ></KeyValueRow>
                        <div v-if="tx.conflictedWith">
                          <h5>Conflicts:</h5>
                          <div
                            class="conflicts m-1"
                            v-for="conflict in tx.conflictedWith"
                            :key="conflict.txid + Math.random()"
                          >
                            <a
                              v-bind:href="
                                `https://whatsonchain.com/tx/${conflict.txid}`
                              "
                              target="_blank"
                              >{{ conflict.txid }}</a
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../assets/js/axios";
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";

export default {
  name: "MAPI-GUI",
  data() {
    return {
      MAPI_URL: "https://mapi.taal.com/mapi",
      focusedElement: "query",
      mapiData: {
        info: undefined,
        query: undefined,
        submit: undefined,
      },
      queryTxid:
        "6373773322684eefea457fc52ae39921dde8c464de635e6515da082fc6f4eb57",
      rawTxsToSubmit:
        "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1c03d7c6082f7376706f6f6c2e636f6d2f3edff034600055b8467f0040ffffffff01247e814a000000001976a914492558fb8ca71a3591316d095afc0f20ef7d42f788ac00000000\n01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1c03d7c6082f7376706f6f6c2e636f6d2f3edff034600055b8467f0040ffffffff01247e814a000000001976a914492558fb8ca71a3591316d095afc0f20ef7d42f788ac00000000",
    };
  },
  components: { KeyValueRow: () => import("../elements/KeyValueRow") },
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
      return `${satoshis} sats per ${bytes / 1000} KB`;
    },
    async queryTxStatus() {
      const url = this.MAPI_URL + "/tx/" + this.queryTxid;
      console.log("GET: " + url);
      const response = await axios.get(url);
      const result = JSON.parse(response.data.payload);

      this.mapiData.query = result;
    },
    async updateMapiInfo() {
      this.mapiData.info = { message: "Loading..." };

      const url = this.MAPI_URL + "/feeQuote";
      console.log("GET: " + url);
      const response = await axios.get(url);
      const result = JSON.parse(response.data.payload);

      this.mapiData.info = result;
    },
    async submitTransactions() {
      const url = this.MAPI_URL + "/txs";
      console.log("GET: " + url);
      const body = this.transactionsToSubmit.map((rawtx) => ({ rawtx }));
      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
      });
      const result = JSON.parse(response.data.payload);

      this.mapiData.submit = result;
    },
  },
  computed: {
    queryTxidIsInvalid() {
      return (
        this.queryTxid !== "" && !/^[a-fA-F0-9]{64}$/g.test(this.queryTxid)
      );
    },
    queryTxidIsValid() {
      return this.queryTxid.length > 0 && !this.queryTxidIsInvalid;
    },
    transactionsToSubmit() {
      return this.rawTxsToSubmit
        .split("\n")
        .map((i) => i.trim())
        .filter((i) => i);
    },
    transactionsToSubmitParsingError() {
      return this.transactionsToSubmit
        .map((rawTx, i) => {
          try {
            bsvjs.Tx.fromHex(rawTx);
            return undefined;
          } catch (error) {
            return `Failed to parse transaction at row ${i + 1}. ${error}`;
          }
        })
        .filter((i) => i)[0];
    },
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
