<template>
  <div>
    <h1 class="text-center">Testing Key Generator</h1>
    <div>
      <h5 class="text-center">Warning!</h5>
      <h5 class="text-center">Only for testing!!</h5>
      <h5 class="text-center">These keys are not secure!!!</h5>
      <br />
    </div>

    <div class="ml-4">
      <div class="input-group row">
        <span class="input-group-text col-md-4">Network</span>

        <div class="input-group-text col-md-4">
          <input
            @change="onNetworkChange"
            type="radio"
            id="testNetworkRadio"
            name="network"
            value="test"
            checked
          />
          <label class="input-group-text" for="testNetworkRadio">TestNet</label>
        </div>

        <div class="input-group-text col-md-4">
          <input
            @change="onNetworkChange"
            type="radio"
            id="mainNetworkRadio"
            name="network"
            value="main"
          />
          <label class="input-group-text" for="mainNetworkRadio">MainNet</label>
        </div>
      </div>
      <br />
      <div class="input-group row">
        <label class="input-group-text col-md-3"></label>
        <input
          type="button"
          class="btn btn-primary form-control col-md-6"
          @click="reRoll"
          value="Re-Roll"
        />
        <label class="input-group-text col-md-3"></label>
      </div>
      <br />
      <div class="input-group row">
        <label class="input-group-text col-md-3" for="pk">Private Key</label>
        <input
          class="form-control col-md-9"
          id="pk"
          @input="onPrivChange"
          :value="this.pk"
        />
      </div>
      <br />
      <div class="input-group row">
        <label class="input-group-text col-md-3" for="pub">Public Key</label>
        <input
          class="form-control col-md-9"
          id="pub"
          @input="onPubChange"
          :value="this.pub"
        />
      </div>
      <br />
      <div class="input-group row">
        <label class="input-group-text col-md-3" for="addr">Address</label>
        <input
          class="form-control col-md-9"
          id="addr"
          @input="onAddrChange"
          :value="this.addr"
        />
      </div>
      <br />
      <div class="input-group row">
        <label class="input-group-text col-md-3" for="script">Script</label>
        <input
          class="form-control col-md-9"
          id="scriptHex"
          @input="onHexScriptChange"
          :value="this.scriptHex"
        />
      </div>
      <br />
      <div class="input-group row">
        <label class="input-group-text col-md-3" for="script"
          >Script (ASM)</label
        >
        <input
          class="form-control col-md-9"
          id="scriptAsm"
          @input="onAsmScriptChange"
          :value="this.scriptAsm"
        />
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";

export default {
  name: "Generate-Test-Keys",
  data() {
    const type = "test";
    const pk = bsvjs.PrivKey.Testnet.fromRandom();
    const values = this.generateFromPk(pk, type);

    return { type, ...values };
  },
  mounted() {
    this.$nextTick(function() {
      //
    });
  },
  methods: {
    onNetworkChange(event) {
      this.type = event.target.value;
      this.reRoll();
    },
    onPrivChange(event) {
      console.log("onPrivChange");
      this.setBlanksExcept("pk");

      const val = event.target.value;
      let pk = this.try(() => bsvjs.PrivKey.Testnet.fromString(val));
      let network = pk ? "main" : undefined;
      if (!pk) {
        pk = this.try(() => bsvjs.PrivKey.fromString(val));
        network = pk ? "main" : undefined;
      }

      if (pk) {
        this.setNetwork(network);
        const vals = this.generateFromPk(pk, this.type);
        this.setFrom(vals);
      }
    },
    onPubChange(event) {
      console.log("onPubChange");
      this.setBlanksExcept("pub");

      const val = event.target.value;
      let pub = this.try(() => bsvjs.PubKey.fromString(val));

      if (pub) {
        const vals = this.generateFromPub(pub, this.type);
        this.setFrom(vals);
      }
    },
    onAddrChange(event) {
      console.log("onAddrChange");
      this.setBlanksExcept("addr");

      const val = event.target.value;
      let addr = this.try(() => bsvjs.Address.Testnet.fromString(val));
      let network = addr ? "test" : undefined;
      if (!addr) {
        addr = this.try(() => bsvjs.Address.fromString(val));
        network = addr ? "main" : undefined;
      }

      if (addr) {
        this.setNetwork(network);
        const vals = this.generateFromAddr(addr, this.type);
        this.setFrom(vals);
      }
    },
    onHexScriptChange(event) {
      console.log("onHexScriptChange");
      this.setBlanksExcept("scriptHex");

      const val = event.target.value;
      let script = this.try(() => bsvjs.Script.fromHex(val));
      if (script) {
        const vals = this.generateFromScript(script, this.type);
        this.setFrom(vals);
      }
    },
    onAsmScriptChange(event) {
      console.log("onAsmScriptChange");
      this.setBlanksExcept("scriptAsm");

      const val = event.target.value;
      let script = this.try(() => bsvjs.Script.fromHex(val));
      if (script) {
        const vals = this.generateFromScript(script, this.type);
        this.setFrom(vals);
      }
    },
    setNetwork(network) {
      if (!network) return;
      else if (network === "main") {
        document.getElementById("mainNetworkRadio").checked = true;
        this.type = "main";
      } else {
        document.getElementById("testNetworkRadio").checked = true;
        this.type = "test";
      }
    },
    reRoll() {
      const pk =
        this.type === "main"
          ? bsvjs.PrivKey.fromRandom()
          : bsvjs.PrivKey.Testnet.fromRandom();
      const vals = this.generateFromPk(pk, this.type);
      this.setFrom(vals);
    },
    setFrom(values) {
      console.log("Updating values...");
      Object.assign(this, values);
    },
    setBlanksExcept(...fieldsToSkip) {
      const blanks = {
        pk: "",
        pub: "",
        addr: "",
        scriptHex: "",
        scriptAsm: "",
      };
      for (const field of fieldsToSkip) {
        delete blanks[field];
      }
      this.setFrom(blanks);
    },
    generateFromPk(pk, type) {
      const pub = bsvjs.PubKey.fromPrivKey(pk);
      return {
        ...this.generateFromPub(pub, type),
        pk: pk.toString(),
      };
    },
    generateFromPub(pub, type) {
      const addr =
        type === "main"
          ? bsvjs.Address.fromPubKey(pub)
          : bsvjs.Address.Testnet.fromPubKey(pub);
      return {
        ...this.generateFromAddr(addr),
        pk: "",
        pub: pub.toString(),
      };
    },
    generateFromAddr(addr) {
      const script = bsvjs.Script.fromPubKeyHash(addr.hashBuf);
      return {
        pk: "",
        pub: "",
        addr: addr.toString(),
        scriptHex: script.toHex(),
        scriptAsm: script.toAsmString(),
      };
    },
    generateFromScript(script, type) {
      const addr = script.isPubKeyHashOut
        ? type === "main"
          ? bsvjs.Address.fromTxOutScript(script).toString()
          : bsvjs.Address.Testnet.fromTxOutScript(script).toString()
        : "";

      return {
        pk: "",
        pub: "",
        addr,
        scriptHex: script.toHex(),
        scriptAsm: script.toAsmString(),
      };
    },
    try(action, defaultVal = undefined) {
      try {
        return action();
      } catch (error) {
        return defaultVal;
      }
    },
  },
  props: {},
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
