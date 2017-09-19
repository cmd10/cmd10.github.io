import fetch from 'isomorphic-fetch';

class LiveSdk {
  static get serverUrl() {
    return this._serverUrl;
  }

  static set serverUrl(url) {
    this._serverUrl = url;
  }
  // 获取直播列表
  static updateLiveList(userId, start, num, callback) {
    let req = {
      'MsgType': 'GetLiveListReq',
      'Version': '1.0',
      'UserId': userId,
      'CategoryId': '',
      'Start': start,
      'Num': num
    };

    console.log('serverUrl = ' + this._serverUrl);

    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(res) {
      console.log(res);
      return res.json();
    }).then((a) => {
      console.log(a);

      callback(a.LiveList);
    }).catch(function(ex) {
      console.log(ex);

      callback(null);
    });
  }
}
export default LiveSdk;
