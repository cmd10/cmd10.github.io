import fetch from 'isomorphic-fetch';
import crypto from 'crypto';
  /* let crypto;
  try {
    crypto = require('crypto');
  } catch (err) {
    console.log('crypto support is disabled!');
  } */
  // const curves = crypto.getCiphers();
  // console.log(curves);
  // const ciphers = crypto.listCiphers();
  // console.log(ciphers);
  // console.log(crypto);
  // var crypto = require('crypto');
  // console.log(crypto.getCiphers());
  // console.log(crypto.listCiphers());
  function md5 (text) {
    return crypto.createHash('md5').update(text).digest('hex');
  }
  function desEde(param) {
    var key = Buffer.from(param.key);
    var iv = Buffer.from(param.iv ? param.iv : '');
    var plaintext = param.plaintext;
    var alg = param.alg;
    var autoPad = param.autoPad;

    // encrypt
    var cipher = crypto.createCipheriv(alg, key, iv);
    cipher.setAutoPadding(autoPad); // default true
    var ciph = cipher.update(plaintext, 'utf8', 'hex');
    ciph += cipher.final('hex');
    return ciph;
    // decrypt
    // var decipher = crypto.createDecipheriv(alg, key, iv);
    // cipher.setAutoPadding(autoPad)
    // var txt = decipher.update(ciph, 'hex', 'utf8');
    // txt += decipher.final('utf8');
    // assert.equal(txt, plaintext, 'fail');
  }

  function encryptRawPassword(rawPassword) {
     if (rawPassword == null) {
        return null;
     }

    var firstMD5Password = md5(rawPassword);
    var trimmedPassword = firstMD5Password.substring(0, 10) + firstMD5Password.substring(13);
    var secondMD5Password = md5(trimmedPassword);
    if (secondMD5Password.length > 24) {
      return secondMD5Password.substring(0, 24);
    } else {
      return secondMD5Password;
    }
  }

  function randomString(len) {
    var length = len || 8;
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < length; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  function getAuthenticator(userId, captcha) {
     var result = '';
     result += randomString() + '$';
     result += captcha || '' + '$';
     result += userId + '$';
     result += 'web_version' + '$';// deviceId
     result += '' + '$';// IP
     result += '' + '$';// MAC
     result += '' + '$';//
     result += 'CTC' + '$';//
     result += '6' + '$';// TerminalType
     return result;
  }

  function encrypt(text, originalPassword) {
    if (originalPassword === null) {
      originalPassword = '';
    }
    var newpassword = encryptRawPassword(originalPassword);

    if (newpassword.length > 24) {
      newpassword = newpassword.substring(0, 24);
    }

    for (var i = newpassword.length; i < 24; i++) {
      newpassword += '0';
    }
    var encResult = desEde({alg: 'des-ede3', // 3des-ecb
                  autoPad: true,
                  key: newpassword,
                  plaintext: text,
                  iv: null });
      console.log(encResult);

    return encResult;
  }

  function timeString() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMin = date.getMinutes();
    var strSec = date.getSeconds();

    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    if (strHour >= 0 && strHour <= 9) {
        strHour = '0' + strHour;
    }
    if (strMin >= 0 && strMin <= 9) {
        strMin = '0' + strMin;
    }
    if (strSec >= 0 && strSec <= 9) {
        strSec = '0' + strSec;
    }
    var currentdate = date.getFullYear() + month + strDate +
      strHour + strMin + strSec;
    return currentdate;
  }

  function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  }

  class AAASdk {
    static get serverUrl() {
    return this._serverUrl;
    }

    static set serverUrl(url) {
    this._serverUrl = url;
    }

    /**
     * 获取验证码
     * @param scene 验证码用途,取值可为: "login","regist","forget_password"
     * @param bindingType 验证码类型 取值: 1-手机, 2-邮件
     * @param bindingNo 手机号码或者邮箱地址
     * @param region 国家或地区，如中国大陆：86，手机发送验证码使用
     * @return
     */
  static getCaptcha(scene, bindingType, bindingNo, region, callback) {
    console.log('[AAA]- getCaptcha');
    fetch(this._serverUrl + '/captcha/' + scene + '/refresh?bindingType=' + bindingType + '&bindingNo=' + bindingNo + '&region=' + region, {
      method: 'GET'
    }).then(function(response) {
      console.log('[AAA]- getCaptcha response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- getCaptcha res a ');
      console.log(data);
      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);
      if (callback != null) {
        callback(null);
      }
    });
  }

    /**
     * 唯一性校验
     * @param type 校验类型 : "phone","email","nickname"
     * @param value 邮箱地址/手机号码/昵称
     * @return
     */
  static uniquenessCheck(type, value, callback) {
    console.log('[AAA]- uniquenessCheck');
    fetch(this._serverUrl + '/user/verify/' + type + '/' + value, {
      method: 'GET',
      mode: 'cors'
    }).then(function(response) {
      console.log('[AAA]- uniquenessCheck response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- uniquenessCheck res a ');
      console.log(data);

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
  }
    /**
     * 注册用户接口
     * @param bindingType 挑战字发送目标：1-手机, 2-邮件
     * @param bindingNo 手机号码、邮箱
     * @param captcha 手机或者邮箱验证码
     * @param nickname 昵称
     * @param password 密码
     * @param callback 回调
     */
  static userReg(nickname, pw, bindingType, bindingNo, captcha, callback) {
    pw = encryptRawPassword(pw);
    console.log('userReg  encryptRawPassword = ' + pw);
    let req = {
      'nickname': nickname,
      'password': pw,
      'bindingType': bindingType,
      'bindingNo': bindingNo,
      'captcha': captcha
    };

    fetch(this._serverUrl + '/user/register', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(response) {
      console.log('[AAA]- userReg response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- userReg res a ');
      console.log(data);

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
  }

    /**
     * 用户登录接口
     * @param pw 密码
     * @param userId 用户名/手机/邮箱
     * @param callback 结果返回回调
     */
  static userLogin(userId, pw, callback) {
    console.log('userLogin: ' + userId + ':' + pw);
    var encPw = encrypt(getAuthenticator(userId), pw);
    let req = {
      'userId': userId,
      'password': encPw
    };
    let header = {
      'Token': '',
      'Terminal-Type': '6',
      'Device-Id': 'web_version',
      'Timestamp': timeString(),
      'Timezone-Offset': '',
      'Random': randomString(),
      'Service-Id': 'fonsview',
      'Hmac': '',
      'Access-Control-Request-Headers': 'Token,Terminal-Type,Device-Id,Timestamp,Timezone-Offset,Random,Service-Id,Hmac'
    };

    fetch(this._serverUrl + '/user/login', {
      headers: header,
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req)
    }).then(function(response) {
      console.log('[AAA]- userLogin response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- userLogin res a ');
      console.log(data);

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
  }

    /**
     * 更新令牌接口
     *
     * @param userToken
     * @param userId 用户ID
     * @param callback
     */
  static updateUserToken(userId, userToken, callback) {
    let req = {
      'userId': userId
    };
    let header = {
      'Token': userToken,
      'Terminal-Type': '6',
      'Device-Id': 'web_version',
      'Timestamp': timeString(),
      'Timezone-Offset': '',
      'Random': randomString(),
      'Service-Id': 'fonsview',
      'Hmac': '',
      'Access-Control-Request-Headers': 'Token,Terminal-Type,Device-Id,Timestamp,Timezone-Offset,Random,Service-Id,Hmac'
    };

    fetch(this._serverUrl + '/usertoken/refresh', {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(req),
      headers: header
    }).then(function(response) {
      console.log('[AAA]- updateUserToken response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- updateUserToken res a ');
      console.log(data);

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
  }

    /**
     * 获取用户信息
     * @param userToken token字串
     * @param callback
     */
  static getUserInfo(userToken, callback) {
    let header = {
      'Token': userToken,
      'Terminal-Type': '6',
      'Device-Id': 'web_version',
      'Timestamp': timeString(),
      'Timezone-Offset': '',
      'Random': randomString(),
      'Service-Id': 'fonsview',
      'Hmac': '',
      'Access-Control-Request-Headers': 'Token,Terminal-Type,Device-Id,Timestamp,Timezone-Offset,Random,Service-Id,Hmac'
    };

    fetch(this._serverUrl + '/user/info', {
      method: 'GET',
      mode: 'cors',
      headers: header
    }).then(function(response) {
      console.log('[AAA]- getUserInfo response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- getUserInfo res a ');
      console.log(data);
      // console.log(data.body.toJSON());

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
  }

    /**
     * 用户有效性校验
     *
     * @param userId
     * @param userToken
     * @param callback
     */
  static tokenVerify(userId, userToken, callback) {
    let header = {
      'Token': userToken,
      'Terminal-Type': '6',
      'Device-Id': 'web_version',
      'Timestamp': timeString(),
      'Timezone-Offset': '',
      'Random': randomString(),
      'Service-Id': 'fonsview',
      'Hmac': '',
      'Access-Control-Request-Headers': 'Token,Terminal-Type,Device-Id,Timestamp,Timezone-Offset,Random,Service-Id,Hmac'
    };

    fetch(this._serverUrl + '/token/verify/' + userId + '/' + userToken, {
      method: 'GET',
      mode: 'cors',
      headers: header
    }).then(function(response) {
      console.log('[AAA]- getUserInfo response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- getUserInfo res a');
      console.log(data);

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
  }

    /**
     * 获取其他用户信息
     * @param userIds 需要获取信息的用户id
     * @param callback
     */
  static getOtherUserInfo(userIdList, callback) {
    console.log('getOtherUserInfo : ');
    // console.log(userIdList);
    if (isArray(userIdList) === false) {
      callback(new Error(' error : userIdList is not an arrary'));
      console.log(' error : userIdList is not an arrary');
    }

    if (userIdList.length === 0) {
      callback(new Error(' error : userIdList is empty'));
      console.log(' error : userIdList is empty');
    }
    let req = {
      'dataType': '',
      'userIdList': [

      ]
    };
    for (var j = 0; userIdList[j] != null; j++) {
      let user = {'userId': userIdList[j]};
      req.userIdList.push(user);
    }
    let header = {
      'Token': '',
      'Terminal-Type': '6',
      'Device-Id': 'web_version',
      'Timestamp': timeString(),
      'Timezone-Offset': '',
      'Random': randomString(),
      'Service-Id': 'fonsview',
      'Hmac': '',
      'Access-Control-Request-Headers': 'Token,Terminal-Type,Device-Id,Timestamp,Timezone-Offset,Random,Service-Id,Hmac'
    };

    fetch(this._serverUrl + '/otheruser/info', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req),
      headers: header
    }).then(function(response) {
      console.log('[AAA]- getUserInfo response');
      console.log(response);
      return response.json();
    }).then((data) => {
      // console.log('[AAA]- getUserInfo res a ');
      // console.log(data);

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
 }

    /**
     * 修改密码接口
     *
     * @param userToken 业务管理平台为该用户分配的身份证明
     * @param bindingType 挑战字发送目标：    1-手机     2-邮箱
     * @param bindingNo 手机号码、邮箱
     * @param newPwd 新密码
     * @param oldPwd 旧密码
     * @param callback
     */
  static modifyPassword(userToken, oldPwd, newPwd, bindingType, bindingNo, callback) {
    let req = {
      'bindingNo': bindingNo,
      'bindingType': bindingType,
      'oldPwd': encryptRawPassword(oldPwd),
      'newPwd': encryptRawPassword(newPwd)
    };
    let header = {
      'Token': userToken,
      'Terminal-Type': '6',
      'Device-Id': 'web_version',
      'Timestamp': timeString(),
      'Timezone-Offset': '',
      'Random': randomString(),
      'Service-Id': 'fonsview',
      'Hmac': '',
      'Access-Control-Request-Headers': 'Token,Terminal-Type,Device-Id,Timestamp,Timezone-Offset,Random,Service-Id,Hmac'
    };

    fetch(this._serverUrl + '/user/modify/password', {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(req),
      headers: header
    }).then(function(response) {
      console.log('[AAA]- modifyPassword response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- modifyPassword res a ');
      console.log(data);

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
  }
    /**
     * 修改用户信息
     *
     * @param token token字串
     * @param nickname 昵称
     * @param birthday 出生日期 : "2001-02-03"
     * @param gender 0-男; 1-女
     * @param telephone 手机号码
     * @param email 邮箱地址
     * @param icon 图片的base64 String
     * @param callback
     */
    static modifyUserInfo(userToken, nickname, firstName, middleName, lastName, birthday, gender, telephone, email, icon, callback) {
    let req = {
      'nickname': nickname,
      'firstName': firstName,
      'middleName': middleName,
      'lastName': lastName,
      'birthday': birthday,
      'gender': gender,
      'telephone': telephone,
      'email': email,
      'icon': icon
    };
    let header = {
      'Token': userToken,
      'Terminal-Type': '6',
      'Device-Id': 'web_version',
      'Timestamp': timeString(),
      'Timezone-Offset': '',
      'Random': randomString(),
      'Service-Id': 'fonsview',
      'Hmac': '',
      'Access-Control-Request-Headers': 'Token,Terminal-Type,Device-Id,Timestamp,Timezone-Offset,Random,Service-Id,Hmac'
    };

    fetch(this._serverUrl + '/user/modify/info', {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(req),
      headers: header
    }).then(function(response) {
      console.log('[AAA]- modifyUserInfo response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- modifyUserInfo res a ');
      console.log(data);

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
  }

    /**
     * 忘记密码接口
     *
     * @param bindingType 挑战字发送目标：    1、手机     2、邮箱
     * @param bindingNo 手机号码、邮箱
     * @param captcha 验证码
     * @param callback
     */

  static forgetPassword(captcha, bindingType, bindingNo, callback) {
    let req = {
      'bindingNo': bindingNo,
      'bindingType': bindingType,
      'captcha': captcha

    };
    let header = {
      'Token': '',
      'Terminal-Type': '6',
      'Device-Id': 'web_version',
      'Timestamp': timeString(),
      'Timezone-Offset': '',
      'Random': randomString(),
      'Service-Id': 'fonsview',
      'Hmac': '',
      'Access-Control-Request-Headers': 'Token,Terminal-Type,Device-Id,Timestamp,Timezone-Offset,Random,Service-Id,Hmac'
    };

    fetch(this._serverUrl + '/user/forget/password', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(req),
      headers: header
    }).then(function(response) {
      console.log('[AAA]- forgetPassword response');
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log('[AAA]- forgetPassword res a ');
      console.log(data);

      if (callback != null) {
        callback(data);
      }
    }).catch(function(ex) {
      console.log(ex);

      if (callback != null) {
        callback(null);
      }
    });
  }
  }
 export default AAASdk;
