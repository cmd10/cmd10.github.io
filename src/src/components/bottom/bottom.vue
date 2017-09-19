<template>
  <div class="bottom">
    <div class="bottomBackGround"></div>
    <router-link  class="hot-item item" to="/hot">
      <img class='hotImg bottomImgBackGroundColor' :src="hotImgUrlCompute"  v-on:click="updateBottom(0)">
      <span ref="hot" class="hot bottomColorFont" v-on:click="updateBottom(0)">热门</span>
    </router-link>
    <router-link  class="live-item item" to="/live">
      <img  class='liveImg bottomImgBackGroundColor' :src="liveImgUrlCompute" v-on:click="updateBottom(1)">
      <span ref="live" class="live bottomColorFont" v-on:click="updateBottom(1)">直播</span>
    </router-link>

    <router-link class="record-item item" to="/record">
      <img class="recordImg bottomImgBackGroundColor" src="../../assets/icon_live_default_1.png">
      <span ref="record" class="record bottomColorFont">ShowMe</span>
    </router-link>

    <router-link  class="vod-item item" to="/video">
      <img  class='vodImg bottomImgBackGroundColor' :src="vodImgUrlCompute"  v-on:click="updateBottom(2)">
      <span ref="vod" class="vod bottomColorFont" v-on:click="updateBottom(2)">视频</span>
    </router-link>
    <router-link  class="my-item item" to="/my">
      <img  class='myImg bottomImgBackGroundColor':src="myImgUrlCompute" v-on:click="updateBottom(3)">
      <span ref="my" class="my bottomColorFont" v-on:click="updateBottom(3)">我的</span>
    </router-link>
    <!-- <span ref="hot" class="hot" v-on:click="onHotClick">热门</span>
    <span ref="live" class="live" v-on:click="onLiveClick">直播</span>
    <span ref="vod" class="vod" v-on:click="onVideoClick">视频</span>
    <span ref="my" class="my" v-on:click="onMyClick">我的</span> -->
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { getBottomItem } from '../../vuex/getters';
  export default
  {
    name: 'v-bottom',
    components: {
    },
    data() {
      return {
        show: false
        // clickedItem: 0
      };
    },
    computed: {
      ...mapState([
        'menus',
        'bottomItemNumber',
        'menuShow'
      ]),
      hotImgUrlCompute: function () {
        return this.bottomItemNumber === 0 ? require('../../assets/icon_hot_pressed.png') : require('../../assets/icon_hot_default.png');
      },
      liveImgUrlCompute: function () {
        return this.bottomItemNumber === 1 ? require('../../assets/icon_live1_fressed.png') : require('../../assets/icon_live1_default.png');
      },
      vodImgUrlCompute: function () {
        return this.bottomItemNumber === 2 ? require('../../assets/icon_shortvideo_pressed.png') : require('../../assets/icon_shortvideo_default.png');
      },
      myImgUrlCompute: function () {
        return this.bottomItemNumber === 3 ? require('../../assets/icon_my_pressed.png') : require('../../assets/icon_my_default.png');
      }
    },
    mounted() {
    },
    methods: {
      onHotClick() {
       this.clickedItem = 0;
      },
      onLiveClick() {
        this.clickedItem = 1;
      },
      onVideoClick() {
        this.clickedItem = 2;
      },
      onMyClick() {
        this.clickedItem = 3;
      },
      updateBottom(num) {
        // this.$store.commit('UPDATE_TITLE', title);
        this.$store.commit('UPDATE_BOTTOM', num);
        // this.$store.commit('UPDATE_MENUSHOW');
      },
      onConfirm() {
        this.loginShow = false;
      }
    },
    vuex: {
      getters: {
        bottomItemNumber: getBottomItem
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "bottom.styl";
</style>
