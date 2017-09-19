<template>
  <!--<video-player class="video"
    ref="videoPlayer"
    v-bind:options="playerOptions"
    title="you can listen some event if you need"
    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"

    @statechanged="playerStateChanged($event)"

    @ready="playerReadied">
  </video-player>-->
  <div class="live-item">
    <figure class="myfigure">
      <!-- <img
        class="play"
        ref="play"
        src="../../assets/icon_shortvideo_pressed.png"
        v-on:webkitfullscreenchange="onFullScreen(this)"
        v-on:touchstart="onTouchStart($event)"
        v-on:touchend="onTouchEnd($event)">
      <video
        v-if="isWeixin"
        ref="myvideo"
        class="myvideo"
        :src="data.videoUrl"
        :poster="data.img"
        preload="auto"
        webkit-playsinline
        playsinline
        x-webkit-playsinline="true"
        x-webkit-airplay="allow"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portraint"
        x5-webkit-displaying-fullscreen="true"
        v-on:click="onClick($event)"
        v-on:play="onPlay"
        v-on:pause="onPause">
      </video>
      <v-player v-else
                ref="myvideo"
                class="myvideo"
                :src="data.videoUrl"
                :poster="data.img"
                type="flv"
                :orientation="data.orientation"
                v-on:play="onPlay"
                v-on:pause="onPause">
      </v-player> -->
      <!-- <video ref="myvideo"
             class="myvideo"
             id="videoElement"
             v-on:click="onPlay(this)">
      </video> -->
      <v-mimg ref="myvideo"
              class="myvideo" :imgUrl="data.img" v-on:click.native="onClick($event)"
      v-bind:style="computeHeight"></v-mimg>
      <p class="living">直播中</p>
      <div class="desc">
        <img class="photo" :src="photoUrl">
        <span class="title" v-text="data.title"></span>
        <span class= "author" v-text="data.author"></span>
        <div class="customer">
          <span class="cusnum" v-text="data.voteCount"></span>
          <img class="cuspic" src="../../assets/icon_eyes.png">
        </div>
      </div>
    </figure>
  </div>
</template>

