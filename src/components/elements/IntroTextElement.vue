<template>
  <div class="introWrapper text-center">
    <div class="intro">
      <div class="title">BITCOIN FOR BUSINESS</div>
      <div class="description">
        <div>Helping your business get an edge.<br>
          Focused on practicality, not on trends.<br>
          Do more with less.
        </div>
      </div>
      <button class="call-to-action" v-on:click="onLetsTalkClick()">
        Lets Talk!
      </button>
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
  components: {},
  methods: {
    onLetsTalkClick() {
      this.$router.push("/about");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.introWrapper {
  padding-top: 20px;
}
.intro {
  padding: 2rem;
  margin: auto;
  width: 80%;
}
.title {
  font-size: 2rem;
  margin: 1rem 0;
}
.description {
  font-size: 1.1rem;
}

.call-to-action {
  display: inline-block;
  margin: auto;
  padding: 10px 20px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  background: #2a9fd6;
  border: 4px solid transparent;
  border-radius: 25px;
  color: black;
  margin: 30px 0;
}

.call-to-action:hover {
  border: 4px ridge #0e3649;
  text-decoration: underline;
}
</style>
