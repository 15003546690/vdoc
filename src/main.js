// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import VueClipboards from 'vue-clipboards';
import VueQuillEditor from 'vue-quill-editor'
import Base64 from 'js-base64';
import './assets/css/base.css';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/iconfont/iconfont.css';
import './assets/js/axios.js';
import './assets/js/common.js';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import store from './assets/js/store.js';
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueClipboards);
Vue.use(VueQuillEditor)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
