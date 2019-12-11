// pages/oneself/record/record.js
let util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listPraise: '',
    zan: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/parise/readStory', 'GET', app.globalData.token, res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i]['checked'] = false;
      }
      console.log(res.data)
      if (res.data.length > 0) {
        var data = this.groupBy(res.data);
        this.setData({
          listPraise: data,
        })

        console.log(this.data.listPraise)
      }

    })
  },



  groupBy: function (arr) {
    //将时间排序
    if (arr.length != 0) {
      arr.sort(function (a, b) {
        return b.update_time > a.update_time ? 1 : -1;
      })

      var map = {},
        dest = [];
      for (var i = 0; i < arr.length; i++) {
        if (!map[arr[i].update_time]) {
          dest.push({
            time: arr[i].update_time,
            data: [arr[i]]
          });
          map[arr[i].update_time] = arr[i];
        } else {
          for (var j = 0; j < dest.length; j++) {
            if (dest[j].time == arr[i].update_time) {
              dest[j].data.push(arr[i]);
              break;
            }
          }
        }
      }
      return dest;
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

  //管理书架
  management: function () {

    var a = wx.createAnimation({
      duration: '1000',
      timingFunction: "ease"
    })
    a.opacity(1).step();
    this.setData({
      zan: false,
      show: a.export()
    })
  },

  complete: function () {
    var a = wx.createAnimation({
      duration: '500',
      timingFunction: "ease"
    })
    a.opacity(0).step();
    this.setData({
      zan: true,
      show: a.export()
    })
  },

  //选择
  select: function (e) {
    if (this.data.management_book == false) {
      return;
    } else {
      var arr = this.data.listPraise;
      var index = e.currentTarget.dataset.index;
      var sindex = e.currentTarget.dataset.sindex;
      console.log(arr[sindex].data[index].checked)
      arr[sindex].data[index].checked = !arr[sindex].data[index].checked;
      console.log(arr)

      this.setData({
        listPraise: arr
      })
    }
  },

  //取消点赞
  cancel: function () {
    let arr = this.data.listPraise;
    let string;
    let newArr = [],
      arr2 = [],
      arr3 = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].data.length > 1) {
        for (let j = 0; j < arr[i].data.length; j++) {
          newArr.push(arr[i].data[j])
        }
      } else {
        newArr.push(arr[i].data[0])
      }

    }
    console.log(newArr)

    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i].checked == false) {
        arr2.push(newArr[i]);
      } else {
        arr3.push(newArr[i].story_id);
        string = arr3.join(",");
      }
    }
    console.log(1+arr2)

    let that = this;
    wx.request({
      url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/parise/delsomeParise',
      data: {
        story_id: string
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        token: app.globalData.token
      }, // 设置请求的 header
      success: function (res) {
        console.log('取消点赞成功')

      },
      fail: function (res) {
        console.log(res)
      }
    })
    
    if (arr2.length > 0) {
      var data = this.groupBy(arr2);
      console.log(data)
      this.setData({
        listPraise: data,
      })
    }else if(arr2==''){
      this.setData({
        listPraise:''
      })
    }

  },

})