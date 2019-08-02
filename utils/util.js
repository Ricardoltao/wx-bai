//点赞、收藏通过id判断是否被渲染
function pageShow(url,method,listPraise, listBook, fn) {
    wx.request({
        url: url,
        method:method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {'content-type':'application/json'}, // 设置请求的 header
        success: res => {
            //通过id判断是否被渲染
            for (let i = 0; i < res.data.length; i++) {
                for (let j = 0; j < listPraise.length; j++) {
                    if (listPraise[j].story_id == res.data[i].id) {
                        res.data[i]['status'] = true
                        break;
                    } else {
                        res.data[i]['status'] = false
                    }
                }
                for (let k = 0; k < listBook.length; k++) {
                    if (listBook[k].story_id == res.data[i].id) {
                        res.data[i]['bookStatus'] = true
                        break;
                    } else {
                        res.data[i]['bookStatus'] = false
                    }
                }
            }
            fn(res.data)
        },
        fail: () => {
            console.log('获取失败')
        },
    })
}


//获取token令牌
function tokenRequest(url, method, token, succ, fail) {
    wx.request({
        url: url,
        method: method,
        header: {
            token: token
        }, // 设置请求的 header
        success: res => {
            if (succ) succ(res);
        },
        fail: err => {
            if (fail) fail(err);
        }
    })
}



module.exports = {
    pageShow: pageShow,
    tokenRequest: tokenRequest
}