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
  <div class="video-item">
    <figure class="myfigure">
      <!-- <img
        class="play"
        ref="play"
        src="../../assets/icon_shortvideo_pressed.png"
        v-on:webkitfullscreenchange="onFullScreen(this)"
        v-on:touchstart="onTouchStart($event)"
        v-on:touchend="onTouchEnd($event)">
      <video
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
        x5-webkit-displaying-fullscreen="true"
        style="object-fit:fill"
        v-on:play="onPlay"
        v-on:pause="onPause"
        v-on:webkitfullscreenchange="onFullScreen(this)"
        v-on:touchstart="onTouchStart($event)"
        v-on:touchend="onTouchEnd($event)"
        v-on:touchmove="onTouchMove($event)">
      </video> -->
      <v-mimg ref="myvideo"
              class="myvideo" :imgUrl="data.img" v-on:click.native="onClick($event)"
              v-bind:style="computeHeight"></v-mimg>
      <div class="vote">
        <span class="votenum" v-text="voteCount"></span>
        <img class="votepic" src="../../assets/icon_like.png">
      </div>
      <div class="desc">
        <img class="photo" :src="photoUrl">
        <span class="title" v-text="data.title"></span>
        <span class= "author" v-text="data.author"></span>
        <v-vote class="like" :hasVoted="hasVoted" :callBack="onVoteClick"></v-vote>
      </div>
    </figure>
  </div>
</template>

<script>
  import videoSdk from '../lazyloadImg/video_sdk.js';
  import vVote from '../lazyloadImg/vote.vue';
  import {isWeixin} from '../../common/js/browserCheck.js';
  import vMimg from '../lazyloadImg/mlazyimg.vue';
  import aaaSdk from '../login/aaa_sdk';
  import { CONFIG } from '../../common/js/config';
  // Similarly, you can also introduce the plugin resource pack you want to use within the component
  // require('some-videojs-plugin')

  export default {
    name: 'v-video',
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
        voteCount: this.data.voteCount,
        isPlaying: false,
        isWeixin: false,
        photoUrl: require('../../assets/photo_default.png')
      };
    },
    components: {
      vVote,
      vMimg
    },
    created() {
      this.isWeixin = isWeixin();
      // console.log('voteCount: ' + this.data.voteCount);
      videoSdk.serverUrl = CONFIG.videoServer;
      aaaSdk.serverUrl = CONFIG.loginServer;
    },
    mounted() {
      this.getUserInfo();
    },
     computed: {
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
        if (element.requestFullscreen) {
          element.requestFullscreen();
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

      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player);
        // you can use it to do something...
        // player.[methods]
      },

      onPlay(event) {
        event.preventDefault();
        this.$refs.play.style.opacity = 0x00;
        this.isPlaying = true;
        console.log('onPlay: ' + this.isPlaying);
      },

      onPause(event) {
        this.$refs.play.style.opacity = 0xff;
        event.preventDefault();
        // this.$refs.myvideo.webkitExitFullScreen();
        this.isPlaying = false;
        console.log('onPause: ' + this.isPlaying);
      },

      onClick(event) {
        this.$router.push({
          name: 'videoDetail',
          params: {
            data: this.data
          }
        });
       // event.preventDefault();
       /* console.log('isPlaying: ' + this.isPlaying);
        console.log('isWeixin: ' + this.isWeixin);
        if (this.isPlaying === true) {
          if (this.isWeixin) {
            this.$refs.myvideo.webkitExitFullScreen();
          }
          this.$refs.myvideo.pause();
          this.isPlaying = false;
        } else {
         // console.log(this.$refs.myvideo);
          if (this.isWeixin) {
            this.requestFullScreen(this.$refs.myvideo);
          }

          this.$refs.myvideo.play();

          // console.log('Fullscreen2' + this.$refs.myvideo.webkitDisplayingFullscreen);
          this.isPlaying = true;
        } */
      },

      onFullScreen(player) {
          // this.$refs.myvideo.style.zIndex = '2147483648';
          console.log('full screen');
      },

      onTouchStart(event) {
        console.log(this.$refs.myvideo);
        let touch = event.touches[0];
        console.log('onTouchStart ' + touch);

        this._startPos = {x: touch.clientX, y: touch.clientY};

        this._timeOutEvent = setTimeout(this.longPress.bind(this), 500);
        // event.preventDefault();
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
        this.requestFullScreen(this.$refs.myvideo);
        this._timeOutEvent = 0;
        // this.requestFullScreen(this.$refs.myvideo);
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
      onVoteClick(voted) {
        console.log('onVoteClick: videoId = ' + this.hasVoted);
        if (this.hasVoted === true) {
          videoSdk.unvoteVideo(this.voteCount - 1, this.data.videoId, this.onUnVoteCallBack);
        } else {
          videoSdk.voteVideo(this.voteCount, this.data.videoId, this.onVoteCallBack);
        }
      },
      videoIsVoteCallBack(voted) {
        console.log('videoIsVoteCallBack: ' + voted);
        this.hasVoted = voted;
      },
      getUserInfoCallBack(res) {
        // console.log(res);
        if (res.resultCode !== '0') {
          return;
        }
       //  console.log(res.data);
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
  @import "video.styl"
</style>
