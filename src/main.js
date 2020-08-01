import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
//引入ElementUi
Vue.use(ElementUI);

import directives from './assets/js/directives'
//引入拖拽
Vue.directive('dialogDrag', directives)

//三级联动文件
import Distpicker from 'v-distpicker'
Vue.component('v-distpicker', Distpicker)

//挂在原型上的函数集合
import prototypeFun from './assets/js/prototypeFun'
Vue.use(prototypeFun)

//日期处理lib
import moment from 'moment';

moment.locale('zh-cn')

//封装请求
import Axios from 'axios'

Axios.defaults.baseURL = (process.env.VUE_APP_TITLE == 'online' || process.env.VUE_APP_TITLE == 'testing') ? '/' : '/api'
// Axios.defaults.baseURL = '/'
Axios.defaults.withCredentials = true
Axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
Axios.interceptors.request.use(
  request => {
    let token = sessionStorage.getItem('token')
    if (token) {
      request.headers['Authorization'] = token;
    }
    return request;
  },
  error => {
    return Promise.reject(error);
  }
)
Vue.prototype.$axios = Axios

//阻止启动生产消息
Vue.config.productionTip = false

import store from './store' //引入store
if (sessionStorage.getItem("store")) {
  store.replaceState(
    Object.assign({},
      store.state,
      JSON.parse(sessionStorage.getItem("store"))
    )
  );
  sessionStorage.removeItem("store")
}
//监听，在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("store", JSON.stringify(store.state));
})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
