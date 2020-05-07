import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import AppNewsPage from "./components/AppNewsPage.vue";
import AppsPage from "./components/AppsPage.vue";
import HomePage from "./components/HomePage.vue";

import AboutPage from "./components/AboutPage.vue";
import BlogPage from "./components/BlogPage.vue";
import ContactPage from "./components/ContactPage.vue";
import FaqPage from "./components/FaqPage.vue";
import PrivacyPage from "./components/PrivacyPage.vue";
import TermsPage from "./components/TermsPage.vue";

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

    { path: '/about', component: AboutPage },
    { path: '/blog', component: BlogPage },
    { path: '/contact', component: ContactPage },
    { path: '/faq', component: FaqPage },
    { path: '/privacy', component: PrivacyPage },
    { path: '/terms', component: TermsPage },
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
