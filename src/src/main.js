import Vue from 'vue';
import store from './vuex/store';
import VueRouter from 'vue-router';
import routes from './routers'; // 引入路由配置
import vueResource from 'vue-resource';
import VueLazyload from 'vue-lazyload'; // 引入图片懒加载模块
import barrage from 'vue2-barrage';
// import {loadFromlLocal} from './common/js/store';  // 公共方法：本地缓存
import './common/css/index.styl'; // 引入公共样式
import VueScroller from 'vue-scroller';
Vue.use(VueScroller);

var VueTouch = require('vue-touch');
Vue.use(VueTouch, {name: 'v-touch'});
Vue.use(barrage);
Vue.use(VueRouter);
Vue.use(vueResource);

// error，loading是图片路径, 用require引入
Vue.use(VueLazyload, {
    error: require('./assets/404.png'),
    loading: require('./assets/loading.gif'),
    attempt: 1
  }
);
const router = new VueRouter({
  'linkActiveClass': 'active',
  history: true,
  saveScrollPositon: true,
  routes // （缩写）相当于 routes: routes
});
/**
 * 创建和挂载根实例。
 * 记得要通过 router 配置参数注入路由，
 * 从而让整个应用都有路由功能
 */

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition;
  } else {
    const position = {};
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash;
    }
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some(m => m.meta.scrollToTop)) {
      // cords will be used if no selector is provided,
      // or if the selector didn't match any element.
      position.x = 0;
      position.y = 0;
    }
    // if the returned position is falsy or an empty object,
    // will retain current scroll position.
    return position;
  }
};

const routerApp = new Vue({
  store,
  scrollBehavior,
  router
}).$mount('#app');

/**
 * loadFromlLocal()是读取本地缓存数据，具体common/js/store.js 查看
 *
 *
 */
// if (!loadFromlLocal('gank', 'welcome', false)) {
   router.push('/welcome');
// }
export default routerApp;
