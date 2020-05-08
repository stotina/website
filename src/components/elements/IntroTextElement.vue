<template>
  <div class="introWrapper">
    <div class="intro">
      <div class="title">Simplicity is Key</div>
      <div class="description">
        <div>Amazing technology is only trully amazing when it is simple to use. The world moves faster than ever. Simplicity is the key to keeping up with it.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IntroTextElement",
  data() {
    return {};
  },
  props: {},
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.introWrapper {
  padding-top: 100px;
}
.intro {
  padding: 2rem;
  margin: auto;
  width: 75%;
}
.title {
  font-size: 3rem;
  margin: 1rem 0;
}
.description {
  font-size: 1.1rem;
}
</style>
