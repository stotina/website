<template>
  <div>
    <div class="row" v-if="showIfValueMissing ? true : value || value.length">
      <u
        v-bind:class="
          `font-weight-bold text-uppercase col-sm-12 col-md-${keyColumnSize}`
        "
        >{{ name }}</u
      >
      <div
        v-bind:class="
          `col-sm-${12 - keyColumnSize} col-md-8 text-break overflow-hidden`
        "
      >
        <slot>{{ value }}</slot>
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
    value: {},
    name: {
      type: String,
    },
    showIfValueMissing: {
      type: Boolean,
      default: true,
    },
    keyColumnSize: {
      type: Number,
      default: 4,
    },
  },
  computed: {},
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
