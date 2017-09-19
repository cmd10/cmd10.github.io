 var strophe = require('strophe.js');
 var Strophe = strophe.Strophe;

class IMSdk {
  static init() {
    IMSdk.serverUrl = null;

    // XMPP连接
    IMSdk.connection = null;

    // 当前状态是否连接
    IMSdk.connected = false;

    // 当前登录的JID
    IMSdk.mJid = '';
    IMSdk.mUserId = '';
    IMSdk.mDomain = '';
    IMSdk.mRoomDomain = '';

    IMSdk.onLoginSuccess = null; // 无参数
    IMSdk.onLoginFailed = null; // status -- 失败的错误码
    IMSdk.onReceivedPrivateMessage = null; // sendUserName-发送者; message-消息
    IMSdk.onReceivedRoomMessage = null; // roomName-房间id,sendUserName-发送者;message-消息
    IMSdk.onDisConnected = null; // 无参数
  }
  constructor() {
    IMSdk.init();
  }

  static onConnect(status) {
    console.log(status);
    if (status === Strophe.Status.DISCONNECTED) {
      if (IMSdk.onDisConnected !== null) {
        IMSdk.onDisConnected();
      }
      IMSdk.connected = false;
      console.log('DISCONNECTED');
    } else if (status === Strophe.Status.CONNECTED) {
      // 当接收到<message>节，调用onMessage回调函数

      IMSdk.connection.addHandler(IMSdk.onMessage, null, 'message', null, null, null);

      // 首先要发送一个<presence>给服务器（initial presence）
      var initialMsg = new Strophe.Builder('presence', {from: IMSdk.mJid});
      initialMsg.c('status', {}, 'Online');
      initialMsg.c('priority', {}, '1'); // 在线状态

      console.log(initialMsg.tree());
      IMSdk.connection.send(initialMsg.tree());

      IMSdk.connected = true;

      // test code
      // IMSdk.joinRoom('owen_gxt');

      // IMSdk.sendRoomMessage('owen_gxt','romromromrorm')

      // IMSdk.exitRoom()

      // IMSdk.createRoom('Owen1texit')

      if (IMSdk.onLoginSuccess !== null) {
        IMSdk.onLoginSuccess();
      } else {
        console.log('Strophe onConnect onLoginSuccess = null');
      }
    } else if (status === Strophe.Status.CONNECTING) {
      console.log('connecting');
    } else {
      if (IMSdk.onLoginFailed !== null) {
        IMSdk.onLoginFailed(status);
      }
      IMSdk.connected = false;

      console.log(status);
    }
  }

  static onMessage(msg) {
    // console.log('onMessage')
    // console.log(msg)
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    var body = '';
    var roomName = '';
    var sendUserName = '';

    if (type === 'chat' && elems.length > 0) { // 私聊
      console.log(Strophe.getText(elems[0]));
      body = elems[0];
      sendUserName = from.substring(0, IMSdk.mJid.indexOf('@'));
      if (IMSdk.onReceivedPrivateMessage !== null) {
        IMSdk.onReceivedPrivateMessage(sendUserName, Strophe.getText(body));
      } else {
        console.log('Strophe onMessage onReceivedPrivateMessage = null');
      }
    } else if (type === 'groupchat' && elems.length > 0) { // 群聊
      console.log(Strophe.getText(elems[0]));
      body = elems[0];
      roomName = from.substring(0, IMSdk.mJid.indexOf('@'));
      sendUserName = from.substring(IMSdk.mJid.lastIndexOf('/'));
      sendUserName = sendUserName.substring(sendUserName.lastIndexOf('/') + 1);
      console.log(sendUserName);
      if (IMSdk.onReceivedRoomMessage !== null) {
       // console.log('rcv groupchar msg: ' + Strophe.getText(body));
       // var msgData = JSON.parse(Strophe.getText(body));
       // console.log('msgdata: ' + msgData);
        IMSdk.onReceivedRoomMessage(roomName, sendUserName, Strophe.getText(body));
      } else {
        console.log('Strophe onMessage onReceivedRoomMessage = null');
      }
    }
    return true;
  }

  static connect(id, pwd, domain, roomDomain) {
    IMSdk.mDomain = domain;
    IMSdk.mRoomDomain = roomDomain;
    console.log(id);
    if (id === null) {
      IMSdk.mJid = 'xxx';
    } else {
      IMSdk.mJid = id + '@' + IMSdk.mDomain;
    }

    console.log('Strophe connect mDomain = ' + IMSdk.mDomain);
    console.log('Strophe connect mRoomDomain = ' + IMSdk.mRoomDomain);
    console.log('Strophe connect mJid = ' + IMSdk.mJid);
    console.log('Strophe connect serverUrl = ' + IMSdk.serverUrl);
    IMSdk.connection = new Strophe.Connection(IMSdk.serverUrl);
    IMSdk.connection.connect(IMSdk.mJid, pwd, IMSdk.onConnect, null, null, null, null);
  }

  static disconnect() {
    IMSdk.connection.disconnect('User exits');
  }

  static createRoom(roomID) {
    var roomJid = roomID + '@' + IMSdk.mRoomDomain;

    // 创建一个<message>元素并发送
    var msg = new Strophe.Builder('presence', {
      to: roomJid + '/' + IMSdk.mJid.substring(0, IMSdk.mJid.indexOf('@')),
      from: IMSdk.mJid
    }).c('x', {'xmlns': 'http://jabber.org/protocol/muc'});
    IMSdk.connection.send(msg.tree());

    msg = new Strophe.Builder('iq', {
      to: roomJid + '/' + IMSdk.mJid.substring(0, IMSdk.mJid.indexOf('@')),
      from: IMSdk.mJid,
      type: 'set'
    }).c('query', {'xmlns': 'http://jabber.org/protocol/muc#owner'})
    .c('x', {'xmlns': 'jabber:x:data', 'type': 'submit'});
    IMSdk.connection.send(msg.tree());
  }

  static joinRoom(roomID) {
    // 发送<presence>元素，加入房间
    var roomJid = roomID + '@' + IMSdk.mRoomDomain;
    console.log('joinRoom   roomJid = ' + roomJid);
    var msg = new Strophe.Builder('presence', {
      from: IMSdk.mJid,
      to: roomJid + '/' + IMSdk.mJid.substring(0, IMSdk.mJid.indexOf('@'))
    }).c('x', {xmlns: 'http://jabber.org/protocol/muc'}).tree();
    console.log(msg);
    IMSdk.connection.send(msg);
  }

  static exitRoom(roomID) {
    // 发送<presence>元素，离开房间
    var roomJid = roomID + '@' + IMSdk.mRoomDomain;
    IMSdk.connection.send(new Strophe.Builder('presence', {
      from: IMSdk.mJid,
      to: roomJid + '/' + IMSdk.mJid.substring(0, IMSdk.mJid.indexOf('@')),
      type: 'unavailable'
    }).tree());
  }

  static sendPrivateMessage(toUserId, m) {
    var msg = new Strophe.Builder('message', {
      to: toUserId + '@' + IMSdk.mDomain,
      from: IMSdk.mJid,
      type: 'chat'
    }).c('body', null, m);
    IMSdk.connection.send(msg.tree());
  }
  static sendRoomMessage(toRoomId, m) {
    var roomJid = toRoomId + '@' + IMSdk.mRoomDomain;

    var msg = new Strophe.Builder('message', {
      to: roomJid,
      from: IMSdk.mJid,
      type: 'groupchat'
    }).c('body', null, m);
    IMSdk.connection.send(msg.tree());
  }
}
export default IMSdk;
