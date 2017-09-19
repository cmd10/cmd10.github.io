<template>
  <div class="liveDetailMessagePage">
    <div class="liveDetailMessageBottom">
      <img class='liveDetailMessageVoice' src="../../assets/icon_voice_default.png">
      <button class="liveDetailMessageSend" v-on:click="onBtnClick($event)">发送</button>
      <input ref="liveDetailMessageInput" class="liveDetailMessageInput" v-model="inputText">
    </div>
    <div class="liveDetailMessageBarrageWrap">
      <div class="liveDetailMessageBarrageWrapItem" v-for='msgItem in msgList'>
        <span class="liveDetailMessageBarrageWrapItemNick" v-text="msgItem.user + ': '" ></span>
        <span class="liveDetailMessageBarrageWrapItemMsg" v-text="msgItem.msg.content"></span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'v-liveMessage',
    props: {
    },
    data() {
      return {
        inputText: '',
        data: this.$route.params.data,
        iMsgSdk: this.$route.params.iMsgSdk,
        msgList: []
      };
    },
    components: {

    },

    created() {

    },
    mounted() {
      this.iMsgSdk.onReceivedPrivateMessage = this.onRcvPrivateMsg;
      this.iMsgSdk.onReceivedRoomMessage = this.onRcvRoomMsg;
      this.send = this.$start(document.querySelector('.liveDetailMessageBarrageWrap'), [0, 1]);
    },
    computed: {

    },

    destroyed() {

    },
    methods: {
      onRcvPrivateMsg() {

      },
      onRcvRoomMsg(roomName, sendUserName, message) {
        console.log('Rcv msg: ' + message + 'from:' + sendUserName + 'in Room: ' + roomName);
        var msgData = JSON.parse(message.replace(/&quot;/g, '"'));
        console.log(msgData);
        this.msgList.push({
          user: sendUserName,
          msg: msgData
        });
        console.log(this.msgList.length);
        this.send({text: msgData.content, color: 'black', speed: 1, classname: 'style3'});
      },
      onBtnClick(event) {
        console.log('send');
        console.log(this.inputText);
        // this.send({text: this.input_text});
        var date = new Date();
        var msg = {content: this.inputText, type: 0, time: date.getTime().toString()};
        this.iMsgSdk.sendRoomMessage(this.data.videoId, JSON.stringify(msg));
        this.inputText = '';
        this.$refs.liveDetailMessageInput.focus();
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "liveMessage.styl"
</style>
