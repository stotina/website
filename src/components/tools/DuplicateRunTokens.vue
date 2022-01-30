<template>
  <div>
    <h1 class="text-center">RUN NFT Duplicator</h1>
    <div class="mainContainer px-5 pb-3">
      <div class="inputContainer input-group mx-auto row mb-1">
        <label for="nftTypeSelect" class="col-md-3">Type: </label>
        <select id="nftTypeSelect" class="form-control col">
          <option value="run-relayx-nft" selected>RUN RelayX NFT</option>
        </select>
      </div>
      <div class="inputContainer input-group mx-auto row mb-1">
        <label for="nftInput" class="col-md-3">Location: </label>
        <input
          placeholder="Location of NFT to Duplicate"
          type="text"
          id="nftInput"
          v-model="location"
          class="form-control col"
          v-bind:class="locationIsValid ? 'is-valid' : 'is-invalid'"
          title="Must be in the format `{txid}_o{vout}`"
        />
      </div>
      <div class="inputContainer input-group mx-auto row mb-1">
        <label for="nftOwnerInput" class="col-md-3">New Owner: </label>
        <input
          placeholder="Your NFT owner Address"
          type="text"
          id="nftOwnerInput"
          v-model="destinationAddr"
          class="form-control col"
          v-bind:class="addressIsValid ? 'is-valid' : 'is-invalid'"
          title="Must be a valid Bitcoin SV main-net Address"
        />
      </div>
      <div class="inputContainer input-group mx-auto row mb-1">
        <label for="nftCountInput" class="col-md-3">Count: </label>
        <input
          type="number"
          min="1"
          max="1000"
          id="nftCountInput"
          v-model="count"
          class="form-control col"
          v-bind:class="countIsValid ? 'is-valid' : 'is-invalid'"
          title="Must be a whole number between 1 and 1000"
        />
      </div>
      <div class="inputContainer input-group mx-auto row my-3 px-5">
        <input
          v-bind:value="`Duplicate ${count} time(s)`"
          v-bind:disabled="!metadata"
          type="button"
          id="nftCopyBtn"
          v-on:click="mint"
          class="btn btn-primary form-control col"
        />
      </div>
      <div
        v-if="error"
        class="errorBox mx-auto text-center mx-auto mb-3 px-5"
      >
        <div v-html="error" class="text-danger errorMessage">
        </div>
          <img
            v-if="error.includes('Not enough funds')"
            class="mx-auto mt-4"
            v-bind:src="`data:image/png;base64,${addressQrCodeBase64}`"
          />
      </div>
    </div>
    <div class="mx-auto py-4 text-center">
      <div class="noToken" v-if="!imageUrl">
        No Image Token was detected
        {{ location ? "at location " + location : "" }}
      </div>
      <div v-if="imageUrl">
        <img v-bind:src="imageUrl" id="nftImage" />
      </div>
    </div>
    <div class="mx-auto py-4 text-center">
      <textarea
        disabled
        v-bind:value="JSON.stringify(metadata, null, 2)"
        rows="10"
        style="width:70%;"
      ></textarea>
    </div>
  </div>
</template>

<script>
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";
import Run from "run-sdk";
import qr from "qr-image";

const runTxidsToTrust = [
  // RelayX's contracts
  "cdea2c203af755cd9477ca310c61021abaafc135a21d8f93b8ebfc6ca5f95712",
  "97a4c947cb96c1f22ec2759a86ad41dc3b48d2f1a3cc0f8400fac449d3c45b14",
  "2c7b03b26378be307f3778517694c66b35effc1c4de932661602663529157449",
  "84e20d29a122c6c3ad3776cc16c049d196fa28f9447b0745053d2b9ea9c0ff11",

  // Stotina's Duplicator
  "4495104c5e5fe20ffa106e54e3d78599bf3a00c7434d0c1b318a68014c2b4985"
];

