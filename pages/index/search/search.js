// pages/index/search/search.js
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShow: true,
    token: null,
    searchName: '',
    searchStory: '',
    listShow: false,
    historySearch: '',
    hotSearch: '',
    storyName: '巴黎圣母院'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.show();
  },

  //搜索历史和热门搜索
  show: function () {
    let that = this;
    //搜索历史
    wx.request({
      url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/search/look',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        token: app.globalData.token
      }, // 设置请求的 header
      success: function (res) {
        //console.log(res.data)
        that.setData({
          historySearch: res.data
        })
      },
      fail: function () {
        // fail
      },
    })

    //热门搜索
    wx.request({
      url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/search/remen',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res)
        that.setData({
          hotSearch: res.data
        })
      },
      fail: function () {
        // fail
      },
    })
  },

  //点击显示到搜索框
  getStory: function (e) {
    //console.log(e.currentTarget.dataset.storyname)
    this.setData({
      searchName: e.currentTarget.dataset.storyname
    })
  },

  //搜索功能
  searchNameInput: function (e) {
    let name = e.detail.value;
    this.setData({
      searchName: name
    })
    //console.log(this.data.searchName)
  },


  formSubmit: function (e) {
    let that = this;
    //console.log(this.data.searchName)
    //console.log(this.data.storyName)
    let searchName = this.data.searchName || this.data.storyName;
    wx.request({
      url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/search/search',
      data: {
        Storyname: searchName,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        token: app.globalData.token
      }, // 设置请求的 header
      success: function (res) {
        if (res.data != 0) {
          console.log(res.data)
          that.setData({
            searchStory: res.data,
            listShow: true
          })
          that.show();
        } else {
          //console.log('没有你想要的内容')
          wx.showToast({
            title: '没有你想找的内容',
            icon: 'none',
            duration: 1500,
          });
        }
      },
    })
  },

  //删除历史记录
  delete: function () {
    let that = this;
    wx.request({
      url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/search/delAllSearch',
      data: {},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        token: app.globalData.token
      }, // 设置请求的 header
      success: function (res) {
        console.log('删除成功')
        that.show();
      },
      fail: function () {
        // fail
      }
    })
  },

  searchInput: function () {
    this.setData({
      listShow: false
    })
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
  }
})