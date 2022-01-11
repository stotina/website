import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";

import AppsPage from "./components/AppsPage.vue";
import ToolsPage from "./components/ToolsPage.vue";
import HomePage from "./components/HomePage.vue";

import AboutPage from "./components/AboutPage.vue";
import ArticlePage from "./components/ArticlePage.vue";
import BlogPage from "./components/BlogPage.vue";
import FaqPage from "./components/FaqPage.vue";
import PrivacyPage from "./components/PrivacyPage.vue";
import TermsPage from "./components/TermsPage.vue";
import Donate from "./components/Donate.vue";

require("jquery");
require("bootstrap");
require("./assets/bootstrap-cyborg.min.css");
require("@fortawesome/fontawesome-free");
require("@fortawesome/fontawesome-free/css/all.min.css");

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { path: "/", component: HomePage },

        { path: "/tools", component: ToolsPage },
        
        { path: "/apps", component: AppsPage },

        { path: "/about", component: AboutPage },
        { path: "/article", component: ArticlePage },
        { path: "/blog", component: BlogPage },
        { path: "/faq", component: FaqPage },
        { path: "/privacy", component: PrivacyPage },
        { path: "/terms", component: TermsPage },
        { path: "/donate", component: Donate }
    ],
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");