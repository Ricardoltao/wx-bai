// pages/bookContent/bookContent.js
let util = require('../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zanShow: 'true',
    addShow: 'true',
    status1: 'true',
    status2: 'true',
    status3: 'true',
    status4_1: 'true',
    status4_2: 'true'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      storyName: options.name,
      storyId: options.id
    })
    let id=this.data.storyId;
    var that = this;
    wx.request({
      url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/content/getContent/'+id,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data
        })

      },
      fail: function () {
        // fail
      }
    })

    //获取屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.screenHeight
        })
      }
    })


    var that = this;
    //获取节点宽
    wx.createSelectorQuery().select('.start').boundingClientRect(function (rect) {
      //console.log(rect)
      that.setData({
        startWidth: rect.width
      })
    }).exec()

  },

  onShow: function (options) {
    let name = this.data.storyName;
    let that = this
    //加入书架
    util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/collection/readStory', 'GET', app.globalData.token, res => {
      this.setData({
        listBook: res.data
      })
      for (let i = 0; i < this.data.listBook.length; i++) {
        if (this.data.listBook[i].name == name) {
          that.setData({
            addShow: false
          })
        }
      }
      //console.log(this.data.listBook)
    })
    //点赞
    util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/parise/readStory', 'GET', app.globalData.token, res => {
      //console.log(res)
      this.setData({
        listPraise: res.data
      })
      for (let i = 0; i < this.data.listPraise.length; i++) {
        if (this.data.listPraise[i].name == name) {
          that.setData({
            zanShow: false
          })
        }
      }
    })


  },

  //点击开始
  clickStart: function (e) {
    if (this.data.status1) {
      var a = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease"
      });

      a.translate((this.data.screenWidth - e.currentTarget.offsetLeft - this.data.startWidth - 10), 0).backgroundColor('#dedede').step();
      this.setData({
        move: a.export(),
        //让内容出现
        contentShow1: true,
        clickStatus1: '1'
      })

      this.contentAni('move1_1', 1000)
      this.contentAni('move1_2', 2000)
      this.contentAni('move1_3', 3000, 'selectShow2')
      this.selectAni('show2', 4000)
    }

    this.setData({
      status1: false
    })


  },

  //选择
  select2: function () {
    if (this.data.status2) {
      this.bg('show2', 'contentShow2')
      this.contentAni('move2', 1000, 'selectShow3')
      this.selectAni('show3', 2000)
    }
    this.setData({
      status2: false
    })

  },


  select3: function () {
    if (this.data.status3) {
      this.bg('show3', 'contentShow3')
      this.contentAni('move3', 1000, 'selectShow4_1', 'selectShow4_2')
      this.selectAni('show4', 2000)
    }
    this.setData({
      status3: false
    })


  },

  select4_1: function (e) {
    if (this.data.status4_1) {
      this.bg('show4', 'contentShow4_1')
      this.contentAni('move4', 1000)
      this.setData({
        selectShow4_2: false,
        END: true
      })
      this.selectAni('END', 2000)
    }
    this.setData({
      status4_1: false
    })

  },


  select4_2: function () {
    if (this.data.status4_2) {
      this.bg('show4', 'contentShow4_2')
      this.contentAni('move4', 1000)
      this.setData({
        selectShow4_1: false,
        END: true
      })
      this.selectAni('END', 2000)
    }
    this.setData({
      status4_1: false
    })
  },


  //内容动画
  contentAni: function (move, t, selectShow1, selectShow2) {
    setTimeout(() => {
      var a = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease"
      });

      a.translate(750 / 750 * wx.getSystemInfoSync().windowWidth, 0).step();

      this.setData({
        [move]: a.export()
      })

      if (selectShow1 && selectShow2) {
        this.setData({
          [selectShow2]: true,
          [selectShow1]: true
        })
      } else {
        this.setData({
          [selectShow1]: true
        })
      }
      this.pageScrollToBottom();
    }, t)
  },

  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {

      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom - 50,
        duration: 100
      })
    }).exec()
  },

  //选择框背景颜色变化
  bg: function (show, contentShow) {
    var s = wx.createAnimation({
      duration: 2000,
      timingFunction: "ease"
    })

    s.backgroundColor('#dedede').step();
    this.setData({
      [show]: s.export(),
      [contentShow]: true,
    })
  },

  //选择框动画
  selectAni: function (show, t) {
    setTimeout(() => {
      var b = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease"
      })

      b.opacity(1).step();
      this.setData({
        [show]: b.export(),
      })
    }, t)

  },

  //点赞和加入书架
  clickZan: function () {
    let id = this.data.storyId;
    if (this.data.zanShow) {
      util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/parise/getParise/' + id, 'POST', app.globalData.token, res => {
        console.log('点赞成功');
        this.setData({
          zanShow: false
        })
      })
    } else {
      util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/parise/delParise/' + id, 'DELETE', app.globalData.token, res => {
        console.log('取消点赞');
        this.setData({
          zanShow: true
        })
      })
    }
  },

  clickAdd: function () {
    let id = this.data.storyId;
    if (this.data.addShow) {
      util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/collection/getCollection/' + id, 'POST', app.globalData.token, res => {
        console.log('加入书架');
        this.setData({
          addShow: false
        })
      })
    }

  },

  onShareAppMessage:function(){
    return{
      title:'分享百世通',
      desc:'将有趣的故事分享给好友',
      path:'/pages/login/login'
    }
  }

})