import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import AppNewsPage from "./components/AppNewsPage.vue";
import AppsPage from "./components/AppsPage.vue";
import HomePage from "./components/HomePage.vue";

require("jquery");
require("bootstrap");
require("./assets/bootstrap-cyborg.min.css");
require("@fortawesome/fontawesome-free")
require("@fortawesome/fontawesome-free/css/all.css")

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: HomePage },
    { path: '/apps', component: AppsPage },
    { path: '/apps/news', component: AppNewsPage },
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
