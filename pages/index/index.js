//index.js
const app = getApp();
var QQMapWx = require('../../utils/qqmap-wx-jssdk');
var util = require('../../utils/util.js')
var qqmapsdk = new QQMapWx({
    key: 'XVHBZ-TYW65-QU6IB-QCBFP-PM6I3-UUFF4'
});

let token = wx.getStorageSync('token')
Page({
    data: {
        isHide: false,
        city: '获取定位',
        latitude: '',
        longitude: '',
        bannerPath: null,
        listContent: null,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false,
        listPraise: '',
        listBook: ''
    },


    onLoad: function () {

        //轮播图
        wx.request({
          url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/banner/1',
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            success: res => {
                console.log(res)
                this.setData({
                    bannerPath: res.data.items
                })
            },
            fail: () => {
                console.log('获取失败')
            },
            complete: function () {
                // complete
            }
        })


        //古今
        wx.request({
            url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/chinese/getChinese',
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: res => {
                //console.log(res.data)
                this.setData({
                    getChinese: res.data.img.url
                })
            },
            fail: () => {
                console.log('获取失败')
            },
            complete: function () {
                // complete
            }
        })
        //中外
        wx.request({
            url: 'https://www.lrnjy.club/bst/public/index.php/api/v1/english/getEnglish',
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: res => {
                //console.log(res.data)
                this.setData({
                    getEnglish: res.data.img.url
                })
            },
            fail: () => {
                console.log('获取失败')
            },
            complete: function () {
                // complete
            }
        })
    },

    fnSetData: function (data) {
        var that = this;
        that.setData({
            listContent: data,
        })
    },

    onShow: function () {
        var that = this;

        that.getUserLocation();
        console.log('1.index----' + app.globalData.token)
        //加入书架
        util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/collection/readStory', 'GET', app.globalData.token, res => {
            this.setData({
                listBook: res.data
            })
            console.log('加入书架:')
            console.log(this.data.listBook)
        }, err => {
            console.log(err)
        })

        //点赞
        util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/parise/readStory', 'GET', app.globalData.token, res => {
            console.log(res)
            this.setData({
                listPraise: res.data
            })
            //页面渲染
            util.pageShow('https://www.lrnjy.club/bst/public/index.php/api/v1/story/getStoryImg', 'GET', this.data.listPraise, this.data.listBook, this.fnSetData)
            //console.log(this.data.listPraise)
            
        })
    },

    /* 点击获得地理位置 */
    getLoc: function (e) {
        var that = this;
        this.getUserLocation();
        console.log(e)
    },


    getUserLocation: function () {
        let that = this;
        wx.getSetting({
            success: res => {
                /* console.log(JSON.stringify(res)) */
                // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
                // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
                // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    /* 未授权  */
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: res => {
                            /* console.log(res); */
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                //确认授权，通过wx.openSetting发起授权请求
                                wx.openSetting({
                                    success: res => {
                                        if (res.authSetting['scope.userLocation'] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用wx.getLocation的API
                                            that.getLocation();
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //调用wx.getLocation的API
                    that.getLocation();
                } else {
                    //调用wx.getLocation的API
                    that.getLocation();
                }
            }
        })
    },

    /* 获取经纬度 */
    getLocation: function () {
        let that = this;
        wx.getLocation({
            type: 'wgs84',
            success: res => {
                /* console.log(JSON.stringify(res)); */
                let latitude = res.latitude;
                let longitude = res.longitude;
                this.getLocal(latitude, longitude);
            },
            fail: function (res) {
                console.log('fail' + JSON.stringify(res));
            }
        })
    },

    /* 获取当前地理位置 */
    getLocal: function (latitude, longitude) {
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
            success: res => {
                /* console.log(res); */
                let province = res.result.ad_info.province;
                let city = res.result.ad_info.city;
                this.setData({
                    city: province + city,
                })
            },
            fail: function (res) {
                /* console.log(res); */
            },
        })
    },


    /* 点击进入搜索页 */
    clickSearch: function () {
        wx.navigateTo({
            url: 'search/search'
        })
    },

    //长按点赞收藏 
    longPress: function (e) {
        let index = e.currentTarget.dataset.index;
        let listAnimation = `listContent[${index}].animation`;
        let icon = `listContent[${index}].icon`;
        let shadow = `listContent[${index}].shadow`;
        //let zanShow=`listContent[${index}].zanShow`;

        let animation = wx.createAnimation({})
        animation.opacity(0.5).step();
        this.setData({
            [listAnimation]: animation.export(),
            [icon]: 'block',
            [shadow]: '5px 5px 5px rgba(0,0,0,.5)',
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

    //点赞功能
    clickZan: function (e) {
        let index = e.currentTarget.dataset.index;
        let zan = `listContent[${index}].status`
        //console.log(e.currentTarget.dataset.id)
        let id = e.currentTarget.dataset.id;
        //console.log(zan)
        let that = this;
        if (!this.data.listContent[index].status) {
            util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/parise/getParise/' + id, 'POST', token, res => {
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
            util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/parise/delParise/' + id, 'DELETE', token, res => {
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
            util.tokenRequest('https://www.lrnjy.club/bst/public/index.php/api/v1/collection/getCollection/' + id, 'POST', token, res => {
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

    /* 古今点击跳转 */
    inner_click: function () {
        wx.navigateTo({
            url: 'inner/inner',
        })
    },
    
    //故事跳转
    toStory:function(e){
        let name=e.currentTarget.dataset.name;
        let id=e.currentTarget.dataset.id;
        if(name=='大雁塔'||name=='天安门'||name=='秦始皇兵马俑'){
            wx.navigateTo({
                url: '../bookContent/bookContent?name='+name+'&&id='+id,
            })
        }else{
            wx.showToast({
                title:'还没有添加内容哦',
                icon:'none'
            })
        }
    },

    //跳转到个人中心
    toOneself:function(){
        console.log('a')
        wx.switchTab({
            url: '../oneself/oneself',
        })
    },

    onShareAppMessage:function(){
        return {
            title: '转发百世通',
            path: '/page/index/index'
          }
    }


})