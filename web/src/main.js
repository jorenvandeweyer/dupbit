import Vue from 'vue'
import App from './App.vue'
import router from './router'
import NavigationGuard from './router/navigationGuard';
import moment from 'moment'

import './assets/styles/index.scss';

Vue.config.productionTip = false;
Vue.prototype.moment = (date, format) => {
  return moment(date).format(format || 'YYYY-MM-DD HH:mm');
};

const store = {
  host: process.env.VUE_APP_API_HOST,
  auth: null,
};

router.beforeEach(NavigationGuard.bind(store));

async function init() {
  const response = await fetch(`${store.host}/account`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json' }
  });

  const result = await response.json();

  if (result && result.success) {
    store.auth = result;
  }

  new Vue({
    router,
    data: store,
    computed: {
      authenticated() { return !!this.auth; }
    },
    methods: {
      request: async function(options) {
        const response = await fetch(`${this.host}${options.path}`, {
          credentials: 'include',
          method: options.method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: (options.body ? JSON.stringify(options.body) : undefined),
        });

        return response.json();
      },
      validateSession: async function() {
        const result = await this.request({
          method: 'GET',
          path: '/account',
        });

        if (result?.success) {
          this.auth = result;
          console.log('authenticated', this.auth);
        }

        if (result?.success === false) {
          this.auth = null;
        }
        //else server down?
      },
      configureWebhook: async function() { }
    },
    render: h => h(App)
  }).$mount('#app')
}

init();
