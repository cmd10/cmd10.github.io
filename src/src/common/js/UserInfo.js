function UserInfo() {
  this.id = 'xxx';
  this.nickName = '未登录';
  this.photoUrl = require('../../assets/photo.png');
  this.birthday = new Date();
  this.firstName = '';
  this.lastName = '';
  this.gender = 0;
  this.middleName = '';
  this.paymentType = 1;
  this.status = 1;
  this.telephone = '';
  this.userToken = '';
}
export const userInfo = new UserInfo();
