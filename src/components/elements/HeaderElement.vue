<template>
  <div class="header">
    <nav class="navbar navbar-expand navbar-fixed-top">
      <a class="navbar-brand" v-on:click="navigate('/')">STOTINA</a>

      <ul class="nav navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link" v-on:click="navigate('/')">
            <i class="fas fa-home"></i> Home
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-on:click="navigate('/apps')">Applications</a>
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
.nav-item.active {
  text-decoration: underline;
}
.nav-link {
  color: #2a9fd6;
}
</style>
