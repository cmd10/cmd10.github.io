<template>
  <div class="mediaSelectPage">
    <div class="mediaSelectWrap">
      <input id="mediaSelectInput" class="mediaSelectInput" ref="mediaSelectInput" type="file" accept=" video/mp4,video/mpeg,video/3gpp" v-on:change="previewFile" alt=""/>
      <div class="videoBackGround">
        <img
          v-show="selected && !playing"
          class="mediaSelectVideoPlayCtrl"
          ref="mediaSelectVideoPlayCtrl"
          src="../../assets/icon_shortvideo_pressed.png"
          v-on:click="onPlayCtrlClick($event)">
        <video loop preload class="mediaSelectVideo" ref="mediaSelectVideo" autoplay :poster='posterImg' :src="filePath"
               v-on:play="onPlay($event)"
               v-on:playing="onPlaying($event)"
               v-on:pause="onPause($event)"
               v-on:ended="onEnded($event)"
               v-on:error="onError($event)"
               v-on:loadedmetadata="onLoadedMetaData($event)"
               v-on:click="onClick($event)"
               v-bind:style="fitComputed">
        </video>
        <div class="mediaSelectVideoNote">点击切换视频</div>
      </div>
      <div class="videoDesc">
        <img class="videoDescCover" src="../../assets/photo_default.png">
        <input class='videoDescTitle' type="text" placeholder="输入标题后更受欢迎哦！！！" v-model="titleText">
      </div>
      <div class="videoShare">
        <span class="videoShareText">分享到：</span>
        <img class="videoShareTwitte" src="../../assets/icon_twitte_default.png">
        <img class="videoShareDiscover" src="../../assets/icon_discover_default.png">
        <img class="videoShareQQSpace" src="../../assets/icon_qq_space_default.png">
        <img class="videoShareFaceBook" src="../../assets/icon_focebook_default.png">
        <img class="videoShareWeibo" src="../../assets/icon_weibo_default.png">
      </div>
      <button class="mediaSelectUpLoad" v-on:click="onUpload">发布</button>
      <div v-show="uploadingShow" class="uploadingPage">
        <img class="uploadingImg" src="../../assets/loading.png">
      </div>
    </div>
    <!-- <input type="file" ref="input" v-on:change="previewFile"><br>
    <video preload autoplay v-for='img in imgUrlPath' :src="img" ref="img" height="200" alt="Image preview..."></video> -->
  </div>
</template>

<script>
  import SparkMD5 from 'spark-md5';
  import { userInfo } from '../../common/js/UserInfo';
  import {dateFormat} from '../../common/js/DateFormat.js';
  import { CONFIG } from '../../common/js/config';

  export default
  {
    name: 'v-mediaSelect',
    components: {
    },
    data() {
      return {
        filePath: '',
        imgUrlPath: [],
        posterImg: require('../../assets/photo_default.png'),
        uploadingShow: false,
        md5sum: '',
        binaryString: '',
        sessionId: '',
        titleText: '',
        orientation: 'LANDSCAPE',
        selected: false,
        playing: false
      };
    },
    computed: {
      fitComputed() {
        return {
          'object-fit': this.playing ? 'contain' : 'fill'
        };
      }
    },
    mounted() {
    },
    methods: {
      onUploadedNotifyCallback(result) {
        console.log(result);
        this.uploadingShow = false;
        window.alert('上传成功！！！');
        this.titleText = '';
        this.filePath = '';
        this.selected = false;
      },
      onUploadFileSuccessCallback(result) {
        console.log(result);
        let size = this.$refs.mediaSelectInput.files[0].size;
        var date = new Date();
        this.$http.post(CONFIG.videoUploadUrl, {
          'MsgType': 'VideoUploadedNotify',
          'UserId': userInfo.id,
          'UserName': userInfo.nickName,
          'SessionId': this.sessionId,
          'VideoDesc': this.titleText,
          'Date': dateFormat(date, 'yyyyMMddhhmmss'),
          'Size': size,
          'MD5': this.md5sum,
          'ScreenOrientation': this.orientation,
          'IsUploadPic': 0
        }).then(this.onUploadedNotifyCallback);
      },
      onUploadFileErrorCallback(result) {
        console.log(result);
      },
      onUploadAddrReqCallback(result) {
        console.log(result.body.Data);
        this.sessionId = result.body.Data.SessionId;
        console.log(this.sessionId);
        this.$http.put(result.body.Data.VideoAddr, this.binaryString, {
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8'
          }
        }).then(this.onUploadFileSuccessCallback);
      },

      onUpload() {
        console.log('onUpload');
        if (!this.selected) {
          window.alert('请选择视频文件！！！');
          return;
        }
        this.$refs.mediaSelectVideo.pause();
        this.uploadingShow = true;
        var file = this.$refs.mediaSelectInput.files[0];
        var reader = new window.FileReader();
        var that = this;
        console.log(reader);
        reader.addEventListener('load', function (event) {
          console.log(reader);
        }, false);

        reader.addEventListener('loadend', function (event) {
          console.log(event);
          that.md5sum = SparkMD5.ArrayBuffer.hash(event.target.result);
          that.binaryString = event.target.result;
          console.log('loadend' + that.md5sum);
          that.$http.post(CONFIG.videoUploadUrl, {
            'MsgType': 'VideoUploadAddrReq',
            'UserId': userInfo.id
          }).then(that.onUploadAddrReqCallback);
        }, false);
        if (file) {
          reader.readAsArrayBuffer(file);
        }
      },
      previewFile() {
        console.log('previewFile');
        // this.filePath = window.URL.createObjectURL(this.$refs.mediaSelectInput.files[0]);
        this.filePath = (window.URL) ? window.URL.createObjectURL(this.$refs.mediaSelectInput.files[0]) : window.webkitURL.createObjectURL(this.$refs.mediaSelectInput.files[0]);
        this.selected = true;
        // this.$refs.mediaSelectVideo.play();

       /* var file = this.$refs.mediaSelectInput.files[0];
        var reader = new window.FileReader();
        var that = this;
        reader.addEventListener('loadend', function (event) {
          console.log(event);
          that.filePath = event.target.result;
        }, false);
        reader.readAsDataURL(file); */
      },
      onPlay() {
        console.log('onPlay');
        this.playing = true;
      },
      onPlaying(event) {
        console.log('onPlaying');
        this.playing = true;
        //  console.log(this.playing);
      },
      onPause(event) {
        console.log('onPause');
        this.playing = false;
      },
      onEnded(event) {
        console.log('onEnded');
        this.playing = false;
      },
      onError(event) {
        console.log('onError');
        this.playing = false;
        if (this.selected) {
          window.alert('视频无法加载');
        }
      },
      onLoadedMetaData(event) {
        console.log(event);
        if (event.target.videoWidth < event.target.videoHeight) {
          this.orientation = 'PORTRAIT';
        }
      },
      onPlayCtrlClick(event) {
        console.log('onPlayCtrlClick');
        this.$refs.mediaSelectVideo.play();
      },
      onClick(event) {
        this.$refs.mediaSelectInput.click();
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "mediaSelect.styl";
</style>
