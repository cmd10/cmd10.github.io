<template>
  <div class="livePage">
    <scroller class="livePageScroller"
              style="top: 44px"
              :on-refresh="loadTop"
              :on-infinite="loadMore">
      <v-touch class="livePageWrapper" v-on:swipeleft="onSwipeLeft"  v-on:swiperight="onSwipeRight" v-bind:swipe-options="{ direction: 'horizontal', threshold: 100 }">
        <div class="livePageWrapperCenter">
          <div v-show="leftData.length > 0" v-for="data in leftData">
            <v-live class="liveWrap" ref="liveWrap" :data="data"></v-live>
          </div>
        </div>
        <div class="livePageWrapperCenter">
          <div v-show="rightData.length > 0" v-for="data in rightData">
            <v-live class="liveWrap" ref="liveWrap" :data="data"></v-live>
          </div>
        </div>
      </v-touch>
    </scroller>
    <!-- <infinite-loading :on-infinite="loadMore" ref="infiniteLoading"  spinner="bubbles">
      <span slot="no-more">
        There is no more video :(
       </span>
      <span slot="failed">
        Load failed :(
       </span>
    </infinite-loading> -->
  </div>
</template>

<script>
  import vLive from './live.vue';
  import liveSdk from './live_sdk.js';
  import InfiniteLoading from 'vue-infinite-loading';
  import { CONFIG } from '../../common/js/config';

  export default {
    data() {
      return {
        leftData: [],
        rightData: [],
        busy: false,
        pageNum: 10,
        detailsData: {},
        time: '',
        showFlag: true,
        noMore: false
      };
    },
    components: {
      vLive,
      InfiniteLoading
    },
    created() {
      console.log('live Created');
      liveSdk.serverUrl = CONFIG.liveServer;
      // liveSdk.updateLiveList('', 0, this.pageNum, this.getTopLiveList.bind(this));
    },
    mounted() {
      console.log('live mounted');

      // this.loadTop();
    },

    activated: function () {
      this.$store.commit('UPDATE_BOTTOM', 1);
      if (window.sessionStorage.scrollTop !== undefined) {
        console.log(window.sessionStorage.scrollTop);
        document.body.scrollTop = window.sessionStorage.scrollTop;
      }

      // this.$nextTick(() => $(window).scrollTop(window.window.sessionStorage.scrollTop));
    },

    beforeRouteLeave(to, from, next) {
      console.log(to.name);
      // 如果跳转到详情页面，则记录关键数据
      // 方便从详情页面返回到该页面的时候继续加载之前位置的数据
      if (to.name === 'videoDetail') {
        // 当前滚动条位置
        /* window.window.sessionStorage.scrollTop = $(window).scrollTop(); */
        console.log(window);
        console.log(window.sessionStorage);
        window.sessionStorage.scrollTop = document.body.scrollTop;
        console.log(window.sessionStorage.scrollTop);
        // 当前页面主题数据
        // window.window.sessionStorage.topics = JSON.stringify(this.topics);
        // 查询参数
        // window.window.sessionStorage.searchKey = JSON.stringify(this.searchKey);
        // 当前tab
        // window.window.sessionStorage.tab = from.query.tab || 'all';
      } else {
        this.$destroy();
      }
      // $(window).off('scroll');
      next();
    },
    beforeRouteEnter(to, from, next) {
      if (from.name !== 'videoDetail') {
        // 页面切换移除之前记录的数据集
        if (window.sessionStorage.scrollTop) {
          console.log(window);
          console.log(window.sessionStorage);
        }
      }
      next();
    },

    methods: {
      getTopLiveList(videos) {
        let newList = [];
        console.log('getNextLiveList');
        if (videos === undefined) {
          this.noMore = true;
          return;
        }
        this.noMore = false;
        this.leftData.splice(0, this.leftData.length);
        this.rightData.splice(0, this.rightData.length);

        for (var e of videos) {
          let tmp = {};

          tmp.videoId = e.LiveId;
          tmp.img = e.SnapUrl;
          tmp.title = e.LiveName;
          tmp.author = e.UserName;
          tmp.videoUrl = e.PlayUrl;
          // tmp.voteCount = e.VoteCounts;
          tmp.orientation = e.ScreenOrientation;
          tmp.userId = e.UserId;
          newList.push(tmp);

          console.log(tmp);
        }

        let left = newList.filter((data, i) => {
          return i % 2 === 1;
        });
        let right = newList.filter((data, i) => {
          return i % 2 !== 1;
        });
        this.leftData = this.leftData.concat(left);
        this.rightData = this.rightData.concat(right);
      },

      getNextLiveList(videos) {
        let newList = [];
        console.log('getNextLiveList');
        if (videos === undefined) {
          this.noMore = true;
          return;
        }
        this.noMore = false;
        for (var e of videos) {
          let tmp = {};

          tmp.videoId = e.LiveId;
          tmp.img = e.SnapUrl;
          tmp.title = e.LiveName;
          tmp.author = e.UserName;
          tmp.videoUrl = e.PlayUrl;
         // tmp.voteCount = e.VoteCounts;
          tmp.orientation = e.ScreenOrientation;
          tmp.userId = e.UserId;

          newList.push(tmp);

          console.log(tmp);
        }

        let left = newList.filter((data, i) => {
          return i % 2 === 1;
        });
        let right = newList.filter((data, i) => {
          return i % 2 !== 1;
        });
        this.leftData = this.leftData.concat(left);
        this.rightData = this.rightData.concat(right);
      },

      loadTop(done) {
        console.log('loadTop');
        setTimeout(() => {
          this.busy = true;
          // this.$store.commit('UPDATE_LOADING', true);
          console.log('loadTop ' + this.leftData.length + this.rightData.length);
          liveSdk.updateLiveList('', 0, this.pageNum, this.getTopLiveList.bind(this));
          this.busy = false;
          /* if (this.noMore) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          } */
          done();
        }, 1000);
      },
      loadMore(done) {
        console.log('loadMore');
        setTimeout(() => {
          this.busy = true;
          // this.$store.commit('UPDATE_LOADING', true);
          console.log('loadMore ' + this.leftData.length + this.rightData.length);
          liveSdk.updateLiveList('', this.leftData.length + this.rightData.length, this.pageNum, this.getNextLiveList.bind(this));
          this.busy = false;
          /* if (this.noMore) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          } */
          done();
        }, 1000);
      },
      onSwipeLeft() {
        console.log('onSwipeLeft');
        this.$router.push({
          name: 'video'
        });
        // this.$store.commit('UPDATE_BOTTOM', 2);
      },
      onSwipeRight() {
        console.log('onSwipeRight');
        this.$router.push({
          name: 'hot'
        });
        // this.$store.commit('UPDATE_BOTTOM', 0);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "livePage.styl";
</style>
