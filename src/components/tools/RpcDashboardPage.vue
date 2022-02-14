<template>
  <div>
    <h1 class="text-center">RPC Dashboard</h1>
    <div class="row">
      <div class="rpcSettings col-md-8 row m-auto">
        <input
          class="col-md-4 col-sm-4"
          type="text"
          v-model="RPC_URL"
          placeholder="RPC_URL"
        />
        <input
          class="col-md-4 col-sm-4"
          type="text"
          v-model="RPC_USERNAME"
          placeholder="RPC_USERNAME"
        />
        <input
          class="col-md-4 col-sm-4"
          type="password"
          v-model="RPC_PASSWORD"
          placeholder="RPC_PASSWORD"
        />
        <div class="col-md-12 text-center">
          {{
            RPC_FULL_URL.replace(
              RPC_USERNAME + ":" + RPC_PASSWORD,
              RPC_USERNAME + ":" + new Array(RPC_PASSWORD.length + 1).join("*")
            )
          }}
        </div>
      </div>
    </div>
    <div class="config"></div>
    <div id="actions" class="row">
      <div class="col-lg-4 col-md-12 getTx action-item">
        <h2>Get Tx</h2>
        <div class="action-content">
          AAAAAAA
        </div>
      </div>
      <div class="col-lg-4 col-md-12 mineBlock action-item">
        <h2>Mine Block</h2>
        <div class="action-content">
          AAAAAAA
        </div>
      </div>
      <div class="col-lg-4 col-md-12 submitTx action-item">
        <h2>Submit Tx</h2>
        <div class="action-content">
          AAAAAAA
        </div>
      </div>
    </div>
    <div class="accordion" id="infoOptions">
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_blockchain" v-on:click="expandedElement='blockchain'">
          <div class="accordion-button collapsed">
            Blockchain info
          </div>
        </h3>
        <div v-bind:class="{ 'accordion-collapse':true, 'collapse':true, show: expandedElement === 'blockchain' }">
          AAAAAAAAAA
        </div>
      </div>
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_mempool" v-on:click="expandedElement='mempool'">
          <div class="accordion-button collapsed">
            Mempool info
          </div>
        </h3>
        <div v-bind:class="{ 'accordion-collapse':true, 'collapse':true, show: expandedElement === 'mempool' }">
          AAAAAAAAAA
        </div>
      </div>
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_rpc" v-on:click="expandedElement='rpc'">
          <div class="accordion-button collapsed">
            RPC info
          </div>
        </h3>
        <div v-bind:class="{ 'accordion-collapse':true, 'collapse':true, show: expandedElement === 'rpc' }">
          AAAAAAAAAA
        </div>
      </div>
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_mining" v-on:click="expandedElement='mining'">
          <div class="accordion-button collapsed">
            Mining info
          </div>
        </h3>
        <div v-bind:class="{ 'accordion-collapse':true, 'collapse':true, show: expandedElement === 'mining' }">
          AAAAAAAAAA
        </div>
      </div>
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_utxo" v-on:click="expandedElement='utxo'">
          <div class="accordion-button collapsed">
            UTXO info
          </div>
        </h3>
        <div v-bind:class="{ 'accordion-collapse':true, 'collapse':true, show: expandedElement === 'utxo' }">
          AAAAAAAAAA
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "RPC-Dashboard",
  data() {
    return {
      RPC_URL: "http://localhost:18332/",
      RPC_USERNAME: "root",
      RPC_PASSWORD: "bitcoin",

      expandedElement: "blockchain",
    };
  },
  mounted() {
    //
  },
  props: {},
  computed: {
    RPC_FULL_URL() {
      const parsedUrl = new URL(this.RPC_URL);
      const auth = !this.RPC_USERNAME
        ? ""
        : !this.RPC_PASSWORD
        ? `${this.RPC_USERNAME}@`
        : `${this.RPC_USERNAME}:${this.RPC_PASSWORD}@`;
      return `${parsedUrl.protocol}//${auth}${parsedUrl.host}${parsedUrl.pathname}`;
    },
  },
  watch: {
    //
  },
  methods: {
    //
  },
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.action-item {
  padding: 1rem;
}
.action-item h2 {
  border: 2px solid black;
  border-bottom: 1px solid #000000;
  margin-bottom: 0;
}
.action-item .action-content {
  border: 2px solid black;
  border-top: none;
  margin-top: 0;
  padding: 0.4rem;
}

#infoOptions div.accordion-button {
  display: block;
  width: 100%;
  margin: auto;
  padding: 5px 20px;
  /* background-color: #525252; */
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

#infoOptions .accordion-header {
  margin-bottom: 0;
}

#infoOptions div.accordion-collapse {
  border: 2px solid black;
  border-top: none;
  margin-bottom: 1rem;
  padding: 1rem;
}
</style>
