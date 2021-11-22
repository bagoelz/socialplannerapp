import Vue from "vue";
import App from "./App.vue";
import PortalVue from "portal-vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/';

Vue.use(PortalVue);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
