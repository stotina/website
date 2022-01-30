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
      <div class="my-3">
        <div class="tocCheck text-center mx-auto row">
          <input
            type="checkbox"
            class="col-sm-12 col-md-3 form-control"
            id="agreeTocInput"
            v-model="agreeToC"
          />
          <label
            for="agreeTocInput"
            class="col-sm-12 col-md-9 input-group-text"
          >
            I accept the terms and conditions
          </label>
        </div>
      </div>
      <div class="inputContainer input-group mx-auto row my-3 px-5">
        <input
          v-bind:value="
            duplicateButtonDisabled
              ? `Fill the Form to Enable Duplication`
              : `Duplicate ${count} time(s)`
          "
          v-bind:disabled="duplicateButtonDisabled"
          type="button"
          id="nftCopyBtn"
          v-on:click="mint"
          class="btn btn-primary form-control col"
        />
      </div>
      <div v-if="error" class="errorBox mx-auto text-center mx-auto mb-3 px-5">
        <div v-html="error" class="text-danger errorMessage"></div>
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
    <div class="mx-auto py-4 text-center" v-if="!!metadata">
      <textarea
        disabled
        v-bind:value="JSON.stringify(metadata, null, 2)"
        rows="10"
        style="width:70%;"
      ></textarea>
    </div>
    <div class="tocCheck text-center mx-auto col-8 row">
      <label
        class="col-12 readTocBtn input-group-text"
        v-on:click="onTocViewClick"
      >
        read Terms and Condtions
      </label>
    </div>
  </div>
</template>

<script>
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";
import qr from "qr-image";
import {
  readRelayNFT,
  issueDuplicateNFTs,
} from "./nftDuplicator/runDuplicator";
import termsAndConditions from "./nftDuplicator/termsAndConditions";

export default {
  name: "RUN-NFT-Duplicator",
  data() {
    return {
      runKey: bsvjs.PrivKey.fromString(
        "KzggDyULMLDFbSBidJUBmbozbSgwmdDV7mCD39VjWYtTvrxWALmi"
      ),
      type: "run-relayx-nft",
      location: "",
      destinationAddr: "",
      count: 1,
      agreeToC: false,
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
        const jig = await readRelayNFT(this.location);
        this.metadata = JSON.parse(JSON.stringify(jig.metadata));
        console.log(this.metadata);
      } catch (error) {
        console.warn(error);
        this.metadata = undefined;
      }
    },
    async mint() {
      this.error = undefined;

      try {
        if (!this.metadata) {
          throw new Error("No metadata available to copy");
        }
        if (!this.addressIsValid) {
          throw new Error("Provided owner address appears to be invalid");
        }
        if (!this.countIsValid) {
          throw new Error("Provided count is invalid");
        }
        if (!this.agreeToC) {
          throw new Error("You must accept the terms and conditions");
        }

        await issueDuplicateNFTs(
          this.runKey.toString(),
          { ...this.metadata, image: this.imageLocation },
          this.count,
          this.destinationAddr
        );
        alert(
          `Done!\n\nMinted ${this.count} token(s) to ${this.destinationAddr}`
        );
      } catch (error) {
        this.error = error.toString().replace(/\n/g, "<br/>");
      }
    },
    onTocViewClick() {
      alert(termsAndConditions);
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
      try {
        bsvjs.Address.fromString(this.destinationAddr);
        return true;
      } catch (error) {
        return false;
      }
    },
    countIsValid() {
      return 0 < this.count && this.count < 1001;
    },
    imageLocation() {
      if (!this.metadata) return undefined;
      const img = this.metadata.image;
      if (/^[0-9a-f]{64}_o[1-9][0-9]*$/g.test(img)) return img;
      else if (/^_o[1-9][0-9]*$/g.test(img))
        return this.location.split("_")[0] + img;
      else return undefined;
    },
    imageUrl() {
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
    duplicateButtonDisabled() {
      return (
        !this.metadata ||
        !this.addressIsValid ||
        !this.countIsValid ||
        !this.agreeToC
      );
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
.readTocBtn {
  display: block;
  color: var(--font-footerLinks) !important;
}
.readTocBtn:hover {
  text-decoration: underline;
}
</style>
