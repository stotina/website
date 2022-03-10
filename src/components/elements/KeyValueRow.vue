<template>
  <div>
    <div class="row" v-if="showIfValueMissing ? true : value || value.length">
      <u class="font-weight-bold text-capitalize col-sm-12 col-md-4">{{
        name
      }}</u>
      <div class="col-sm-12 col-md-8 text-break overflow-hidden">
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "KeyValueRow",
  data() {
    return {};
  },
  props: {
    value: { },
    name: {
      type: String,
    },
    showIfValueMissing: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
