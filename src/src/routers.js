// require.ensure 是 Webpack 的特殊语法，用来设置 组件到底路径
/**
 * 1.定义路由，每个路由应该映射一个组件
 * path : 浏览器的显示的路径
 * name ： 路由的名字
 * component : 路由的组件路径
 */
const routers = [{
  path: '/',
  name: 'index',
  component(resolve) {
    require.ensure(['./App.vue'], () => {
      resolve(require('./App.vue'));
    });
  },
  children: [
    {
      path: '/video',
      name: 'video',
      meta: {
        keep_alive: true
      },
      component(resolve) {
        require.ensure(['./components/welfare/welfare.vue'], () => {
          resolve(require('./components/welfare/welfare.vue'));
        });
      }
    },
    /* {
      path: '/day',
      name: 'day',
      component(resolve) {
        require.ensure(['./components/recommend/recommend.vue'], () => {
          resolve(require('./components/recommend/recommend.vue'));
        });
      },
      meta: {requiresAuth: true}
    }, */
    {
      path: '/ios',
      name: 'ios',
      component(resolve) {
        require.ensure(['./components/lists/ios.vue'], () => {
          resolve(require('./components/lists/ios.vue'));
        });
      },
      meta: {requiresAuth: true}
    }, {
      path: '/android',
      name: 'android',
      component(resolve) {
        require.ensure(['./components/lists/android.vue'], () => {
          resolve(require('./components/lists/android.vue'));
        });
      }
    }, {
      path: '/web',
      name: 'web',
      component(resolve) {
        require.ensure(['./components/lists/web.vue'], () => {
          resolve(require('./components/lists/web.vue'));
        });
      }
    },
    {
      path: '/live',
      name: 'live',
      meta: {
        keep_alive: true
      },
      component(resolve) {
        require.ensure(['./components/live/livePage.vue'], () => {
          resolve(require('./components/live/livePage.vue'));
        });
      }
    },
    {
      path: '/hot',
      name: 'hot',
      meta: {
        keep_alive: true
      },
      component(resolve) {
        require.ensure(['./components/hot/hotPage.vue'], () => {
          resolve(require('./components/hot/hotPage.vue'));
        });
      }
    },
    {
      path: '/record',
      name: 'record',
      meta: {
        keep_alive: false
      },
      component(resolve) {
        require.ensure(['./components/mediaSelect/mediaSelect.vue'], () => {
          resolve(require('./components/mediaSelect/mediaSelect.vue'));
        });
      }
    },
    {
      path: '/my',
      name: 'my',
      meta: {
        keep_alive: false
      },
      component(resolve) {
        require.ensure(['./components/my/my.vue'], () => {
          resolve(require('./components/my/my.vue'));
        });
      }
    },
    {
      path: '/videoDetail',
      name: 'videoDetail',
      component(resolve) {
        require.ensure(['./components/lazyloadImg/videoDetail.vue'], () => {
          resolve(require('./components/lazyloadImg/videoDetail.vue'));
        });
      },
      children: [
        {
          name: 'videoDetailMessage',
          path: '/videoDetail/message',
          component(resolve) {
            require.ensure(['./components/lazyloadImg/videoMessage.vue'], () => {
              resolve(require('./components/lazyloadImg/videoMessage.vue'));
            });
          }
        },
        {
          name: 'videoDetailRecommand',
          path: '/videoDetail/recommand',
          component(resolve) {
            require.ensure(['./components/lazyloadImg/videoRecommand.vue'], () => {
              resolve(require('./components/lazyloadImg/videoRecommand.vue'));
            });
          }
        }
      ]
    },
    {
      path: '/liveDetail',
      name: 'liveDetail',
      component(resolve) {
        require.ensure(['./components/live/liveDetail.vue'], () => {
          resolve(require('./components/live/liveDetail.vue'));
        });
      },
      children: [
        {
          name: 'liveDetailMessage',
          path: '/liveDetail/message',
          component(resolve) {
            require.ensure(['./components/live/liveMessage.vue'], () => {
              resolve(require('./components/live/liveMessage.vue'));
            });
          }
        },
        {
          name: 'liveDetailRecommend',
          path: '/liveDetail/recommend',
          component(resolve) {
            require.ensure(['./components/live/liveRecommend.vue'], () => {
              resolve(require('./components/live/liveRecommend.vue'));
            });
          }
        },
        {
          name: 'liveDetailRank',
          path: '/liveDetail/rank',
          component(resolve) {
            require.ensure(['./components/live/liveRank.vue'], () => {
              resolve(require('./components/live/liveRank.vue'));
            });
          }
        }
      ]
    }
  ]
  },
  {
    path: '/welcome',
    name: 'welcome',
    component(resolve) {
      require.ensure(['./components/welcome/welcome.vue'], () => {
        resolve(require('./components/welcome/welcome.vue'));
      });
    }
  }];

export default routers;
