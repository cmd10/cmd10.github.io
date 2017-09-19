<template>
  <div class="menu">
    <v-Login v-if="showModal" v-on:onComplete="onLoginComplete($event)">
      <!-- <v-login></v-login>
      <h3 slot="header">custom header</h3> -->
    </v-Login>
    <div class="menu-list" :class="{'show': show}">
      <div class="menu-header">
        <img class="menu-avatar" :src='photoUrl' alt="" v-on:click="onPhotoClick($event)">
        <div class="menu-title" v-text='nickName'></div>
      </div>
      <div class="menu-ul">
        <div v-for='menu in menus' @click="updateHeader(MENU_CONVERT[menu], menu)">
          <router-link class="icon-quanbu iconfont item border-1px" :to="menu">
            <div class="menu-icon">
              <i class="iconfont " :class="'icon-'+ menu"></i>
            </div>
            <span class="menu-text">{{MENU_CONVERT[menu]}}</span>
            <div class="menu-new" v-show="menu ==='day' && news>0">
              <span>5</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="menu-other">
    </div>
  </div>
</template>

<script>
  import { userInfo } from '../../common/js/UserInfo';
  import vLogin from '../login/login.vue';
  import { mapState } from 'vuex';
  const MENU_CONVERT = { 'video': '视频', 'ios': 'IOS', android: 'Android', web: '前端', live: '直播', hot: '热门', my: '我的' };
  export default
    {
      name: 'v-menu',
      props: {
        show: {
          type: Boolean
        }
      },
      data() {
        return {
          MENU_CONVERT: MENU_CONVERT,
          showModal: false,
          photoUrl: require('../../assets/photo.png'),
          nickName: '未登录'
        };
      },
      components: {
        vLogin
      },
      computed: {
      ...mapState([
          'menus', 'news'
        ])
      },
      methods: {
        updateHeader(title, menu) {
          this.$store.commit('UPDATE_TITLE', title);
           this.$store.commit('UPDATE_MENUSHOW');
           if (menu === 'day') {
              this.$store.commit('UPDATE_NEWS');
           }
        },
        onConfirm() {
          this.loginShow = false;
        },
        onPhotoClick() {
          this.showModal = true;
        },
        onLoginComplete(event) {
          this.showModal = false;
          this.nickName = userInfo.nickName;
          this.photoUrl = userInfo.photoUrl;
        }
      }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import 'menu.styl';

</style>
