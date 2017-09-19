<template>
  <!-- <div class="welfare-wrapper" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="0"> -->
  <!-- <div class="welfare-wrapper" v-scroll="loadMore" scroll-foot="0" scroll-top="0" scroll-up="loadTop"> -->
  <!-- <loadmore class="welfare-wrapper" :top-method="loadTop" :bottom-method="loadMore" :bottom-all-loaded="allLoaded"> -->
  <!-- <mugen-scroll class="welfare-wrapper" :handler="loadMore" :should-handle="!busy" :threshold="threshold"> -->
  <div class="videoPage">
    <scroller class="videoPageScorller"
              style="top: 44px"
              :on-refresh="loadTop"
              :on-infinite="loadMore">
      <v-touch class="videoPageWrapper" v-on:swipeleft="onSwipeLeft($event)"  v-on:swiperight="onSwipeRight($event)"  v-bind:swipe-options="{ direction: 'horizontal', threshold: 100 }">
        <div class="videoPageWrapperCenter">
            <div v-show="leftData.length > 0" v-for="data in leftData">
                <v-video class="videoWrap" ref="videoWrap" :data="data"></v-video>
            </div>
        </div>
        <div class="videoPageWrapperCenter">
            <div v-show="rightData.length > 0" v-for="data in rightData">
                <v-video class="videoWrap" ref="videoWrap" :data="data"></v-video>
            </div>
        </div>
        <!-- </mugen-scroll> -->
      </v-touch>
    </scroller>
    <!-- <infinite-loading :on-infinite="loadMore" ref="infiniteLoading"  spinner="bubbles">
      <span slot="no-more">
        There is no more video :(
       </span>
      <span slot="no-more">
        Load failed :(
       </span>
    </infinite-loading> -->
  </div>

</template>

<script>
  // import $ from 'webpack-zepto';
  import { CONFIG } from '../../common/js/config';
  import vVideo from '../lazyloadimg/video.vue';
  import videoSdk from '../lazyloadImg/video_sdk.js';
  // import MugenScroll from 'vue-mugen-scroll';
  import InfiniteLoading from 'vue-infinite-loading';

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
      vVideo,
      InfiniteLoading
      // MugenScroll
    },
    created() {
      videoSdk.serverUrl = CONFIG.videoServer;
      // videoSdk.updateVideoList('', 0, 6, this.getTopVideoList.bind(this));
    },
    mounted() {
      // this.loadTop();
      // 如果从详情返回并且之前存有对应的查询条件和参数
      // 则直接渲染之前的数据

      // 滚动加载
      // $(window).on('scroll', utils.throttle(this.getScrollData, 300, 1000));
    },
    activated: function () {
      this.$store.commit('UPDATE_BOTTOM', 2);
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
        console.log(window.window.sessionStorage.scrollTop);
        // 当前页面主题数据
        // window.window.sessionStorage.topics = JSON.stringify(this.topics);
        // 查询参数
        // window.window.sessionStorage.searchKey = JSON.stringify(this.searchKey);
        // 当前tab
        // window.window.sessionStorage.tab = from.query.tab || 'all';
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
      getTopVideoList(videos) {
        if (videos === undefined) {
          this.noMore = true;
          return;
        }
        this.noMore = false;
        let newList = [];
        this.leftData.splice(0, this.leftData.length);
        this.rightData.splice(0, this.rightData.length);
        console.log('getTopVideoList');
        for (var e of videos) {
          let tmp = {};

          tmp.videoId = e.VideoId;
          tmp.img = e.SnapUrl;
          tmp.title = e.VideoDesc;
          tmp.author = e.UserName;
          tmp.videoUrl = e.VideoUrl;
          tmp.voteCount = e.VoteCounts;
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

      getNextVideoList(videos) {
        if (videos === undefined) {
          this.noMore = true;
          return;
        }
        this.noMore = false;
        let newList = [];
        console.log('getNextVideoList');
        for (var e of videos) {
          let tmp = {};

          tmp.videoId = e.VideoId;
          tmp.img = e.SnapUrl;
          tmp.title = e.VideoDesc;
          tmp.author = e.UserName;
          tmp.videoUrl = e.VideoUrl;
          tmp.voteCount = e.VoteCounts;
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
        // this.$store.commit('UPDATE_LOADING', true);
        /* this.page = 4;
        this.$http.get(`https://gank.io/api/data/福利/10/${this.page}`).then((response) => {
          let left = response.body.results.filter((data, i) => {
            return (i + 1) % 2 === 1;
          });
          let right = response.body.results.filter((data, i) => {
            return (i + 1) % 2 !== 1;
          });
          this.leftData = this.leftData.concat(left);
          this.rightData = this.rightData.concat(right);
          this.busy = false;
        // $nextTick() 在dom 重新渲染完后执行
          this.$nextTick(() => {
            this.$store.commit('UPDATE_LOADING', false);
          });
        }); */
        setTimeout(() => {
          this.busy = true;
          // this.$store.commit('UPDATE_LOADING', true);
          videoSdk.updateVideoList('', 0, this.pageNum, this.getTopVideoList.bind(this));
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
        /* if ((this.leftData.length + this.rightData.length) === 0) {
          console.log('call loadMore when there is no item');
          return;
        } */
        setTimeout(() => {
          this.busy = true;
          // this.$store.commit('UPDATE_LOADING', true);
          console.log('loadMore ' + this.leftData.length + this.rightData.length);
          videoSdk.updateVideoList('', this.leftData.length + this.rightData.length, this.pageNum, this.getNextVideoList.bind(this));
          this.busy = false;
          /* if (this.noMore) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          } */
          done();
        }, 1000);
      },
      allLoaded() {
        console.log('allLoaded');
      },
      onSwipeLeft(event) {
        console.log('onSwipeLeft');
        this.$router.push({
          name: 'my'
        });
        // this.$store.commit('UPDATE_BOTTOM', 3);
      },
      onSwipeRight(event) {
        console.log('onSwipeRight');
        this.$router.push({
          name: 'live'
        });
        // this.$store.commit('UPDATE_BOTTOM', 1);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "welfare.styl";
</style>
