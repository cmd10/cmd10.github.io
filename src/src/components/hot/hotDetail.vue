<template>
  <div class="page">
    <div class="hotWrap" ref="hotWrap" v-bind:style="heightComputed">
      <div class="hotTop">
        <router-link to="/video">
          <img class='back' src="../../assets/icon_back.png" alt="loading">
        </router-link>
        <div class="voteDesc">
          <span class="voteNum" v-text="voteCount"></span>
          <img class="vote" src="../../assets/icon_like.png">
        </div>
      </div>
      <video class="video" ref="video" v-on:click="onClick($event)"
             preload="auto"
             webkit-playsinline
             playsinline
             x-webkit-playsinline="true"
             x-webkit-airplay="allow"
             x5-video-player-type="h5"
             x5-video-player-fullscreen="true"
             x5-webkit-displaying-fullscreen="true"
             :poster="data.img"
             loop="loop">
        <source :src="data.videoUrl"/>
      </video>
      <div class="hotBottom">
        <img class="screenCtrl" :src="screenSrcCompute"  v-on:click="onScreenCtrlClick($event)">
        <img v-if="fullScreen" class="share" src="../../assets/icon_share.png">
        <img v-if="fullScreen" class="message" src="../../assets/icon_message.png" v-on:click="onMessageClick($event)">
        <img v-if="fullScreen" class="vote" :src="voteSrcComputed" v-on:click="onVoteClick($event)">
        <img v-if="fullScreen" class="barageCtrl" :src="barrageCtrlCompute" v-on:click="onBarageCtrlClick($event)">
      </div>
      <div v-if='fullScreen' class="msg" v-show="needMsg">
        <input class="msgInput" ref="msgInput" v-model="msgText">
        <button class="msgSend" v-on:click="onMsgSendClick($event)">发送</button>
      </div>
    </div>
    <div v-if='!fullScreen' class="hotDesc">
      <div class="desc">
        <img class="photo" src="../../assets/photo_default.png">
        <span class="title" v-text="data.title">title</span>
        <span class= "author" v-text="data.author">cmd10</span>
        <div class="voteDesc">
          <span class="voteNum" v-text="voteCount"></span>
          <img class="vote" src="../../assets/icon_like.png">
        </div>
        <button class="follow">关注</button>
      </div>
      <v-navbar class="navBar" :items="navItems">
      </v-navbar>
      <router-view></router-view>
    </div>
    <!-- <div class="barrageWrap"></div> -->
    <!-- <button class="send" v-on:click="onBtnClick($event)">发送</button>
    <input type="text" v-model="input_text" class='input' ref="input"> -->
  </div>
</template>

<script>
  // Similarly, you can also introduce the plugin resource pack you want to use within the component
  // require('some-videojs-plugin')
  import videoSdk from '../lazyloadImg/video_sdk.js';
  import commentSdk from '../lazyloadImg/comment_sdk';
  import VNavbar from '../navBar/navBar.vue';
  import { CONFIG } from '../../common/js/config';

  export default {
    name: 'v-hotDetail',
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
        isWeixin: false,
        barrageEnable: false,
        hasVoted: false
      };
    },
    components: {
      VNavbar
    },
    created() {
      console.log('data: ' + this.data);
      // console.log('voteCount: ' + this.data.voteCount);
    },
    mounted() {
      // this.$refs.input.focus();
      console.log(this.data);
      // this.navItems.push({routePath: '/videoDetail/message', title: '评论', params: this.data});
      // this.navItems.push({routeName: 'videoDetailMessage', title: '评论', params: {data: this.data}});
      // this.navItems.push({routeName: 'videoDetailRecommand', title: '推荐', params: {data: this.data}});
      videoSdk.serverUrl = CONFIG.videoServer;
      commentSdk.serverUrl = CONFIG.commentServer;
      this.fullScreen = this.data.orientation !== 'LANDSCAPE';
      this.voteCount = this.data.voteCount;
      this.send = this.$start(document.querySelector('.videoWrap'), [0.15, 0.85]);
      this.$router.replace({
        name: 'videoDetailMessage',
        params: {
          data: this.data
        }
      });
      this.$refs.video.play();
      if (this.fullScreen) {
        commentSdk.downloadComment(this.data.videoId, 0, 10, this.onCommentDownloadCallback);
      }
    },
    computed: {
      heightComputed: function() {
        return {
          'max-height': this.fullScreen ? '100%' : '41%'
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
          this.$refs.video.play();
          this.isPlaying = true;
          this.send({text: 'nihao', color: 'white', speed: 1, classname: 'style3'});
        } else {
          // this.$refs.videoWrap.style.width = '100%';
          // this.$refs.videoWrap.style.height = '35%';
          this.$refs.video.pause();
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
      },
      onScreenCtrlClick(event) {
        this.fullScreen = !this.fullScreen;
        if (this.fullScreen) {
          commentSdk.downloadComment(this.data.videoId, 0, 10, this.onCommentDownloadCallback);
        }
      },
      onMessageClick(event) {
        console.log('onMessageClick');
        this.needMsg = true;
        this.$refs.msgInput.focus();
      },
      onMsgSendCallback(data) {
        console.log('onMsgSendCallback');
        console.log('data');
        this.send({text: this.msgText, color: 'white', speed: 1, classname: 'style3'});
        this.msgText = '';
        this.$refs.msgInput.focus();
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
        var i = 0;
        for (var comment of data.CommentInfo) {
          this.send({text: comment.Comment, color: 'black', speed: 2, classname: 'style' + i});
          i++;
          if (i > 3) {
            i = 0;
          }
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "hotDetail.styl"
</style>
