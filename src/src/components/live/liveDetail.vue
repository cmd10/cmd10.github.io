<template>
  <div class="liveDetailpage">
    <div class="liveDetailWrap" ref="liveDetailWrap"
         v-bind:style="heightComputed">
      <div class="liveDetailWrapMsgList">
        <div class="liveDetailWrapMsgItem" v-for='msgItem in msgList'>
          <span class="liveDetailWrapMsgItemNick" v-text="msgItem.user + ': '" ></span>
          <span class="liveDetailWrapMsgItemMsg" v-text="msgItem.msg.content"></span>
        </div>
      </div>
      <div v-if='fullScreen' class="liveDetailTop">
        <div class="liveDetailFullDesc">
          <img class="liveDetailFullPhoto" src="../../assets/photo_default.png">
          <span class="liveDetailFullId" v-text="data.videoId">id</span>
          <span class= "liveDetailFullAuthor" v-text="data.author">cmd10</span>
          <button class="liveDetailFullFollow">关注</button>
        </div>
      </div>
      <div v-else class="liveDetailBack">
        <img src="../../assets/icon_back.png" v-on:click="onBackClick($event)">
      </div>
      <img
        v-show="!playing && !loading"
        class="liveDetailPlayCtrl"
        ref="liveDetailPlayCtrl"
        src="../../assets/icon_shortvideo_pressed.png"
        v-on:click="onPlayCtrlClick($event)">
      <img
        v-show="loading"
        class="liveDetailLoadingShow"
        ref="liveDetailLoadingShow"
        src="../../assets/loading.png">
      <video class="liveDetailVideo" ref="liveDetailVideo"
             preload="auto"
             autoplay
             webkit-playsinline
             playsinline
             x-webkit-playsinline="true"
             x-webkit-airplay="allow"
             x5-video-player-type="h5"
             x5-video-player-fullscreen="true"
             x5-webkit-displaying-fullscreen="true"
             v-bind:style="fitComputed"
             :poster="data.img"
              v-on:click="onVideoClick($event)"
             v-on:play="onPlay($event)"
             v-on:playing="onPlaying($event)"
             v-on:pause="onPause($event)"
             v-on:ended="onEnded($event)"
             v-on:error="onError($event)"
             v-on:progress="onProgress($event)"
             v-on:loadeddata="onLoadedData($event)"
             v-on:loadstart="onLoadStart($event)"
             v-on:readystatechange="onReadyStateChange($event)"
             v-on:waiting="onWaiting($event)">
        <source :src="videoUrlComputed" type="application/x-mpegURL"/>
        <!--<source :src="data.videoUrl"/> -->
      </video>
      <div v-if='fullScreen' class="liveDetailBottom">
        <img class="liveDetailBottomScreen" src="../../assets/icon_screen.png" v-on:click="onScreenClick($event)">
        <img class="liveDetailBottomClose" src="../../assets/icon_close.png"  v-on:click="onCloseClick($event)">
        <img class="liveDetailBottomWelfare" src="../../assets/icon_send_gift.png">
        <img class="liveDetailBottomShare" src="../../assets/icon_share.png">
        <img class="liveDetailBottomMessage" src="../../assets/icon_message.png" v-on:click="onMessageClick($event)">
        <img class="liveDetailBottomMail" src="../../assets/icon-send_email.png">
      </div>
      <div v-else class="liveDetailControls">
        <div class="liveDetailCus">
          <img class="liveDetailCusPic" src="../../assets/icon_eyes.png">
          <span class="liveDetailCusNum" v-text="data.voteCount">0</span>
        </div>
        <img class="liveDetailFullScreenCtrl" src="../../assets/icon-full-screen-.png" v-on:click="onClick($event)">
      </div>
      <div v-if='fullScreen' class="liveDetailMsgCtrl" v-show="needMsg" v-on:blur="onMsgBlur($event)" >
        <img class="liveDetailMsgCtrlBarrage" ref="liveDetailMsgCtrlBarrage" :src="barrageCtrlCompute"  v-on:click="onBarageCtrlClick($event)">
        <input class="liveDetailMsgCtrlInput" ref="liveMsgInput" placeholder="和大家说点儿什么" v-model="msgText">
        <button class="liveDetailMsgCtrlSend" v-on:click="onMsgSendClick($event)">发送</button>
      </div>
    </div>
    <div v-if='!fullScreen' class="liveDetailDesc">
      <div class="liveDesc">
        <img class="liveDescPhoto" src="../../assets/photo_default.png">
        <span class="liveDescTitle" v-text="data.title">title</span>
        <span class= "liveDescAuthor" v-text="data.author">cmd10</span>
        <button class="liveDescFollow">关注</button>
      </div>
      <v-navbar class="liveDescNavBar" :items="navItems">
      </v-navbar>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  // Similarly, you can also introduce the plugin resource pack you want to use within the component
  // require('some-videojs-plugin')
  import {browserTypeCheck} from '../../common/js/browserCheck.js';
  // import VPlayer from '../player/player.vue';
  import VNavbar from '../navBar/navBar.vue';
  import { CONFIG } from '../../common/js/config';
  import imSdk from './im_sdk';

  export default {
    name: 'v-liveDetail',
    props: {
    },
    data() {
      return {
        fullScreen: false,
        data: this.$route.params.data,
        navItems: [{routeName: 'liveDetailMessage', title: '聊天'}, {routeName: 'liveDetailRecommend', title: '推荐'}, {routeName: 'liveDetailRank', title: '排行榜'}],
        needMsg: false,
        msgText: '',
        browserType: '',
        playing: false,
        loading: false,
        barrageEnable: true,
        msgList: []
      };
    },
    components: {
      VNavbar
      // VPlayer
    },
    created() {
      console.log('data: ' + this.data);
      // console.log('voteCount: ' + this.data.voteCount);
    },
    destroyed() {
      imSdk.exitRoom(this.data.videoId);
      imSdk.disconnect();
    },

    mounted() {
      // this.$refs.input.focus();
      console.log(this.data);
      imSdk.serverUrl = 'http://172.16.6.243:7070/http-bind/';
      imSdk.onLoginSuccess = this.onBarrageConnectSuccess;
      imSdk.onLoginFailed = this.onBarrageConnectFailed;
      imSdk.onReceivedPrivateMessage = this.onRcvPrivateMsg;
      imSdk.onReceivedRoomMessage = this.onRcvRoomMsg;
      imSdk.onDisConnected = this.onBarrageDisConnected;
      this.fullScreen = this.isWeixin ? true : this.data.orientation !== 'LANDSCAPE';
      this.send = this.$start(document.querySelector('.liveDetailWrap'), [0.15, 0.85]);
      // this.$refs.liveDetailVideo.play();
      this.browserType = browserTypeCheck();
      if (this.browserType.weixin) {
        this.$refs.liveDetailVideo.webkitRequestFullScreen();
      }
      imSdk.connect('owen1', '198602004', '218.93.250.18', 'conference.218.93.250.18');
      // imSdk.connect(null, null, '218.93.250.18', 'conference.218.93.250.18');
      this.$router.replace({
        name: 'liveDetailMessage',
        params: {
          data: this.data,
          iMsgSdk: imSdk
        }
      });
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
      videoUrlComputed: function() {
        console.log(this.data.videoUrl.replace(CONFIG.videoPrefix, CONFIG.hlsVideoReplacePrefix).concat('.m3u8'));
        return this.data.videoUrl.replace(CONFIG.videoPrefix, CONFIG.hlsVideoReplacePrefix).concat('.m3u8');
      },
      barrageCtrlCompute: function () {
        return this.barrageEnable ? require('../../assets/popup-2.png') : require('../../assets/popup-1.png');
      }
    },

    methods: {
      onBarrageConnectSuccess() {
        console.log('onBarrageConnectSuccess');
        imSdk.joinRoom(this.data.videoId);
      },
      onBarrageConnectFailed(status) {
        console.log('onBarrageConnectFailed: ' + status);
      },
      onRcvPrivateMsg(sendUserName, message) {
        console.log('Rcv msg: ' + message + 'from:' + sendUserName);
      },
      onRcvRoomMsg(roomName, sendUserName, message) {
        console.log('Rcv msg: ' + message + 'from:' + sendUserName + 'in Room: ' + roomName);
        var msgData = JSON.parse(message.replace(/&quot;/g, '"'));
        console.log(msgData);
        this.msgList.push({
          user: sendUserName,
          msg: msgData
        });
        console.log(this.msgList.length);
        this.send({text: msgData.content, color: 'black', speed: 1, classname: 'style3'});
      },
      onBarrageDisConnected() {
        console.log('onBarrageDisConnected');
      },
      onClick(event) {
        console.log('on Full Screen Click');
        /* if (this.isPlaying === false) {
          // this.$refs.videoWrap.style.width = '100%';
          // this.$refs.videoWrap.style.height = '100%';
          this.$refs.video.play();
          this.isPlaying = true;
          this.send({text: '[耶]  nihao', color: 'white', classname: 'style3'});
        } else {
          // this.$refs.videoWrap.style.width = '100%';
          // this.$refs.videoWrap.style.height = '35%';
          this.$refs.video.pause();
          this.isPlaying = false;
        } */
        // this.$refs.liveWrap.style.maxHeight = '100%';
        // this.$refs.myvideo.style.objectFit = 'fill';
        this.fullScreen = true;
        imSdk.onReceivedPrivateMessage = this.onRcvPrivateMsg;
        imSdk.onReceivedRoomMessage = this.onRcvRoomMsg;
        imSdk.onDisConnected = this.onBarrageDisConnected;
        // this.$refs.myvideo.style.orientation = 'landscape';
      },
      onMsgSendClick(event) {
        console.log('send');
        // this.send({text: this.input_text});
        var date = new Date();
        var msg = {content: this.msgText, type: 0, time: date.getTime().toString()};
        console.log(JSON.stringify(msg));
        imSdk.sendRoomMessage(this.data.videoId, JSON.stringify(msg));
        this.msgText = '';
        this.$refs.liveDetailMsgCtrlInput.focus();
      },
      onMessageClick(event) {
        console.log('onMessageClick');
        this.needMsg = true;
        this.$refs.liveDetailMsgCtrlInput.focus();
      },

      onVideoClick(event) {
        console.log('onVideoClick');
        this.needMsg = false;
      },
      onScreenClick(event) {
        this.$refs.liveDetailWrap.style.height = '40%';
        // this.$refs.myvideo.style.objectFit = 'fill';
        this.fullScreen = false;
      },
      onBackClick(event) {
        this.$router.go(-1);
      },
      onCloseClick(event) {
        this.$router.go(-1);
      },
      onPlay() {
        console.log('onPlay');
        this.playing = true;
        this.loading = false;
      },
      onPlaying(event) {
        console.log('onPlaying');
        this.playing = true;
        this.loading = false;
        //  console.log(this.playing);
      },
      onPause(event) {
        console.log('onPause');
        this.playing = false;
        this.loading = false;
      },
      onEnded(event) {
        console.log('onEnded');
        this.playing = false;
        this.loading = false;
      },
      onError(event) {
        console.log('onError');
        this.playing = false;
        this.loading = false;
        window.alert('视频无法加载');
      },
      onProgress(event) {
        console.log(event);
        this.loading = true;
      },

      onLoadStart(event) {
        console.log(event);
        this.loading = true;
      },

      onLoadedData(event) {
        console.log(event);
        this.loading = false;
        // this.$refs.liveDetailVideo.play();
      },
      onReadyStateChange(event) {
        console.log(event);
      },
      onPlayCtrlClick(event) {
        console.log('onPlayCtrlClick');
        this.$refs.liveDetailVideo.play();
      },
      onWaiting(event) {
        console.log(event);
        this.loading = true;
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
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "liveDetail.styl"
</style>
