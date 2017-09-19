<!-- template for the modal component -->
<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
         <div class="modal-user">
          <slot name="user">
            <input  class="input" type="text" name="username" placeholder="mail" v-model="username">
          </slot>
        </div>

        <div class="modal-passwd">
          <slot name="passwd">
            <input type="password" name="passwd" placeholder="passwd" v-model="passwd">
          </slot>
        </div>

        <div class="modal-confirm">
          <button class="modal-default-button" @click="onConfirm">
            登录
          </button>
          <slot name="footer">
            <!-- <button class="modal-default-button" @click="$emit('close')">
              登录
            </button> -->

          </slot>
        </div>
      </div>
      <img class='closeLogin' src="../../assets/icon_close_login.png" v-on:click="onCloseClick($event)">
    </div>
  </div>
</template>
<script>
  import { userInfo } from '../../common/js/UserInfo';
  import aaaSdk from './aaa_sdk';
  import { CONFIG } from '../../common/js/config';
  export default {
    name: 'v-login',
    props: {
      data: {
        type: Object
      }

    },
    data() {
      return {
        showModal: false,
        username: '',
        passwd: ''
      };
    },
    created() {
     // aaaSdk.serverUrl =
      console.log('login create');
    },
    mounted() {
      aaaSdk.serverUrl = CONFIG.loginServer;
    },
    computed: {

    },
    methods: {
      getUserInfoCallBack(data) {
        console.log(data);
        userInfo.nickName = data.info.nickname;
        userInfo.photoUrl = 'data:image/png;base64,'.concat(data.info.icon);
        userInfo.birthday = data.info.birthday;
        userInfo.firstName = data.info.firstName;
        userInfo.lastName = data.info.lastName;
        userInfo.gender = data.info.gender;
        userInfo.middleName = data.info.middleName;
        userInfo.paymentType = data.info.paymentType;
        userInfo.status = data.info.status;
        userInfo.telephone = data.info.telephone;
        this.$emit('onComplete', true);
      },
      userLoginCallback(data) {
       // console.log(data);
        // alert('OK');
        console.log(userInfo);
       // userInfo.userToken = data.userToken;
        aaaSdk.getUserInfo(data.userToken, this.getUserInfoCallBack);
      },
      onConfirm() {
        console.log('methods');
        console.log('name: ' + this.username);
        console.log('passwd: ' + this.passwd);
        userInfo.id = this.username;
        aaaSdk.userLogin(this.username, this.passwd, this.userLoginCallback);
      },
      onCloseClick() {
        this.$emit('onComplete', false);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "login.styl"
</style>

<!-- app -->
<!-- <div id="app">
  <button id="show-modal" @click="showModal = true">Show Modal</button>

  <modal v-if="showModal" @close="showModal = false">

    <h3 slot="header">custom header</h3>
  </modal>
</div> -->

/* register modal component
Vue.component('modal', {
template: '#modal-template'
})

// start app
new Vue({
el: '#app',
data: {
showModal: false
}
}) */
