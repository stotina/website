<template>
  <div>
    <h1 class="text-center">Bitcoin Payment Request Parser</h1>

    <div class="ml-4">
      <div class="input-group row">
        <textarea
          type="text"
          id="uriInput"
          class="form-control col-md-9"
          v-model="uri"
        ></textarea>
        <input
          type="button"
          id="uriParseBtn"
          class="btn btn-primary form-control col-md-3"
          value="Parse"
          @click="onParseBtnClick"
        />
      </div>
      <br />
      <div class="resultsContainer">
        
      </div>
    </div>
  </div>
</template>

<script>
import {bitUriParser} from "../../assets/js/bitUriParser/index";

export default {
  name: "Parse-URI",
  data() {
    return {
      uri: "bitcoin:1FMif2XbHJx5L2x6QWYKyWEWPpxJC1ipXw",
    };
  },
  methods: {
    parse(uri) {
      bitUriParser.parse(uri);
    },
  },
  props: {},
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
</style>
