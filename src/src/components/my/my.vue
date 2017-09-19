<template>
  <div class="myPage">
    <v-touch class="myPageWrap"  v-on:swiperight="onSwipeRight" v-bind:swipe-options="{ direction: 'horizontal', threshold: 100 }">
      <v-Login v-if="loginShow" v-on:onComplete="onLoginComplete($event)">
        <!-- <v-login></v-login>
        <h3 slot="header">custom header</h3> -->
      </v-Login>
      <div class="myInfo">
        <div class="myLoginInfo">
          <img :src="myPhotoUrl" class="myPhoto" v-on:click="onPhotoClick($event)">
          <div class="myNickName">
            <span v-text="myNickName"></span>
          </div>
          <div class="myId">
            <span v-text="myId"></span>
          </div>
          <div class='loginNote'>
            <span v-text="loginNoteCompute"></span>
          </div>
        </div>
        <div class="myRelated">
          <div class="myFollow">
            <div  class="myFollowNum">
              <span v-text="followNum">0</span>
            </div>
            <div class="myFollowDesc">
              <span>关注</span>
            </div>
          </div>
          <div class="myFans">
            <div class="myFansNum">
              <span v-text="fansNum">0</span>
            </div>
            <div class="myFansDesc">
              <span>粉丝</span>
            </div>
          </div>
          <div class="myMovie">
            <div class="myMovieNum">
              <span v-text="movieNum">0</span>
            </div>
            <div class="myMovieDesc">
              <span>专辑</span>
            </div>
          </div>
        </div>
      </div>
      <div class="myCount">
        <img class='myCountPic' src="../../assets/icon_wallet.png">
        <span class='myCountDesc'>账户</span>
        <img class='myCountNextPic' src="../../assets/icon_left_allow.png">
      </div>
      <div class="mySetting">
        <img class='mySettingPic'src="../../assets/icon_settings.png">
        <span class='mySettingDesc'>设置</span>
        <img class='mySettingNextPic' src="../../assets/icon_left_allow.png">
      </div>
    </v-touch>
  </div>
</template>

<script>
  // Similarly, you can also introduce the plugin resource pack you want to use within the component
  // require('some-videojs-plugin')
  import { userInfo } from '../../common/js/UserInfo';
  import vLogin from '../login/login.vue';
  export default {
    name: 'v-my',
    props: {
    },
    data() {
      return {
        myPhotoUrl: require('../../assets/photo.png'),
        myNickName: '未登录',
        myId: 'ID: xxxxx',
        followNum: 0,
        fansNum: 0,
        movieNum: 0,
        loginShow: false,
        isLogin: false
      };
    },
    components: {
      vLogin
    },

    created() {
      // console.log('voteCount: ' + this.data.voteCount);

    },
    mounted() {
      this.myNickName = userInfo.nickName;
      this.myPhotoUrl = userInfo.photoUrl;
      this.myId = 'ID: '.concat(userInfo.id);
    },
    activated: function () {
      this.$store.commit('UPDATE_BOTTOM', 3);
      // this.$nextTick(() => $(window).scrollTop(window.window.sessionStorage.scrollTop));
    },
    computed: {
      loginNoteCompute() {
        if (this.myId !== 'ID: xxx') {
          return '这个人太懒了，还没有写任何签名。。。';
        } else {
          return '登录看我，用视频记录点击生活~';
        }
      }
    },
    methods: {
      onPhotoClick(event) {
        this.loginShow = true;
      },
      onLoginComplete(event) {
        this.loginShow = false;
        this.myNickName = userInfo.nickName;
        this.myPhotoUrl = userInfo.photoUrl;
        this.isLogin = true;
        this.myId = 'ID: '.concat(userInfo.id);
      },
      onSwipeRight() {
        console.log('onSwipeRight');
        this.$router.push({
          name: 'video'
        });
        this.$store.commit('UPDATE_BOTTOM', 2);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "my.styl"
</style>
