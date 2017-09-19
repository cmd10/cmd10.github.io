<template>
  <video ref='myvideo'
         class='myvideo'
         id="videoElement"
         :poster="poster"
         v-on:pause="onPause($event)"
         v-on:play="onPlay($event)">
  </video>
</template>

<script>
  import flvjs from 'flv.js';
  import { CONFIG } from '../../common/js/config';
  export default {
    name: 'v-player',
    props: {
      src: {
        type: String
      },
      poster: {
        type: String
      },
      type: {
        type: String
      },
      isLive: {
        type: Boolean
      },
      orientation: {
        type: String
      }
    },
    data() {
      return {
        flvPlayer: null,
        isPlaying: false
      };
    },
    components: {
    },
    created() {

    },
    mounted() {
      if (this.orientation === 'LANDSCAPE') {
        this.$refs.myvideo.style.height = '165px';
      }
      console.log('MediaSource');
      console.log(window.MediaSource);
      if (flvjs.isSupported()) {
       // var videoElement = this.$refs.myvideo;
        this.flvPlayer = flvjs.createPlayer({
          type: this.type,
          isLive: true,
          url: this.src.replace(CONFIG.videoPrefix, CONFIG.flvVideoReplacePrefix).concat('.flv'),
          enableWorker: true,
          enableStashBuffer: false,
          stashInitialSize: 128
        });
        var videoElement = this.$refs.myvideo;
        this.flvPlayer.attachMediaElement(videoElement);
        this.flvPlayer.load();
      } else {
        console.log('flvjs is not supported');
      }
    },
    computed: {
    },
    destroyed() {
      console.log('Player destroyed');
      this.flvPlayer.unload();
      this.flvPlayer.destroy();
    },
    methods: {
      _requestFullScreen(element) {
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
      onClick(event) {
        console.log('isPlaying: ' + this.isPlaying);
        if (this.isPlaying) {
          // this.$refs.myvideo.webkitExitFullScreen();
          this.flvPlayer.pause();
          // this.flvPlayer.unload();
          this.isPlaying = false;
        } else {
          console.log(this.flvPlayer);
          // this.$refs.myvideo.setAttribute('crossorigin', 'anonymous');
          // this.requestFullScreen(this.$refs.myvideo);
          // this.flvPlayer.load();
          this.flvPlayer.play();
          this.isPlaying = true;
          return false;
        }
      },
      onPlay(event) {
        event.preventDefault();
        this.$emit('play', event);
      },
      onPause(event) {
        event.preventDefault();
        this.$emit('pause', event);
      },
      play() {
        console.log(this.flvPlayer);
        // console.log(this.flvPlayer.url);
        if (this.isPlaying === false) {
          // this.flvPlayer.load();
          this.flvPlayer.play();
          this.isPlaying = true;
        }
      },
      pause() {
        if (this.isPlaying === true) {
          this.flvPlayer.pause();
          // this.flvPlayer.unload();
          this.isPlaying = false;
        }
      },
      requestFullScreen(element) {
        this._requestFullScreen(this.$refs.myvideo);
      },
      exitFullScreen(element) {
        this.$refs.myvideo.webkitExitFullScreen();
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "player.styl"
</style>

