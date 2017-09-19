<template>
  <div class="videoDetailPage" ref="videoDetailPage">
    <div class="videoDetailWrap" ref="videoDetailWrap"  v-bind:style="heightComputed">
      <div class="videoDetailTop">
        <img class='videoDetailBack' src="../../assets/icon_back.png" alt="loading" v-on:click="onBackClick($event)">
        <div class="videoDetailVoteDesc">
          <span class="videoDetailVoteNum" v-text="voteCount"></span>
          <img class="videoDetailVotePic" src="../../assets/icon_like.png">
        </div>
      </div>
      <img
        v-show="!playing && !loading"
        class="videoDetailPlayCtrl"
        ref="videoDetailPlayCtrl"
        src="../../assets/icon_shortvideo_pressed.png"
        v-on:click="onPlayCtrlClick($event)">
      <img
        v-show="loading"
        class="videoDetailLoadingShow"
        ref="videoDetailLoadingShow"
        src="../../assets/loading.png">
      <video class="videoDetailVideo" ref="videoDetailVideo" v-on:click="onClick($event)"
             v-on:play="onPlay($event)"
             v-on:playing="onPlaying($event)"
             v-on:pause="onPause($event)"
             v-on:ended="onEnded($event)"
             v-on:error="onError($event)"
             v-on:progress="onProgress($event)"
             v-on:loadeddata="onLoadedData($event)"
             v-on:loadstart="onLoadStart($event)"
             v-on:loadedmetadata="onLoadedMetaData($event)"
             autoplay
             preload="auto"
             webkit-playsinline
             playsinline
             x-webkit-playsinline="true"
             x-webkit-airplay="allow"
             x5-video-player-type="h5"
             x5-video-player-fullscreen="true"
             x5-webkit-displaying-fullscreen="true"
             v-on:webkitfullscreenchange="onFullScreenChange($event)"
             v-bind:style="fitComputed"
             :poster="data.img"
             loop="loop">
        <source :src="data.videoUrl"/>
      </video>
      <div class="videoDetailBottom">
        <div class="videoDetailBottomCtrls">
          <img class="videoDetailScreenCtrl" :src="screenSrcCompute"  v-on:click="onScreenCtrlClick($event)">
          <!-- <vue-progress-bar color="#73ccec"  location="left" transition="width 0.1s, opacity 0.6s" class="videoDetailBottomLoadingBar"></vue-progress-bar> -->
          <img v-if="fullScreen" class="videoDetailShare" src="../../assets/icon_share.png">
          <img v-if="fullScreen" class="videoDetailMessage" src="../../assets/icon_message.png" v-on:click="onMessageClick($event)">
          <img v-if="fullScreen" class="videoDetailVote" :src="voteSrcComputed" v-on:click="onVoteClick($event)">
          <img v-if="fullScreen" class="videoDetailBarageCtrl" :src="barrageCtrlCompute" v-on:click="onBarageCtrlClick($event)">
        </div>
        <div class="videoDetailBottomProgress">
          <span class="videoDetailBottomLoadingCurrTime" v-text="currTime">0</span>
          <div class="videoDetailBottomLoadingBarWrap">
            <LoadingBar
              id="loading-bar-id"
              custom-class="videoDetailBottomLoadingBar"
              :on-error-done="loadingBarErrorDone"
              :on-progress-done="loadingBarProgressDone"
              :progress="loadingBarProgressCompute"
              direction="right"
              :error="loadingBarError" >
            </LoadingBar>
          </div>
          <span class="videoDetailBottomLoadingTotalTime" v-text="totalTime">100</span>
        </div>
      </div>
      <div v-if='fullScreen' class="videoDetailMsgCtrl" v-show="needMsg">
        <img class="videoDetailMsgCtrlBarrage" ref="videoDetailMsgCtrlBarrage" :src="barrageCtrlCompute"  v-on:click="onBarageCtrlClick($event)">
        <input class="videoDetailMsgCtrlInput" ref="videoDetailMsgCtrlInput" placeholder="和大家说点儿什么" v-model="msgText">
        <button class="videoDetailMsgCtrlSend" v-on:click="onMsgSendClick($event)">发送</button>
      </div>
    </div>
    <div v-if='!fullScreen' class="videoDetailMiddle">
      <div class="videoDetailMiddleDesc">
        <img class="videoDetailMiddleDescPhoto" src="../../assets/photo_default.png">
        <span class="videoDetailMiddleDescTitle" v-text="data.title">title</span>
        <span class= "videoDetailMiddleDescAuthor" v-text="data.author">cmd10</span>
        <div class="videoDetailMiddleDescVoteDesc">
          <span class="videoDetailMiddleDescVoteDescVoteNum" v-text="voteCount"></span>
          <img class="videoDetailMiddleDescVoteDescVotePic" src="../../assets/icon_like.png">
        </div>
        <button class="videoDetailMiddleDescollow">关注</button>
      </div>
      <v-navbar class="videoDetailMiddleDescNavBar" :items="navItems">
      </v-navbar>
    </div>
    <div v-if='!fullScreen' class="videoDetailVideoDesc">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
  // Similarly, you can also introduce the plugin resource pack you want to use within the component
  // require('some-videojs-plugin')
  import {browserTypeCheck} from '../../common/js/browserCheck.js';
  import videoSdk from '../lazyloadImg/video_sdk.js';
  import commentSdk from '../lazyloadImg/comment_sdk';
  import VNavbar from '../navBar/navBar.vue';
  import LoadingBar from 'vue2-loading-bar';
  import { CONFIG } from '../../common/js/config';

  export default {
    name: 'v-videoDetail',
    props: {

    },
    data() {
      return {
        fullScreen: false,
        data: this.$route.params.data,
        voteCount: 0,
        navItems: [{routeName: 'videoDetailMessage', title: '评论', params: {data: this.$route.params.data}}, {routeName: 'videoDetailRecommand', title: '推荐', params: {data: this.$route.params.data}}],
        needMsg: false,
        msgText: '',
        browserType: '',
        barrageEnable: true,
        hasVoted: false,
        loading: false,
        playing: false,
        loadingBarError: false,
        interTimeVal: -1,
        interCommentVal: -1,
        currTime: 0,
        totalTime: 0,
        commentCountPerSecond: 0,
        currCommentCount: 0
      };
    },
    components: {
      VNavbar,
      LoadingBar
    },
    created() {
      console.log('data: ' + this.data);
      // console.log('voteCount: ' + this.data.voteCount);
    },
    mounted() {
      // this.$refs.input.focus();
      console.log(this.data);
      this.browserType = browserTypeCheck();
      console.log(this.browserType.mobile);
      console.log(this.browserType.weixin);
      videoSdk.serverUrl = CONFIG.videoServer;
      commentSdk.serverUrl = CONFIG.commentServer;
      this.fullScreen = this.browserType.weixin ? true : this.data.orientation !== 'LANDSCAPE';
      this.voteCount = this.data.voteCount;
      this.send = this.$start(document.querySelector('.videoDetailWrap'), [0.15, 0.85]);
      this.$router.replace({
        name: 'videoDetailMessage',
        params: {
          data: this.data
        }
      });
      if (this.browserType.weixin) {
        this.$refs.videoDetailVideo.play();
      }
    },
    computed: {
      heightComputed: function() {
        return {
          'height': this.fullScreen ? '100%' : '41%'
        };
      },
      fitComputed: function () {
        return {
           'object-fit': this.browserType.mobile ? this.fullScreen ? this.data.orientation === 'LANDSCAPE' ? 'contain' : 'fill' : this.data.orientation === 'LANDSCAPE' ? 'fill' : 'contain' : this.fullScreen ? 'contain' : 'fill'
        };
      },
      barrageCtrlCompute: function () {
        return this.barrageEnable ? require('../../assets/popup-2.png') : require('../../assets/popup-1.png');
      },
      screenSrcCompute: function () {
        return this.fullScreen ? require('../../assets/icon_screen.png') : require('../../assets/icon-full-screen-.png');
      },
      voteSrcComputed: function () {
        return this.hasVoted ? require('../../assets/like_prissed1.png') : require('../../assets/like_prissed2.png');
      },
      loadingBarProgressCompute: function () {
        return this.currTime / this.totalTime * 100;
      },
      stateImgUrlCompute: function() {
        return this.loading ? require('../../assets/loading.png') : require('../../assets/icon_shortvideo_pressed.png');
      }
    },
    methods: {
      onClick(event) {
        if (this.needMsg) {
          this.needMsg = false;
          return false;
        }
        this.needMsg = false;
        if (this.isPlaying === false) {
          // this.$refs.videoWrap.style.width = '100%';
          // this.$refs.videoWrap.style.height = '100%';
          this.$refs.videoDetailVideo.play();
          this.isPlaying = true;
          // this.send({text: 'nihao', color: 'white', speed: 1, classname: 'style3'});
        } else {
          // this.$refs.videoWrap.style.width = '100%';
          // this.$refs.videoWrap.style.height = '35%';
          this.$refs.videoDetailVideo.pause();
          this.isPlaying = false;
        }
      },

      onBtnClick(event) {
        console.log('send');
        console.log(this.input_text);
        // this.send({text: this.input_text});
        this.send({text: this.input_text, color: 'white', classname: 'style3'});
        this.input_text = '';
        // this.$refs.input.focus();
      },

      onBarageCtrlClick(event) {
        console.log('onBarageCtrlClick');
        this.barrageEnable = !this.barrageEnable;
        console.log(this.barrageEnable);
        if (this.fullScreen && this.barrageEnable) {
          this.barrageProgressEnable();
        } else {
          this.barrageProgressDisable();
        }
        /* if (this.fullScreen && this.barrageEnable) {
          commentSdk.getCommentCount(this.data.videoId, this.getCommentCountCallback);
          // commentSdk.downloadComment(this.data.videoId, 0, 10, this.onCommentDownloadCallback);
        } */
      },

      onScreenCtrlClick(event) {
        this.fullScreen = !this.fullScreen;
        if (this.fullScreen) {
          console.log('Request fullscreen');
          // this.screen.orientation.lock('portrait-primary');
        }
        if (this.fullScreen && this.barrageEnable) {
          this.barrageProgressEnable();
        } else {
          this.barrageProgressDisable();
        }
        /* if (this.fullScreen && this.barrageEnable && this.playing) {
          commentSdk.getCommentCount(this.data.videoId, this.getCommentCountCallback);
        } */
      },

      onMessageClick(event) {
        console.log('onMessageClick');
        this.needMsg = true;
        this.$refs.msgInput.focus();
      },

      onMsgSendCallback(data) {
        console.log('onMsgSendCallback');
        console.log('data');
        if (this.fullScreen && this.barrageEnable) {
          this.send({text: this.msgText, color: 'white', speed: 1, classname: 'style2'});
        }
        this.msgText = '';
        this.$refs.videoDetailMsgCtrlInput.focus();
      },

      onMsgSendClick(event) {
        console.log('send');
        // this.send({text: this.input_text});
        commentSdk.uploadVideoComment(this.voteCount, this.voteCount, new Date(), this.data.videoId, null, null, this.msgText, this.onMsgSendCallback);
      },
      onVoteCallBack(result) {
        console.log('onVoteCallBack: ' + result);
        if (result === 0) {
          this.voteCount = this.voteCount + 1;
          this.hasVoted = true;
        }
      },

      onUnVoteCallBack(result) {
        console.log('onUnVoteCallBack: ' + result);
        if (result === 0) {
          this.voteCount = this.voteCount - 1;
          this.hasVoted = false;
        }
      },

      onVoteClick(event) {
        console.log('onVoteClick');
        // this.send({text: this.input_text});
        if (this.hasVoted) {
          videoSdk.unvoteVideo(this.voteCount - 1, this.data.videoId, this.onUnVoteCallBack);
        } else {
          videoSdk.voteVideo(this.voteCount, this.data.videoId, this.onVoteCallBack);
        }
      },

      onCommentDownloadCallback(data) {
        /* var count = 0;
        var totalTime = this.totalTime - this.currTime;
        console.log('totalTime: ' + totalTime);
        var time = totalTime * 1000 / data.CommentInfo.length;
         console.log('time: ' + time);
        for (var comment of data.CommentInfo) {
          // console.log('1111: ' + comment.Comment);
          setTimeout(this.sendBarrage, time * count, comment.Comment);
          count++;
        } */
      //  console.log(data);
        for (var comment of data.CommentInfo) {
          // console.log('1111: ' + comment.Comment);
          this.sendBarrage(comment.Comment);
        }
      },
      sendBarrage(textStr) {
        this.send({text: textStr, color: 'white', speed: 3, classname: 'style3'});
      },

      getCommentCountCallback(data) {
       // console.log(data);
       // console.log(this.totalTime);
        var totalTime = this.totalTime - this.currTime;
        var commentTimeInterVal = Math.ceil(totalTime / data.CommentCnt);
       // console.log(totalTime);
       // console.log(commentTimeInterVal);
        this.commentCountPerSecond = Math.round(data.CommentCnt * commentTimeInterVal / totalTime);
        if (this.commentCountPerSecond > 5) {
          this.commentCountPerSecond = 5;
        }

        if (isNaN(this.commentCountPerSecond)) {
          this.commentCountPerSecond = 0;
        }
        console.log(this.commentCountPerSecond);
        if (this.commentCountPerSecond !== 0) {
          this.interCommentVal = setInterval(this.interCommentProcess, 1000);
        }
        /* var count = data.CommentCnt;
        var i = 0;
        count = Math.ceil(count / 1000);
        console.log(count);
        while (i < count) {
          commentSdk.downloadComment(this.data.videoId, i * 1000, 1000, this.onCommentDownloadCallback);
          i = i + 1;
        } */
      },
      onBackClick(event) {
        console.log(this.$router);
        this.$router.back();
      },
      getCurrPlayTime() {
       this.currTime = Math.round(this.$refs.videoDetailVideo.currentTime);
      },
      interTimeProcess() {
        this.getCurrPlayTime();
      },
      interCommentProcess() {
        if (this.fullScreen && this.barrageEnable && this.commentCountPerSecond !== 0) {
           // console.log(this.currTime);
           // console.log(this.commentCountPerSecond);
          commentSdk.downloadComment(this.data.videoId, this.currCommentCount * this.commentCountPerSecond, this.commentCountPerSecond, this.onCommentDownloadCallback);
          this.currCommentCount++;
        }
      },
      onPlay() {
        console.log('onPlay');
        this.timeProgressDisable();
        this.timeProgressEnable();
        this.playing = true;
        this.loading = false;
      },
      onPlaying(event) {
        console.log('onPlaying');
        this.barrageProgressDisable();
        if (this.fullScreen && this.barrageEnable) {
          this.barrageProgressEnable();
        }
        this.playing = true;
        this.loading = false;

      //  console.log(this.playing);
      },
      onPause(event) {
        console.log('onPause');
        this.playing = false;
        this.loading = false;
        this.timeProgressDisable();
        this.barrageProgressDisable();
      },
      onEnded(event) {
        console.log('onEnded');
        this.playing = false;
        this.loading = false;
        this.timeProgressDisable();
        this.barrageProgressDisable();
      },
      onError(event) {
        console.log('onError');
        this.playing = false;
        this.loading = false;
        this.timeProgressDisable();
        this.barrageProgressDisable();
      },
      onProgress(event) {

      },

      onLoadStart(event) {
        console.log(event);
        this.loading = true;
      },

      onLoadedData(event) {
        console.log(event);
        this.loading = false;
        this.$refs.videoDetailVideo.play();
      },
      onLoadedMetaData(event) {
        this.totalTime = Math.round(event.target.duration);
      },

      onPlayCtrlClick(event) {
        console.log('onPlayCtrlClick');
        this.$refs.videoDetailVideo.play();
      },

      // Callback
      loadingBarErrorDone() {
        this.error = false;
      },
      loadingBarProgressDone() {
        this.progress = 0;
      },
      timeProgressEnable() {
        this.interTimeVal = setInterval(this.interTimeProcess, 1000);
      },
      timeProgressDisable() {
        if (this.interTimeVal !== -1) {
          clearInterval(this.interTimeVal);
          this.interTimeVal = -1;
        }
      },
      barrageProgressEnable() {
        this.currCommentCount = 0;
       // this.totalTime = Math.round(this.$refs.videoDetailVideo.duration);
        this.currTime = Math.round(this.$refs.videoDetailVideo.currentTime);
        commentSdk.getCommentCount(this.data.videoId, this.getCommentCountCallback);
      },
      barrageProgressDisable() {
        if (this.interCommentVal !== -1) {
          clearInterval(this.interCommentVal);
          this.currCommentCount = 0;
          this.interCommentVal = -1;
        }
      }

      /* onEnableBarrage() {
        setTimeout(() => {
          commentSdk.getCommentCount(this.data.videoId, this.getCommentCountCallback);
        }, 1000);
      } */
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "videoDetail.styl"
</style>
