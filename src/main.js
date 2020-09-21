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
import VueQuillEditor from 'vue-quill-editor'//导入富文本编辑器
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


Vue.prototype.$axios = axios
Vue.prototype.$http = http;
Vue.component('tree-table',TreeTable);

Vue.filter('dateflomt',function(origin){
  const dat = new Date(origin*1000)
  const y = dat.getFullYear();
  const m = (dat.getMonth() +1+'').padStart(2,'0')
  const d = (dat.getDate()+'').padStart(2,'0')
  const hh = (dat.getHours()+'').padStart(2,'0')
  const mm = (dat.getMinutes()+'').padStart(2,'0')
  const ss = (dat.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



Vue.use(ElementUI);
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
