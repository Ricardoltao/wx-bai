// pages/oneself/oneself.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:null,
    nickName:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    this.setData({
      avatarUrl:app.globalData.userInfo.avatarUrl,
      nickName:app.globalData.userInfo.nickName
    })
  },

  clickBook:function(){
    wx.switchTab({
      url: '../bookshelf/bookshelf',
    })
  },

  clickRecord:function(){
    wx.navigateTo({
      url: './record/record'
    })
  }
})