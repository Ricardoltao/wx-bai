// pages/index/inner/inner.js
var util = require('../../../utils/util.js')
let token = wx.getStorageSync('token');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listContent: '',
    listBook: '',
    sortId: 1000,
    dynasty_text: '全部朝代',
    dynasty: '',
    color: true,
    select: false,
    select_: false,
    rotate: false,
    listBook: '',
    listPraise: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    //加入书架
    util.tokenRequest('https://www.lrnjy.club/bst/public/api/v1/collection/readStory', 'GET', app.globalData.token, res => {
      this.setData({
        listBook: res.data
      })
      console.log(this.data.listBook)
    })

    //点赞
    util.tokenRequest('https://www.lrnjy.club/bst/public/api/v1/parise/readStory', 'GET', app.globalData.token, res => {
      this.setData({
        listPraise: res.data
      })
      //页面渲染
      util.pageShow('https://www.lrnjy.club/bst/public/api/v1/story/2', 'POST', this.data.listPraise, this.data.listBook, this.fnSetData)
      console.log(this.data.listPraise)

    })

    wx.request({
      url: 'https://www.lrnjy.club/bst/public/api/v1/dynasty/sendDynasty',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log('fangwen');
        console.log(res.data);
        that.setData({
          dynasty:res.data
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

  },

  onShow: function () {

  },

  fnSetData: function (data) {
    var that = this;
    that.setData({
      listContent: data
    })
  },

  clickSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  /* 长按收藏点赞 */
  longPress: function (e) {
    let index = e.currentTarget.dataset.index;
    let listAnimation = `listContent[${index}].animation`;
    let icon = `listContent[${index}].icon`;
    let shadow = `listContent[${index}].shadow`
    let animation = wx.createAnimation({})
    animation.opacity(0.5).step();
    this.setData({
      [listAnimation]: animation.export(),
      [icon]: 'block',
      [shadow]: '5px 5px 5px rgba(0,0,0,.5)'
    })

  },

  clearLongpress: function (e) {
    let length = this.data.listContent.length;
    for (let index = 0; index < length; index++) {
      let icon = `listContent[${index}].icon`
      let shadow = `listContent[${index}].shadow`
      this.setData({
        bg: 'opacity:0',
        [icon]: 'none',
        [shadow]: 'none'
      })
    }
  },

  /* 点击选择 */
  click_dynasty: function () {
    this.setData({
      color: true,
      color1: false,
      color2: false,
      color3: false,
      select: false,
      select_: !this.data.select_,
      rotate: false,
    })
  },

  select_dy: function (e) {
    var text = e.currentTarget.dataset.text;
    var id = e.currentTarget.dataset.id;
    var that = this;
    //页面渲染
    util.pageShow('https://www.lrnjy.club/bst/public/api/v1/story/' + id, 'POST', this.data.listPraise, this.data.listBook, this.fnSetData);
    that.setData({
      dynasty_text: text,
      select_: false,
      sortId: id
    })
  },

  click_year: function () {
    this.setData({
      color: false,
      color1: false,
      color2: true,
      color3: false,
      select: !this.data.select,
      rotate: true,
      select_: false
    })
  },

  //升序排列
  select_asc: function (e) {
    console.log(e.currentTarget.dataset)
    var sortId = e.currentTarget.dataset.id;
    util.pageShow('https://www.lrnjy.club/bst/public/api/v1/story/asc/' + sortId, 'POST', this.data.listPraise, this.data.listBook, this.fnSetData);
    this.setData({
      select: false,
      rotate: false
    })
  },

  //降序排列
  select_desc: function (e) {
    console.log(e.currentTarget.dataset)
    var sortId = e.currentTarget.dataset.id;
    util.pageShow('https://www.lrnjy.club/bst/public/api/v1/story/desc/' + sortId, 'POST', this.data.listPraise, this.data.listBook, this.fnSetData);
    this.setData({
      select: false,
      rotate: false
    })
  },

  //最新
  click_new: function () {
    util.pageShow('https://www.lrnjy.club/bst/public/api/v1/story/newest', 'GET', this.data.listPraise, this.data.listBook, this.fnSetData);
    this.setData({
      color: false,
      color1: false,
      color2: false,
      color3: true,
      select: false,
      rotate: false,
      select_: false
    })
  },

  //点赞功能
  clickZan: function (e) {
    let index = e.currentTarget.dataset.index;
    let zan = `listContent[${index}].status`
    //console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id;
    //console.log(zan)
    let that = this;
    if (!this.data.listContent[index].status) {
      util.tokenRequest('https://www.lrnjy.club/bst/public/api/v1/parise/getParise/' + id, 'POST', token, res => {
        console.log('点赞成功');
        wx.showToast({
          title: '点赞成功',
          icon: 'success',
          duration: 1000,
        });
        that.setData({
          [zan]: true
        })
      })
    } else {
      util.tokenRequest('https://www.lrnjy.club/bst/public/api/v1/parise/delParise/' + id, 'DELETE', token, res => {
        console.log('取消点赞');
        wx.showToast({
          title: '取消点赞',
          icon: 'none',
          duration: 1000,
        });
        that.setData({
          [zan]: false
        })
      })
    }
  },

  //加入书架功能
  addBook: function (e) {
    let index = e.currentTarget.dataset.index;
    let book = `listContent[${index}].bookStatus`
    //console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id;
    let that = this;
    if (!this.data.listContent[index].bookStatus) {
      util.tokenRequest('https://www.lrnjy.club/bst/public/api/v1/collection/getCollection/' + id, 'POST', token, res => {
        console.log('加入书架');
        wx.showToast({
          title: '加入书架',
          icon: 'success',
          duration: 1000,
        });
        that.setData({
          [book]: true
        })
      })
    }
  },

  //故事跳转
  toStory: function (e) {
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    if (name == '大雁塔' || name == '天安门' || name == '秦始皇兵马俑') {
      wx.navigateTo({
        url: '../../bookContent/bookContent?name=' + name + '&&id=' + id,
      })
    } else {
      wx.showToast({
        title: '还没有添加内容哦',
        icon: 'none'
      })
    }
  },

})