export default {
  name: "RUN-NFT-Duplicator",
  data() {
    return {
      runKey: bsvjs.PrivKey.fromString(
        "KzggDyULMLDFbSBidJUBmbozbSgwmdDV7mCD39VjWYtTvrxWALmi"
      ),
      type: "run-relayx-nft",
      location:
        "2c7b03b26378be307f3778517694c66b35effc1c4de932661602663529157449_o2",
      destinationAddr: "1DaYHfPvZ69kX55KWAX46dyk3V26dZnPsj",
      count: 1,
      error: undefined,
      metadata: undefined,
    };
  },
  mounted() {
    this.$nextTick(async () => {
      this.onLocationChange();
    });
  },
  watch: {
    locationIsValid() {
      this.onLocationChange();
    },
  },
  methods: {
    async onLocationChange() {
      if (!this.locationIsValid) {
        this.metadata = undefined;
      }
      try {
        const runReaderInstance = new Run({
          network: "main",
          app: "stotina-duplicator",
        });
        for (const txid of runTxidsToTrust) {
          runReaderInstance.trust(txid);
        }
        const jig = await runReaderInstance.load(this.location);
        this.metadata = JSON.parse(JSON.stringify(jig.metadata));
        console.log(this.metadata);
      } catch (error) {
        console.warn(error);
        this.metadata = undefined;
      }
    },
    async mint() {
      if (!this.metadata) {
        throw new Error("No metadata available to copy");
      }
      if (!this.addressIsValid) {
        throw new Error("Provided owner address appears to be invalid");
      }
      if (!this.countIsValid) {
        throw new Error("Provided count is invalid");
      }

      const run = new Run({
        network: "main",
        app: "stotina-duplicator",
        owner: this.runKey.toString(),
        purse: this.runKey.toString(),
      });
      for (const txid of runTxidsToTrust) {
        run.trust(txid);
      }
      try {
        const DuplicatorNFT = await run.load(
          "4495104c5e5fe20ffa106e54e3d78599bf3a00c7434d0c1b318a68014c2b4985_o1"
        );

        await this.mintNftBulkToOne(
          DuplicatorNFT,
          { ...this.metadata, image: this.imageLocation },
          this.count,
          this.destinationAddr
        );
        alert(`Done!\n\nMinted ${this.count} token(s) to ${this.destinationAddr}`)
      } catch (error) {
        this.error = error.toString().replace(/\n/g, "<br/>");
      }
    },
    async mintNftBulkToOne(Contract, metadata, count, address) {
      let counter = 0;
      const jigs = await this.bulkOperation(
        () => counter < count,
        () => {
          counter++;
          return Contract.mint(address, metadata);
        }
      );
      return jigs.map((i) => i.location);
    },
    async mintNftBulkToMany(Contract, metadata, ...addressList) {
      let counter = 0;
      const jigs = await this.bulkOperation(
        () => counter <= addressList.length,
        () => {
          return Contract.mint(addressList[counter++], metadata);
        }
      );
      return jigs.map((i) => i.location);
    },
    async bulkOperation(loopCondition, callbackOnEachItteration) {
      const tx = new Run.Transaction();
      let counter = 0;
      const callbackResults = [];
      while (loopCondition(counter++)) {
        tx.update(() => {
          callbackResults.push(callbackOnEachItteration());
        });
      }
      await tx.publish();
      return callbackResults;
    },
  },
  props: {},
  components: {},
  computed: {
    locationIsValid() {
      const isMatch = /^[0-9a-f]{64}_o[1-9][0-9]*$/g.test(this.location);
      return isMatch;
    },
    addressIsValid() {
      const isMatch = /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/g.test(
        this.destinationAddr
      );
      return isMatch;
    },
    countIsValid() {
      return 0 < this.count && this.count < 1001;
    },
    imageLocation() {
      if (!this.metadata) return undefined;
      const img = this.metadata.image;
      console.log("img : " + img);
      if (/^[0-9a-f]{64}_o[1-9][0-9]*$/g.test(img)) return img;
      else if (/^_o[1-9][0-9]*$/g.test(img))
        return this.location.split("_")[0] + img;
      else return undefined;
    },
    imageUrl() {
      console.log("Getting image url for : " + this.imageLocation);
      if (!this.imageLocation) return undefined;
      return `https://berry.relayx.com/${this.imageLocation}`;
    },
    purseAddress() {
      return bsvjs.Address.fromPrivKey(this.runKey);
    },
    addressQrCodeBase64() {
      const addr = this.purseAddress.toString();
      const uri =
        `bitcoin:${addr}?sv&amount=0.0005&memo=` +
        encodeURIComponent("funding for RUN Smart Contract");
      const imageBuf = qr.imageSync(uri);
      return imageBuf.toString("base64");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#nftCopyBtn {
  height: 4rem;
}
#nftImage {
  max-width: 400px;
  max-height: 400px;
}
.errorMessage {
  font-size: 1.6rem;
}
</style>
