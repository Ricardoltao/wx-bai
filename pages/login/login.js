// pages/login/login.js
const app = getApp();
let token = wx.getStorageSync('token');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查看是否授权
    var that = this;
    that.login();
    console.log('LOGIN')
  },

  // onReady:function(){
  //   var that = this;
  //   that.login();
  //   console.log('LOGIN')
  // },


  //登录授权获得code码和token令牌
  login: function () {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              //console.log(app.globalData.userInfo)
              wx.login({
                success: function (res) {
                  // 获取到用户的 code 之后：res.code
                  console.log("用户的code:" + res.code);
                  console.log(res)
                  var code = res.code
                  // wx.request({
                  //   url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/token/user',
                  //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  //   header: {
                  //     'content-type': 'application/x-www-form-urlencoded'
                  //   }, // 设置请求的 header
                  //   data: {
                  //     code: code
                  //   },
                  //   success: function (res) {
                  //     console.log(res)
                  //     console.log('token令牌：' + res.data)
                  //     wx.setStorageSync('token', res.data)
                  //     app.globalData.token = res.data;
                  //     wx.switchTab({
                  //       url: '../index/index',
                  //       success: function (res) {
                  //         console.log('登录成功')
                  //       },
                  //     })
                  //   },
                  //   fail: function () {
                  //     console.log('未获得token')
                  //   },
                  // })
                },
                fail: function (res) {
                  console.log('获取用户信息失败')
                },
              })
            },
            fail: function () {
              // fail
            },
          })
        }
      }
    })

  },

  //点击授权按钮
  bindGetUserInfo: function (e) {

    if (e.detail.userInfo) {
      //用户按了允许按钮
      //console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      this.login();
       
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '你点击了拒绝授权，将无法进入小程序，请授权之后再进入！',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          //用户没有授权成功，不需要改变isHide的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }
})