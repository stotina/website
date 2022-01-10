<template>
  <div>
    <div class="faq-item">
      <p>
        <button
          class="btn btn-outline-primary"
          type="button"
          data-toggle="collapse"
          :data-target="'#' + this.id"
          aria-expanded="false"
          :aria-controls="this.id"
        >
          {{ this.question }}
        </button>
      </p>
      <div class="collapse" :id="this.id">
        <div class="card card-body">
          {{ this.answer }}
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FaqItem",
  data() {
    return {};
  },
  props: {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    id_sufix: {
      type: String,
      default: null,
    },
  },
  computed: {
    id() {
      return (
        "faq_item" +
        (this.id_sufix ||
          Math.random()
            .toString()
            .replace(".", ""))
      );
    },
  },
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.faq-item {
  text-align: center;
}
</style>
