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

import BsvTestnetWalletPage from "./components/tools/BsvTestnetWalletPage.vue"
import ConsoleBsvJs15Page from "./components/tools/ConsoleBsvJs15Page.vue"
import ConsoleBsvJs20Page from "./components/tools/ConsoleBsvJs20Page.vue"
import ConvertDataPage from "./components/tools/ConvertDataPage.vue"
import CurrencyConverterPage from "./components/tools/CurrencyConverterPage.vue"
import DecodeRawTxPage from "./components/tools/DecodeRawTxPage.vue"
import EvalBitcoinScriptPage from "./components/tools/EvalBitcoinScriptPage.vue"
import GenerateTestKeysPage from "./components/tools/GenerateTestKeysPage.vue"
import MapiGuiPage from "./components/tools/MapiGuiPage.vue"
import ParseBitcoinUriPage from "./components/tools/ParseBitcoinUriPage.vue"
import RpcDashboardPage from "./components/tools/RpcDashboardPage.vue"
import TxDemoPage from "./components/tools/TxDemoPage.vue"

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

    { path: "/tools/decoderaw", component: DecodeRawTxPage },
    { path: "/tools/parseuri", component: ParseBitcoinUriPage },
    { path: "/tools/currencyconverter", component: CurrencyConverterPage },
    { path: "/tools/scripteval", component: EvalBitcoinScriptPage },
    { path: "/tools/generatekey", component: GenerateTestKeysPage },
    { path: "/tools/convertdata", component: ConvertDataPage },
    { path: "/tools/txdemo", component: TxDemoPage },
    { path: "/tools/testnetwallet", component: BsvTestnetWalletPage },
    { path: "/tools/debugbsv15", component: ConsoleBsvJs15Page },
    { path: "/tools/debugbsv2", component: ConsoleBsvJs20Page },
    { path: "/tools/rpcdashboard", component: RpcDashboardPage },
    { path: "/tools/mapigui", component: MapiGuiPage },

    { path: "/apps", component: AppsPage },

    { path: "/about", component: AboutPage },
    { path: "/article", component: ArticlePage },
    { path: "/blog", component: BlogPage },
    { path: "/faq", component: FaqPage },
    { path: "/privacy", component: PrivacyPage },
    { path: "/terms", component: TermsPage },
  ],
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
