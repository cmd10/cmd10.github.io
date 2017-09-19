<template>
  <div class="videoDetailMessagePage">
    <div class="videoDetailMessageBottom">
      <img  class='videoDetailMessageBottomVoice' src="../../assets/icon_voice_default.png">
      <button class="videoDetailMessageBottomSend" v-on:click="onBtnClick($event)">发送</button>
      <input ref="videoDetailMessageBottomInput" class="videoDetailMessageBottomInput" v-model="inputText">
    </div>
    <div ref="videoDetailMessageScrollWrap">
      <div class="videoDetailMessageCommentWrapper">
        <div v-show="commentData.length > 0" v-for="data in commentData">
          <v-comment class="videoDetailMessageComment" ref="videoDetailMessageComment" :data="data"></v-comment>
        </div>
      </div>
      <infinite-loading :on-infinite="loadMore" ref="infiniteLoading"  spinner="bubbles">
        <span slot="no-more">
          There is no more comment!
        </span>
        <span slot="failed">
          Load failed :(
        </span>
      </infinite-loading>
    </div>
  </div>
</template>
<script>
  import commentSdk from '../lazyloadImg/comment_sdk';
  import InfiniteLoading from 'vue-infinite-loading';
  import vComment from '../comment/comment.vue';
  import { CONFIG } from '../../common/js/config';

  export default {
    name: 'v-videoMessage',
    props: {
    },
    data() {
      return {
        data: this.$route.params.data,
        inputText: '',
        commentData: [],
        busy: false,
        noMore: false,
        latestComment: null
      };
    },
    components: {
      InfiniteLoading,
      vComment
    },

    created() {
    },
    mounted() {
      console.log(this.$route.params.data);
      commentSdk.serverUrl = CONFIG.commentServer;
      // this.loadTop();
      // this.send = this.$start(document.querySelector('.messageWrap'), [0, 1]);
      // commentSdk.downloadComment(this.data.videoId, 0, 10, this.onCommentDownloadCallback);
    },
    computed: {

    },

    destroyed() {

    },
    methods: {
      onMsgSendCallback(data) {
        console.log('onMsgSendCallback');
        console.log(data);
        // this.send({text: this.inputText, color: 'black', speed: 1, classname: 'style3'});
        this.commentData.splice(0, 1, this.latestComment);
        this.inputText = '';
        this.$refs.videoDetailMessageBottomInput.focus();
      },
      onBtnClick(event) {
        console.log('send');
        if (this.inputText === '') {
          return;
        }
        // console.log(this.inputText);
        // this.send({text: this.input_text});
        console.log(this.$route.params.data);
        this.latestComment = {
          'FromUserId': this.data.voteCount,
          'FromUserName': this.data.voteCount,
          'Date': new Date().toISOString(),
          'VideoId': this.data.videoId,
          'ToUserId': null,
          'ToUserName': null,
          'Comment': this.inputText
        };
        commentSdk.uploadVideoComment(this.latestComment.FromUserId, this.latestComment.FromUserName, this.latestComment.Date, this.latestComment.VideoId, null, null, this.latestComment.Comment, this.onMsgSendCallback);
      },
      onCommentDownloadCallback(data) {
        if (data.TotalNum <= 0) {
          this.noMore = true;
          console.log('complete');
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          return;
        }
        this.noMore = false;
        // this.commentData.concat(data.CommentInfo);
        for (var comment of data.CommentInfo) {
          this.commentData.push(comment);
        }
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
      },
      loadMore() {
        setTimeout(() => {
          this.busy = true;
          // this.$store.commit('UPDATE_LOADING', true);
          console.log('commentDataLength: ' + this.commentData.length);
          commentSdk.downloadComment(this.data.videoId, this.commentData.length, 10, this.onCommentDownloadCallback);
          this.busy = false;
        }, 1000);
      },
      loadTop() {
        setTimeout(() => {
          this.busy = true;
          // this.$store.commit('UPDATE_LOADING', true);
          console.log('commentDataLength: ' + this.commentData.length);
          this.commentData.splice(0, this.commentData.length);
          commentSdk.downloadComment(this.data.videoId, 0, 10, this.onCommentDownloadCallback);
          this.busy = false;
        }, 1000);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "videoMessage.styl"
</style>
