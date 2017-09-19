<template>
  <img v-bind:src="imgUrl" v-on:click="onVoteClick">
</template>

<script>
  // Similarly, you can also introduce the plugin resource pack you want to use within the component
  // require('some-videojs-plugin')
  export default {
    name: 'v-vote',
    props: {
      hasVoted: {
        type: Boolean
      },
      callBack: {
        type: Function
      }
    },
    data() {
      console.log('hasVoted: ' + this.hasVoted);
      return {
        imgUrl: this.hasVoted ? require('../../assets/like_prissed1.png') : require('../../assets/like_default.png')
      };
    },
    mounted() {

    },
    watch: {
      hasVoted: function (newValue, oldValue) {
        console.log('newValue: ' + newValue + '  oldvalue: ' + oldValue);
        if (oldValue === false && newValue === true) {
          this.imgUrl = require('../../assets/like_prissed1.png');
        } else if (oldValue === true && newValue === false) {
          this.imgUrl = require('../../assets/like_default.png');
        }
      }
    },
    computed: {

    },
    methods: {
      onVoteClick() {
        console.log('onVoteClick: ' + this.hasVoted);
        this.callBack();
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "like.styl";
</style>
