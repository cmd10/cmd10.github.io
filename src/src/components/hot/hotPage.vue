<template>
  <div class="hotPage">
    <v-touch class="hotPageWrapper" v-on:swipeleft="onSwipeLeft" v-bind:swipe-options="{ direction: 'left', threshold: 100 }">
      <div class="hotPageWrapperCenter">
        <div v-show="leftData.length > 0" v-for="data in leftData">
          <v-live class="hotWrap" ref="hotWrap" :data="data"></v-live>
        </div>
      </div>
      <div class="hotPageWrapperCenter">
        <div v-show="rightData.length > 0" v-for="data in rightData">
          <v-live class="hotWrap" ref="hotWrap" :data="data"></v-live>
        </div>
      </div>
    </v-touch>
    <infinite-loading :on-infinite="loadMore" ref="infiniteLoading"  spinner="bubbles">
       <span slot="no-more">
        There is no more video :(
       </span>
      <span slot="no-more">
        Load failed :(
       </span>
    </infinite-loading>
  </div>
</template>

<script>
  import vLive from './hot.vue';
  import hotSdk from './hot_sdk.js';
  import InfiniteLoading from 'vue-infinite-loading';
  import { CONFIG } from '../../common/js/config';

  export default {
    data() {
      return {
        leftData: [],
        rightData: [],
        busy: false,
        pageNum: 12,
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
      hotSdk.serverUrl = CONFIG.hotServer;
      // hotSdk.getHotList('', 0, this.pageNum, this.getTopHotList.bind(this));
    },
    mounted() {

    },
    activated: function () {
      this.$store.commit('UPDATE_BOTTOM', 0);
      // this.$nextTick(() => $(window).scrollTop(window.window.sessionStorage.scrollTop));
    },
    methods: {
      getTopHotList(videos) {
        if (videos === undefined) {
          this.noMore = true;
          return;
        }
        this.noMore = false;
        this.leftData.splice(0, this.leftData.length);
        this.rightData.splice(0, this.rightData.length);
        let newList = [];
        console.log('getTopHotList');
        for (var e of videos) {
          let tmp = {};
          tmp.type = e.Type;
          console.log('hot item type: ', tmp.type);
          if (e.Type === 'live') {
            tmp.videoId = e.LiveInfo.LiveId;
            tmp.img = e.LiveInfo.SnapUrl;
            tmp.title = e.LiveInfo.LiveName;
            tmp.author = e.LiveInfo.UserName;
            tmp.videoUrl = e.LiveInfo.PlayUrl;
            tmp.voteCount = e.LiveInfo.WatcherNum;
            tmp.orientation = e.LiveInfo.ScreenOrientation;
            tmp.userId = e.LiveInfo.UserId;
          } else if (e.Type === 'video') {
            tmp.videoId = e.VideoInfo.VideoId;
            tmp.img = e.VideoInfo.SnapUrl;
            tmp.title = e.VideoInfo.VideoDesc;
            tmp.author = e.VideoInfo.UserName;
            tmp.videoUrl = e.VideoInfo.VideoUrl;
            tmp.voteCount = e.VideoInfo.VoteCounts;
            tmp.orientation = e.VideoInfo.ScreenOrientation;
            tmp.userId = e.VideoInfo.UserId;
          }
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

      getNextHotList(videos) {
        if (videos === undefined) {
          this.noMore = true;
          return;
        }
        this.noMore = false;
        let newList = [];
        console.log('getNextHotList');
        for (var e of videos) {
          let tmp = {};
          tmp.type = e.Type;
          console.log('hot item type: ', tmp.type);
          if (e.Type === 'live') {
            tmp.videoId = e.LiveInfo.LiveId;
            tmp.img = e.LiveInfo.SnapUrl;
            tmp.title = e.LiveInfo.LiveName;
            tmp.author = e.LiveInfo.UserName;
            tmp.videoUrl = e.LiveInfo.PlayUrl;
            tmp.voteCount = e.LiveInfo.WatcherNum;
            tmp.orientation = e.LiveInfo.ScreenOrientation;
            tmp.userId = e.LiveInfo.UserId;
          } else if (e.Type === 'video') {
            tmp.videoId = e.VideoInfo.VideoId;
            tmp.img = e.VideoInfo.SnapUrl;
            tmp.title = e.VideoInfo.VideoDesc;
            tmp.author = e.VideoInfo.UserName;
            tmp.videoUrl = e.VideoInfo.VideoUrl;
            tmp.voteCount = e.VideoInfo.VoteCounts;
            tmp.orientation = e.VideoInfo.ScreenOrientation;
            tmp.userId = e.VideoInfo.UserId;
          }
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

      loadTop() {
        console.log('loadTop');
        setTimeout(() => {
          this.busy = true;
          // this.$store.commit('UPDATE_LOADING', true);
          console.log('loadTop ' + this.leftData.length + this.rightData.length);
          hotSdk.getHotList('', 0, this.pageNum, this.getTopHotList.bind(this));
          this.busy = false;
          if (this.noMore) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          }
        }, 500);
      },
      loadMore() {
        console.log('loadMore');
        setTimeout(() => {
          this.busy = true;
          // this.$store.commit('UPDATE_LOADING', true);
          console.log('loadMore ' + this.leftData.length + this.rightData.length);
          hotSdk.getHotList('', this.leftData.length + this.rightData.length, this.pageNum, this.getNextHotList.bind(this));
          this.busy = false;
          if (this.noMore) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          }
        }, 500);
      },
      onSwipeLeft() {
        console.log('onSwipeLeft');
        this.$router.push({
          name: 'live'
        });
        // this.$store.commit('UPDATE_BOTTOM', 1);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "hotPage.styl";
</style>
