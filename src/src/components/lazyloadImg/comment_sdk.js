// import 'whatwg-fetch'
import fetch from 'isomorphic-fetch';
class CommentSdk {
  static get serverUrl () {
    return this._serverUrl;
  }

  static set serverUrl (url) {
    this._serverUrl = url;
  }

  static uploadVideoComment(FromUserId, FromUserName, Date, VideoId, ToUserId, ToUserName, Comment, callback) {
    let req = {
      'MsgType': 'UploadCommentReq',
      'FromUserId': FromUserId,
      'FromUserName': FromUserName,
      'Date': Date,
      'VideoId': VideoId,
      'ToUserId': ToUserId,
      'ToUserName': ToUserName,
      'Comment': Comment
    };

    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(response) {
      console.log('[AAA]- uploadVideoComment response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- uploadVideoComment res a ');
      console.log(data);
      if (callback !== null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback !== null) {
        callback(null);
      }
    });
  }
  static getCommentCount(VideoId, callback) {
    let req = {
      'MsgType': 'GetCommentCntReq',
      'VideoId': VideoId
    };

    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(response) {
      console.log('[AAA]- getCommentCount response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- getCommentCount res a ');
      console.log(data);
      if (callback !== null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback !== null) {
        callback(null);
      }
    });
  }
  static downloadComment(VideoId, Start, Num, callback) {
    let req = {
      'MsgType': 'DownloadCommentReq',
      'VideoId': VideoId,
      'Start': Start,
      'Num': Num
    };

    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(response) {
      console.log('[AAA]- downloadComment response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- downloadComment res a ');
      console.log(data);

      if (callback !== null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);
      if (callback !== null) {
        callback(null);
      }
    });
  }
}
export default CommentSdk;
