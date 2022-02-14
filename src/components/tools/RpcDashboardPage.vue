<template>
  <div>
    <h1 class="text-center">RPC Dashboard</h1>
    <div>
      <h3 class="text-center text-warning">
        This tool cannot be implemented because of CORS sequrity issues.
      </h3>
      <h3 class="text-center pb-5 text-warning">
        It can be made into a smartphone app or a desktop app at a later point.
      </h3>
    </div>
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
          {{ RPC_FULL_URL_HIDDEN_PASSWORD }}
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
        <h3
          class="accordion-header"
          id="info_title_blockchain"
          v-on:click="expandedElement = 'blockchain'"
        >
          <div class="accordion-button collapsed">
            Blockchain info
          </div>
        </h3>
        <div
          v-bind:class="{
            'accordion-collapse': true,
            collapse: true,
            show: expandedElement === 'blockchain',
          }"
        >
          {{ JSON.stringify(rpcData.blockchain) }}
        </div>
      </div>
      <div class="accordion-item">
        <h3
          class="accordion-header"
          id="info_title_mempool"
          v-on:click="expandedElement = 'mempool'"
        >
          <div class="accordion-button collapsed">
            Mempool info
          </div>
        </h3>
        <div
          v-bind:class="{
            'accordion-collapse': true,
            collapse: true,
            show: expandedElement === 'mempool',
          }"
        >
          {{ JSON.stringify(rpcData.mempool) }}
        </div>
      </div>
      <div class="accordion-item">
        <h3
          class="accordion-header"
          id="info_title_rpc"
          v-on:click="expandedElement = 'rpc'"
        >
          <div class="accordion-button collapsed">
            RPC info
          </div>
        </h3>
        <div
          v-bind:class="{
            'accordion-collapse': true,
            collapse: true,
            show: expandedElement === 'rpc',
          }"
        >
          {{ JSON.stringify(rpcData.rpc) }}
        </div>
      </div>
      <div class="accordion-item">
        <h3
          class="accordion-header"
          id="info_title_mining"
          v-on:click="expandedElement = 'mining'"
        >
          <div class="accordion-button collapsed">
            Mining info
          </div>
        </h3>
        <div
          v-bind:class="{
            'accordion-collapse': true,
            collapse: true,
            show: expandedElement === 'mining',
          }"
        >
          {{ JSON.stringify(rpcData.mining) }}
        </div>
      </div>
      <div class="accordion-item">
        <h3
          class="accordion-header"
          id="info_title_utxo"
          v-on:click="expandedElement = 'utxo'"
        >
          <div class="accordion-button collapsed">
            UTXO info
          </div>
        </h3>
        <div
          v-bind:class="{
            'accordion-collapse': true,
            collapse: true,
            show: expandedElement === 'utxo',
          }"
        >
          {{ JSON.stringify(rpcData.utxo) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RpcClient } from "../../assets/js/rpcClient";

export default {
  name: "RPC-Dashboard",
  data() {
    return {
      RPC_URL: "http://127.0.0.1:17332/",
      RPC_USERNAME: "root",
      RPC_PASSWORD: "bitcoin",

      expandedElement: "blockchain",
      rpcData: {
        blockchain: undefined,
        mempool: undefined,
        rpc: undefined,
        mining: undefined,
        utxo: undefined,
      },
    };
  },
  mounted() {
    this.updateDataForCurrentElement();
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
    RPC_FULL_URL_HIDDEN_PASSWORD() {
      return this.RPC_FULL_URL.replace(
        this.RPC_USERNAME + ":" + this.RPC_PASSWORD,
        this.RPC_USERNAME +
          ":" +
          new Array(this.RPC_PASSWORD.length + 1).join("*")
      );
    },
    rpcClient() {
      return new RpcClient(this.RPC_FULL_URL);
    },
  },
  watch: {
    expandedElement() {
      this.updateDataForCurrentElement();
    },
    rpcClient() {
      this.updateDataForCurrentElement();
    },
  },
  methods: {
    async updateDataForCurrentElement() {
      switch (this.expandedElement) {
        case "blockchain":
          this.rpcData.blockchain = await this.rpcClient
            .call("getblockchaininfo")
            .then((res) => this.parseRpcResult(res));
          console.log(this.rpcData);
          break;
        case "mempool":
          this.rpcData.mempool = await this.rpcClient
            .call("getblockchaininfo")
            .then((res) => this.parseRpcResult(res));
          console.log(this.rpcData);
          break;
        case "rpc":
          this.rpcData.rpc = await this.rpcClient
            .call("getblockchaininfo")
            .then((res) => this.parseRpcResult(res));
          console.log(this.rpcData);
          break;
        case "mining":
          this.rpcData.mining = await this.rpcClient
            .call("getblockchaininfo")
            .then((res) => this.parseRpcResult(res));
          console.log(this.rpcData);
          break;
        case "utxo":
          this.rpcData.utxo = await this.rpcClient
            .call("getblockchaininfo")
            .then((res) => this.parseRpcResult(res));
          console.log(this.rpcData);
          break;

        default:
          throw new Error("Unknown type : " + this.expandedElement);
      }
    },
    parseRpcResult(res) {
      if (res.error) throw new Error(res.error);
      else return res.result;
    },
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
