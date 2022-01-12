<template>
  <div class="footer theme-bg-nav row">
    <div class="footer-group col-md-5 col-lg-1" style="text-align:center;">
      <div>
        <img src="/images/logo.png" alt />
      </div>
      <div>Copyright © 2020 Stotina</div>
    </div>

    <div class="footer-group col-md-7 col-lg-2">
      <div class="row footer-group-title">Stotina</div>
      <div class="row">
        <div
          class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
          v-on:click="navigate('/about')"
        >
          About Us
        </div>
        <div
          class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
          v-on:click="navigate('/blog')"
        >
          News Blog
        </div>
        <div
          class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
          v-on:click="navigate('/faq')"
        >
          FAQ
        </div>
        <div
          class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
          v-on:click="navigate('/terms')"
        >
          Terms
        </div>
        <div
          class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
          v-on:click="navigate('/privacy')"
        >
          Privacy
        </div>
      </div>
    </div>

    <div class="footer-group col-md-12 col-lg-4">
      <div class="row footer-group-title">Tools</div>
      <div class="row">
        <div
          v-for="tool in this.tools"
          :key="tool.id"
          class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12 col-md-4 col-lg-6"
          v-on:click="navigate(tool.path)"
        >
          {{ tool.name }}
        </div>
      </div>
    </div>

    <div class="footer-group col-md-12 col-lg-4">
      <div class="row footer-group-title">Apps</div>
      <div class="row">
        <div
          v-for="app in this.apps"
          :key="app.id"
          class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12 col-md-4 col-lg-6"
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
import tools from "../../assets/tools.json";

export default {
  name: "FooterElement",
  data() {
    return {
      apps: apps.map((el, id) => ({ ...el, id })),
      tools: tools.map((el, id) => ({ ...el, id })),
    };
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
  min-width: 10rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.footer-group-title {
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid white;
  margin-bottom: 0.2rem;
  margin-left: 0.5rem;
}

.footer-link {
  padding: 0;
  border: 1px solid transparent;
}

.footer-link:hover {
  border: 1px solid var(--hover-font-important) !important;
}
</style>
