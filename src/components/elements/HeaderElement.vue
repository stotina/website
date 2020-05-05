<template>
  <div class="header">
    <nav class="navbar navbar-expand navbar-fixed-top">
      <a class="navbar-brand pointer" v-on:click="navigate('/')">
        <span class="site-title">
          <img id="site-title-logo" src="/images/logo-small.png" />
          STOTINA
        </span>
      </a>

      <ul class="nav navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link pointer" v-on:click="navigate('/')">
            <i class="fas fa-home"></i> Home
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link pointer" v-on:click="navigate('/apps')">Applications</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "HeaderElement",
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
.header {
  position: relative;
  z-index: 2;
  background-color: #060606;
  border-bottom: 1px solid #96969636;
}
.nav-item.active {
  text-decoration: underline;
}
.nav-link {
  color: #2a9fd6;
}
.site-title {
  font-size: 2rem;
  display: inline-block;
  padding: 2px 0;
  font-weight: bold;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
#site-title-logo {
  height: 2rem;
  margin-left: 0.5rem;
  margin-right: 0.3rem;
  border: 2px solid #96969636;
  border-radius: 2rem;
}
.pointer {
  cursor: pointer;
}
</style>
