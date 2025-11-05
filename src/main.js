import { createApp } from "vue";
import { Dialog, Loading, Notify, Quasar } from "quasar";
import quasarLang from "quasar/lang/pt-BR";

import "moment/dist/locale/pt-br";

import App from "./App.vue";
import router from "./router";

import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";
import "@quasar/extras/material-symbols-outlined/material-symbols-outlined.css";
import "quasar/src/css/index.sass";
import "@/assets/css/tailwind.css";

import { createPinia } from "pinia";
import VueApexCharts from "vue3-apexcharts";

const pinia = createPinia();

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Loading,
    Notify,
    Dialog
  },
  lang: quasarLang,

  config: {
    notify: {},
    loading: {}
  }
});

app.use(router);
app.use(pinia);
app.use(VueApexCharts);
app.component("apexchart", VueApexCharts);
app.mount("#app");
