<template>
  <div class="footer sc-bg3">
    <div class="footer-group" style="text-align:center;">
      <div>
        <img src="/images/logo.png" alt />
      </div>
      <div>Copyright © 2020 Stotina</div>
    </div>
    <div class="footer-group">
      <div class="footer-group-title">Links</div>
      <div class="footer-link sc-c2 sc-c-hover pointer" v-on:click="navigate('/faq')">FAQ</div>
      <div class="footer-link sc-c2 sc-c-hover pointer" v-on:click="navigate('/terms')">Terms</div>
      <div class="footer-link sc-c2 sc-c-hover pointer" v-on:click="navigate('/privacy')">Privacy</div>
    </div>
    <div class="footer-group">
      <div class="footer-group-title">Stotina</div>
      <div class="footer-link sc-c2 sc-c-hover pointer" v-on:click="navigate('/contact')">Contact Us</div>
      <div class="footer-link sc-c2 sc-c-hover pointer" v-on:click="navigate('/about')">About Us</div>
      <div class="footer-link sc-c2 sc-c-hover pointer" v-on:click="navigate('/blog')">News Blog</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterElement",
  data() {
    return {};
  },
  props: {},
  computed: {
    currentPage() {
      return this.$router.currentRoute.path;
    }
  },
  methods: {
    navigate(path) {
      this.$router.push(path);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  padding-top: 1rem;
  position: relative;
  z-index: 2;

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.footer img {
  width: 100px;
}

.footer-group {
  padding: 2rem;
  min-width: 10rem;
}
.footer-group-title {
  font-weight: bold;
  border-bottom: 1px solid white;
  margin-bottom: 0.5rem;
}
</style>
