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
// 引入虚拟列表
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
// import '@/assets/iconbofangshunxu/iconfont.css';
//解决跨域
// import { VueJsonp } from 'vue-jsonp';

Vue.config.productionTip = false;
// Vue.use(VueJsonp);
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(animated);
Vue.use(VueVirtualScroller);
// axios.defaults.baseURL = 'https://netease-cloud-music-api-puce-iota.vercel.app/';
// 使用了本地代理 解决跨域 配置在vue.config.js 所以值是'/api'
axios.defaults.baseURL = '/api';
// api如果在本地将baseURL改成http://localhost:3000
// axios.defaults.baseURL = 'http://localhost:3000';

// 请求拦截器
axios.interceptors.request.use((config) => {
  // 请求头带上cookie
  if (window.sessionStorage.getItem('userInfo') !== 'null' && window.sessionStorage.getItem('userInfo') !== null) {
    // `withCredentials` 表示跨域请求时是否需要使用凭证
    axios.defaults.withCredentials = true;
    document.cookie = window.sessionStorage.getItem('cookie');
    if (!config.headers.cookie) {
      if (!config.params) {
        config.params = { cookie: '' };
        config.params.cookie = window.sessionStorage.getItem('cookie');
      }
      config.params.cookie = window.sessionStorage.getItem('cookie');
    }
  } else {
    axios.defaults.withCredentials = false;
  }
  // 获取歌曲必须加上realIP不然会出现获取不到url的情况
  if (config.url == '/song/url') {
    config.params.realIP = '211.161.244.70';
  }

  return config;
});
// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    error = error.response;
    return Promise.reject(error);
  }
);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
