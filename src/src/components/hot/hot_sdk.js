import fetch from 'isomorphic-fetch';

 class HotSdk {
  static get serverUrl() {
    return this._serverUrl;
  }

  static set serverUrl(url) {
    this._serverUrl = url;
  }

  static getHotList(UserId, Start, Num, callback) {
    let req = {
      'MsgType': 'HotListReq',
      'UserId': UserId,
      'Start': Start,
      'Num': Num
    };

    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(response) {
      console.log('[HOT]- getHotList response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[HOT]- getHotList res a ');
      console.log(data);
      if (callback != null) {
        callback(data.HotList);
      }
    }).catch(function(ex) {
      console.log(ex);
      if (callback != null) {
        callback(null);
      }
    });
  }
 }
export default HotSdk;
