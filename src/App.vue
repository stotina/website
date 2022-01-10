<template>
  <div id="app" class="theme-bg-appBase theme-c-mainFont">
    <link rel="stylesheet" href="/styles/colorScheme.css" />
    <HeaderElement></HeaderElement>
    
    <div class="bellow-slogan theme-bg-main">
      <router-view></router-view>
    </div>
    <FooterElement></FooterElement>
  </div>
</template>

<script>
import HeaderElement from "./components/elements/HeaderElement";
import FooterElement from "./components/elements/FooterElement";

export default {
  name: "App",
  data() {
    return {
      path: "",
    };
  },
  computed: {},
  components: { HeaderElement, FooterElement },
  methods: {
    updateSloganHeader() {
      var h = window.location.hash;
      var i = h.indexOf("?");
      var path = h.substr(1, i >= 0 ? i : h.length);

      if (this.path.toString() === path) return;

      this.path = path;

      if (!this.shouldDisplaySloganHeader) return;
    },
  },
  created() {
    this.updateSloganHeader();
    setInterval(this.updateSloganHeader, 200);
  },
};
</script>

<style>
html {
  overflow: -moz-scrollbars-vertical;
  overflow-y: scroll;
}
* {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.titleFont {
  font-weight: bold;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
.bellow-slogan {
  position: relative;
  z-index: 2;
  min-height: max(20vw, 20vh);
}
.pointer {
  cursor: pointer;
}
</style>
