// pages/bookshelf/bookshelf.js
let token = wx.getStorageSync('token');
let util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: false,
    f_click: false,
    management_book: false,
    mb_list: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')

  },

  onShow: function () {
    util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/collection/readStory', 'GET', app.globalData.token, res => {
      this.setData({
        mb_list: res.data
      })

      for (let i = 0; i < this.data.mb_list.length; i++) {
        this.data.mb_list[i]['checked'] = false;
      }
      //console.log(this.data.mb_list)
    })
  },

  /* 点击进入搜索页 */
  clickSearch: function () {
    wx.navigateTo({
      url: '../index/search/search'
    })
  },


  complete: function () {
    console.log('完成')
  },

  //管理书架
  management: function () {
    this.setData({
      management_book: true
    })
  },

  finish: function () {
    this.setData({
      management_book: false
    })
  },

  //选择
  select: function (e) {
    if (this.data.management_book == false) {
      return;
    } else {
      var arr = this.data.mb_list;
      var index = e.currentTarget.dataset.id;
      console.log(arr[index].checked)
      arr[index].checked = !arr[index].checked;
      console.log(arr)

      this.setData({
        mb_list: arr
      })
    }
  },

  //删除
  delete: function () {
    let arr = this.data.mb_list;
    let arr2 = [],
      arr3 = [],
      string;
    console.log(arr)
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].checked == false) {
        arr2.push(arr[i]);
      } else {
        arr3.push(arr[i].story_id);
        string = arr3.join(",");
      }
    }

    wx.request({
      url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/collection/delsomeCollection',
      data: {
        story_id: string
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        token: app.globalData.token
      }, // 设置请求的 header
      success: function (res) {
        console.log('从书架中删除成功')
      },
      fail: function (res) {
        console.log(res)
      }
    })
    this.setData({
      mb_list: arr2
    })
    console.log(string)
  },

  //故事跳转
  toStory: function (e) {
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    if (name == '大雁塔' || name == '天安门' || name == '秦始皇兵马俑') {
      wx.navigateTo({
        url: '../bookContent/bookContent?name=' + name + '&&id=' + id,
      })
    } else {
      wx.showToast({
        title: '还没有添加内容哦',
        icon: 'none'
      })
    }
  },

})