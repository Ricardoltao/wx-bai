//app.js

App({
  globalData: {
    userInfo: null,
    token: null,
    second: false,
    token: '',

  },
  onLaunch: function () {
    console.log('app加载')
    var that = this;
    // 打开调试
    wx.setEnableDebug({
      enableDebug: true
    })
  },

})