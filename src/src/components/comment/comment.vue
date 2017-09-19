<template>
  <div class="commentPage">
    <figure class="commentWrap">
      <div class="commentInfo">
        <img class="commentInfoPhoto" src="../../assets/photo_default.png">
        <span class="commentInfoName" v-text="data.FromUserName"></span>
        <span class="commentInfoTime" v-text="data.Date"></span>
        <span class="commentInfoVoteNum">0</span>
        <img class="commentInfoVotePic" src="../../assets/icon_like1.png">
      </div>
      <p class="commentCotent" v-text="data.Comment"></p>
    </figure>
  </div>
</template>

<script>
  export default {
    name: 'v-comment',
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {

      };
    },
    components: {

    },
    created() {

    },
    mounted() {
    },
    computed: {},
    methods: {
      // listen event
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "comment.styl"
</style>
