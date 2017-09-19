import fetch from 'isomorphic-fetch';

class videoSdk {
  static get serverUrl() {
    return this._serverUrl;
  }

  static set serverUrl(url) {
    this._serverUrl = url;
  }

  static currentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    var day = date.getDate();
    if (day >= 1 && day <= 9) {
      day = '0' + day;
    }
    var hour = date.getHours();
    if (hour >= 1 && hour <= 9) {
      hour = '0' + hour;
    }
    var min = date.getMinutes();
    if (min >= 1 && min <= 9) {
      min = '0' + min;
    }
    var sec = date.getSeconds();
    if (sec >= 1 && sec <= 9) {
      sec = '0' + sec;
    }
    return year + month + day + hour + min + sec;
  }

  static videoUploadAddrReq(userId, callback) {
    let req = {
      'MsgType': 'VideoUploadAddrReq',
      'UserId': userId
    };
    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(res) {
      console.log(res);
      return res.json();
    }).then((a) => {
      console.log(a);
      callback(a.Data);
    }).catch(function(ex) {
      console.log(ex);
      callback(null);
    });
  }

  static updateVideoList(userId, start, num, callback) {
    let req = {
      'MsgType': 'UpdateVideoList',
      'UserId': userId,
      'Start': start,
      'Num': num
    };

    /*
    fetch(this._serverUrl, {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: {JSON.stringify(req)}
      }).then(function(response){
        console.log(res)
        return response.json()
      }).then(function(json) {
        console.log('parsed json', json)
      }).catch(function(ex) {
         console.log('parsing failed', ex)
      })
    )
    */

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
      callback(a.VideoList);
    }).catch(function(ex) {
      console.log(ex);
      callback(null);
    });
  }

  static videoIsVote(userId, videoId, callback) {
    let req = {
      'MsgType': 'VideoIsVote',
      'VUserId': userId,
      'VideoId': videoId
    };

    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function(obj) {
          // 这样数据就转换成json格式的了
          if (obj.IsVote === 0) {
            callback(null, this.IsVote);
          } else {
            callback(null, this.IsVote);
          }
        });
      }
    }).then(function(ex) {
      console.log(ex);
    });
  }

  static voteVideo(userId, videoId, callback) {
    let req = {
      'MsgType': 'VoteVideoNotify',
      'VUserId': userId,
      'VideoId': videoId,
      'Date': videoSdk.currentTime()
    };

    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function(obj) {
          // 这样数据就转换成json格式的了

          callback(obj.ResultCode);
        });
      }
    }).then(function(ex) {
      console.log(ex);
    });
  }

  static unvoteVideo(userId, videoId, callback) {
    let req = {
      'MsgType': 'UnVoteVideoNotify',
      'VUserId': userId,
      'VideoId': videoId,
      'Date': videoSdk.currentTime()
    };

    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function(obj) {
          // 这样数据就转换成json格式的了

          callback(obj.ResultCode);
        });
      }
    }).then(function(ex) {
      console.log(ex);
    });
  }

  static updateVotedVedioList(vUserId, start, num, callback) {
    let req = {
      'MsgType': 'UpdateVoteVideoList',
      'VUserId': vUserId,
      'Start': start,
      'Num': num
    };

    fetch(this._serverUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function(obj) {
          // 这样数据就转换成json格式的了
          callback(obj.ResultCode);
        });
      }
    }).then(function(ex) {
      console.log(ex);
    });
  }
}

export default videoSdk;
