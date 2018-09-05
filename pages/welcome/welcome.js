var app = getApp();
Page({
    data: {
        showPage:false,
        hasInfo: false
    },
    onLoad: function () {
        // wx.showLoading({
        //     title: '正在加载...',
        // })
        // var userInfo = wx.BaaS.storage.get('userinfo');
        // console.log(userInfo)
        // if (userInfo){
        //     this.setData({
        //         hasInfo:true,
        //         userInfo: userInfo
        //     })
        //     app.globalData.g_userInfo = userInfo;
        // }
        this.getInfo();
    },
    getInfo: function () {
        var self = this;
        var userInfo = wx.BaaS.storage.get('userinfo');
        if (userInfo) {
            app.globalData.g_userInfo = userInfo;
            wx.switchTab({
                url: "../posts/post"
            })
        }else{
            wx.hideLoading();
            this.setData({
                showPage: true
            })
        }
    },
    userInfoHandler(data) {
        wx.showLoading({
            title: '加载中...',
        })
        this.setData({
            inLogin:true
        })
        wx.BaaS.handleUserInfo(data).then(res => {
            console.log(res)
            var userInfo = this.progressUserInfo(res);
            this.setData({
                hasInfo: true,
                userInfo: userInfo,
                showPage:true,
                inLogin:false
            });
            wx.hideLoading();
            wx.switchTab({
                url: "../posts/post"
            })
        }, res => {
            this.setData({
                inLogin: false
            });
            wx.hideLoading();
        })
    },
    progressUserInfo:function(res){
        var userInfo = {
            nickName: res.nickName,
            avatarUrl: res.avatarUrl,
            gender: res.gender,
            province: res.province,
            id: res.id,
            city: res.city,
            hasInfo:true
        }
        app.globalData.g_userInfo = userInfo;
        // wx.hideLoading();
        return userInfo;
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: 'test',
            path: '/page/welcome/welcome',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})