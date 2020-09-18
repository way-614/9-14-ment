import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import 'lib-flexible/flexible'
import http from "./network/request";
import './assets/fonts/fonts/iconfont.css'
import axios from "axios"

import TreeTable from "vue-table-with-tree-grid"


Vue.prototype.$axios = axios
Vue.prototype.$http = http;
Vue.component('tree-table',TreeTable);



Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
