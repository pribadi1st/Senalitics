import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import vuetify from './plugins/vuetify'
import router from './router'
import App from './App.vue'


// const NotFound = { template: '<p>Page not found</p>' }

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(VueRouter)


new Vue({
  vuetify,
  router,
  render: function(createElement){
    return createElement(App)
  }
}).$mount('#app')