<script>
  // import flvjs from 'flv.js';
  import {isWeixin} from '../../common/js/browserCheck.js';
  import liveSdk from './live_sdk';
  import vMimg from '../lazyloadImg/mlazyimg.vue';
  import aaaSdk from '../login/aaa_sdk';
  import { CONFIG } from '../../common/js/config';
  // Similarly, you can also introduce the plugin resource pack you want to use within the component
  // require('some-videojs-plugin')

  export default {
    name: 'v-live',
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        _timeOutEvent: 0,
        playerOptions: {
          // component options
          start: 0,
          playsinline: false,

          // videojs options
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0]
        },
        firstShow: true,
        hasVoted: false,
        isWeixin: false,
        isPlaying: false,
        photoUrl: require('../../assets/photo_default.png')
      };
    },
    components: {
      vMimg
    },
    created() {
      this.isWeixin = isWeixin();
      console.log('isWeixin: ' + this.isWeixin);
      // console.log('voteCount: ' + this.data.voteCount);
      liveSdk.serverUrl = CONFIG.liveServer;
      aaaSdk.serverUrl = CONFIG.loginServer;
    },
    mounted() {
      // console.log('mounted isWeixin: ' + this.isWeixin);
      console.log('orientation: ' + this.data.orientation);
      this.getUserInfo();
     /*  if (this.data.orientation === 'LANDSCAPE') {
        this.$refs.myvideo.style.height = '165px';
        console.log(this.$refs.myvideo.style.height);
      } */

      // console.log('mounted!', this.playerOptions.sources[0].src);
      // videoSdk.videoIsVote('0001', this.data.videoId, this.videoIsVoteCallBack);
      // console.log('this is current player instance object', this.player);
    },
    computed: {
      player: function() {
        return this.$refs.videoPlayer.player;
      },
      computeHeight: function() {
        return {
          'height': this.data.orientation === 'LANDSCAPE' ? '165px' : '250px'
        };
      }
    },
    methods: {
      // listen event
      onPlayerPlay(player) {
        this.player.userActive(true);
        this.player.usingNativeControls(true);
        console.log('player play!', player);
        // console.log('mounted!', this.playerOptions.sources[0].src);
      },
      onPlayerPause(player) {
        // this.firstShow = !this.firstShow;

        console.log('player pause!', player);
        //  console.log('player pause!', this.playerOptions.sources[0].src);
      },
      // ...player event

      // or listen state event
      playerStateChanged(playerCurrentState) {
        console.log('player current update state', playerCurrentState);
        if (playerCurrentState.pause === true) {
          // this.player.reset();
          // this.player.options = this.playerOptions;
          // this.player.load();
          //  console.log('playerStateChanged!', this.player.currentSource());
        }
      },
      requestFullScreen(element) {
        if (element.requestFullScreen) {
          element.requestFullScreen();
          console.log('requestFullscreen');
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
          console.log('mozRequestFullScreen');
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
          console.log('msRequestFullscreen');
        } else if (element.oRequestFullscreen) {
          element.oRequestFullscreen();
          console.log('oRequestFullscreen');
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
          console.log('webkitRequestFullscreen');
        } /* else {
          var docHtml = document.documentElement;
          var docBody = document.body;
          var videobox = document.getElementById('videobox');
          var cssText = 'width:100%;height:100%;overflow:hidden;';
          docHtml.style.cssText = cssText;
          docBody.style.cssText = cssText;
          videobox.style.cssText = cssText + ';' + 'margin:0px;padding:0px;';
          document.IsFullScreen = true;
        } */
      },
      exitFullScreen(element) {
        if (element.exitFullScreen) {
          element.exitFullScreen();
          console.log('exitFullScreen');
        } else if (element.mozExitFullScreen) {
          element.mozExitFullScreen();
          console.log('mozExitFullScreen');
        } else if (element.msExitFullscreen) {
          element.msExitFullscreen();
          console.log('msExitFullscreen');
        } else if (element.oExitFullscreen) {
          element.oExitFullscreen();
          console.log('oExitFullscreen');
        } else if (element.webkitExitFullscreen) {
          element.webkitExitFullscreen();
          console.log('webkitExitFullscreen');
        }
      },

      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player);
        // you can use it to do something...
        // player.[methods]
      },

      onPlay(event) {
        event.preventDefault();
        this.isPlaying = true;
        this.$refs.play.style.opacity = 0x00;
        console.log('onPlay: ' + this.isPlaying);
      },

      onPause(event) {
        event.preventDefault();
        this.isPlaying = false;
        this.$refs.play.style.opacity = 0xff;
       // this.exitFullScreen(this.$refs.myvideo);
        console.log('onPause: ' + this.isPlaying);
      },
      onClick(event) {
        event.preventDefault();
        console.log('isPlaying: ' + this.isPlaying);
        console.log('isWeixin: ' + this.isWeixin);

        /* if (this.isPlaying === true) {
          if (this.isWeixin) {
            this.exitFullScreen(this.$refs.myvideo);
          }
          this.$refs.myvideo.pause();
          this.isPlaying = false;
        } else {
          // console.log(this.$refs.myvideo);
          if (this.isWeixin) {
            this.requestFullScreen(this.$refs.myvideo);
          }
          // this.$refs.myVideo.webkitEnterFullScreen();
          // this.$refs.myVideo.webkitEnterFullScreen();
          // console.log('Fullscreen1' + this.$refs.myvideo.webkitDisplayingFullscreen);
          this.$refs.myvideo.play();
          // console.log('Fullscreen2' + this.$refs.myvideo.webkitDisplayingFullscreen);
          this.isPlaying = true;
        } */
        this.$router.push({
          name: 'liveDetail',
          params: {
            data: this.data
          }
        });
      },
      onFullScreen(player) {
        console.log('full screen');
      },

      onTouchStart(event) {
        console.log(this.$refs.myvideo);
        let touch = event.touches[0];
        console.log('onTouchStart ' + touch);

        this._startPos = {x: touch.clientX, y: touch.clientY};

        this._timeOutEvent = setTimeout(this.longPress.bind(this), 500);
        event.preventDefault();
        return false;
      },
      onTouchMove(event) {
        console.log('onTouchMove ');
        let touch = event.changedTouches[0];
        let endPos = {x: touch.clientX, y: touch.clientY};
        // console.log(this._startPos);
        // console.log(endPos);
        // clearTimeout(this._timeOutEvent);
        // this._timeOutEvent = 0;
        if (Math.abs(endPos.y - this._startPos.y) > 5) {
          // console.log('move ok?');
          console.log(this._timeOutEvent);
          if (this._timeOutEvent > 0) {
            clearTimeout(this._timeOutEvent);
            this._timeOutEvent = -1;
            // console.log('move ok');
          }
        }
        return false;
      },
      onTouchEnd(event) {
        let touch = event.changedTouches[0];
        console.log('onTouchEnd ' + touch);

        /* let endPos = { x: touch.clientX, y: touch.clientY };

        if (Math.abs(endPos.x - this._startPos.x) > 0 || Math.abs(endPos.y - this._startPos.y) > 0) {
          if (this._timeOutEvent !== 0) {
            clearTimeout(this._timeOutEvent);
            this._timeOutEvent = 0;
          }

          return false;
        } */
        console.log('timeout1: ' + this._timeOutEvent);
        clearTimeout(this._timeOutEvent);
        console.log('timeout2: ' + this._timeOutEvent);
        if (this._timeOutEvent > 0) {
          this.onClick(event);
          console.log('click');
        } else if (this._timeOutEvent === 0) {
          console.log('longPress');
          this.requestFullScreen(this.$refs.myvideo);
          // this.$refs.myvideo.play();
        }
        return true;
      },
      longPress() {
        this._timeOutEvent = 0;
        // this.requestFullScreen(this.$refs.myvideo);
      },
      getUserInfoCallBack(res) {
        // console.log(res);
        if (res.resultCode !== '0') {
          return;
        }
        // console.log(res.data);
        if (res.data.length > 0) {
          this.photoUrl = 'data:image/png;base64,'.concat(res.data[0].icon);
        }
      },
      getUserInfo() {
        var userList = [];
        userList.push(this.data.userId);
        aaaSdk.getOtherUserInfo(userList, this.getUserInfoCallBack);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "live.styl"
</style>
