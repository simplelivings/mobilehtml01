import Vue from 'vue'
import './plugins/axios'
import App from './views/App.vue'
import router from './router'
import store from './store'
import http from '../http'
import {quitAudit} from '../common'
import Vant from 'vant'
import {Toast} from 'vant'
import 'vant/lib/index.css';


Vue.config.productionTip = false
Vue.prototype.$http=http
Vue.prototype.$msg = Toast
Vue.prototype.$quitAudit=quitAudit
Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
