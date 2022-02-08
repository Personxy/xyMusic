import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/css/global.css';
import './plugins/timefilter';
import axios from 'axios';
import VueAxios from 'vue-axios';
// 引入Animate.css 库
import animated from 'animate.css';
// import '@/assets/iconbofangshunxu/iconfont.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(animated);
axios.defaults.baseURL = 'https://netease-cloud-music-api-puce-iota.vercel.app/';
// axios.defaults.baseURL = 'http://localhost:3000';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
