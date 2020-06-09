<template>
  <div class="footer theme-bg-nav row">
    <div class="footer-group col-md-4 col-lg-2" style="text-align:center;">
      <div>
        <img src="/images/logo.png" alt />
      </div>
      <div>Copyright © 2020 Stotina</div>
    </div>

    <div class="footer-group col-md-4 col-lg-2">
      <div class="footer-group-title">Links</div>
      <div
        class="footer-link theme-c-footerLinks theme-c-hover pointer"
        v-on:click="navigate('/faq')"
      >
        FAQ
      </div>
      <div
        class="footer-link theme-c-footerLinks theme-c-hover pointer"
        v-on:click="navigate('/terms')"
      >
        Terms
      </div>
      <div
        class="footer-link theme-c-footerLinks theme-c-hover pointer"
        v-on:click="navigate('/privacy')"
      >
        Privacy
      </div>
    </div>

    <div class="footer-group col-md-4 col-lg-2">
      <div class="footer-group-title">Stotina</div>
      <div
        class="footer-link theme-c-footerLinks theme-c-hover pointer"
        v-on:click="navigate('/about')"
      >
        About Us
      </div>
      <div
        class="footer-link theme-c-footerLinks theme-c-hover pointer"
        v-on:click="navigate('/blog')"
      >
        News Blog
      </div>
    </div>

    <div class="footer-group col-md-12 col-lg-6">
      <div class="footer-group-title">Apps</div>
      <div style="display:flex; flex-wrap:wrap;">
        <div
          v-for="app in this.apps"
          :key="app.id"
          class="footer-link theme-c-footerLinks theme-c-hover pointer col-md-4 center"
          v-on:click="navigate(app.path)"
        >
          {{ app.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apps from "../../assets/apps.json";

export default {
  name: "FooterElement",
  data() {
    return { apps: apps };
  },
  props: {},
  computed: {
    currentPage() {
      return this.$router.currentRoute.path;
    },
  },
  methods: {
    navigate(path) {
      this.$router.push(path);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  padding-top: 1rem;
  position: relative;
  z-index: 2;
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
