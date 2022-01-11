<template>
  <div>
    <div class="appListBox row">
      <div v-for="app in apps" v-bind:key="app.id" class="col-lg-4 col-md-6">
        <div
          class="appListItem theme-br-mainFont"
          :class="app.path ? 'pointer animate' : 'empty'"
          v-on:click="onAppClick(app)"
        >
          <div class="appTitleArea">
            <div class="appTitleIconBox">
              <img v-if="app.icon" v-bind:src="app.icon" :alt="app.name" />
            </div>
            <div class="appTitle">{{ app.name }}</div>
          </div>
          <div class="appPhoneBox">
            <div
              class="appPhoneFrame theme-br-mainFont"
              :style="`background-image:url('${app.screenImage}')`"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apps from "../../assets/apps.json";

export default {
  name: "AppListElement",
  data() {
    return {
      apps: apps,
    };
  },
  props: {},
  computed: {},
  methods: {
    onAppClick(app) {
      if (app.path) this.$router.push(app.path);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.appListBox {
  width: 80%;
  margin: auto;
}
.appListItem {
  margin-top: 20px;
  margin-bottom: 20px;
  border-width: 4px;
  border-style: solid;
  border-radius: 1rem;
}

.appTitleArea {
  padding-top: 20px;
  text-align: center;
}
.appTitleIconBox {
  display: inline-block;
  width: 90px;
  height: 80px;
  border-radius: 10px;
  background-color: var(--bg-color-mainFont) !important;
}
.appTitleIconBox img {
  width: 90%;
  height: 90%;
  margin: 5% 5%;
}
.appTitle {
  font-size: 1.7em;
  font-weight: bold;
}

.appPhoneBox {
  margin-top: 10px;
  height: 270px;
  overflow: hidden;
}

.appPhoneBox .appPhoneFrame {
  width: 200px;
  height: 400px;
  background-size: 100% auto;
  background-repeat: no-repeat;
  border-width: 10px;
  border-top-width: 30px;
  border-style: solid;
  border-radius: 1em;
  margin: auto;
  margin-top: 20px;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.appListItem.animate:hover .appPhoneFrame {
  transform: rotate(5deg);
  transition: transform 0.3s ease-in-out;
}
.appListItem.empty:hover .appPhoneFrame {
  border: 10px solid #ffffff44 !important;
  border-top: 30px solid #ffffff44 !important;
  transition: 0.5s ease-in-out;
}

.appListItem:hover .appTitleArea {
  transition: color 0.5s;
  color: var(--font-footerLinks) !important;
  transform: scale(1.05);
}

.appListItem:hover .appTitleArea .appTitleIconBox {
  transition: background-color 0.5s;
  background-color: var(--font-footerLinks) !important;
}
</style>
