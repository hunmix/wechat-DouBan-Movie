var app = getApp();
Page({
    data: {
        showPage:false,
        hasInfo: false
    },
    onLoad: function () {
        wx.showLoading({
            title: '正在加载...',
        })
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
    onTap: function () {
        wx.switchTab({
            url: "../posts/post"
        })
        // wx.request({
        //     method:"GET",
        //     url: "https://douban.uieee.com/v2/movie/subject/26640371/comments",
        //     success:function(res){
        //         console.log(res.data)
        //     }
        // })
        // wx.navigateTo({
        //     url: "../posts/post"
        // })

        // wx.redirectTo({
        //     url: "../posts/post"
        // })
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
        this.setData({
            inLogin:true
        })
        wx.BaaS.handleUserInfo(data).then(res => {
            wx.showLoading({
                title: '加载中...',
            })
            var userInfo = this.progressUserInfo(res);
            this.setData({
                hasInfo: true,
                userInfo: userInfo,
                showPage:true,
                inLogin:false
            });
            wx.hideLoading();
        }, res => {
            this.setData({
                inLogin: false
            });
        })
    },
// getInfo: function () {
//     var self = this;
//     wx.getUserInfo({
//         success: function (res) {
//             wx.showLoading({
//                 title: '加载中',
//             })
//             var info = res.userInfo;
//             var userInfo = {
//                 nickName: info.nickName,
//                 avatarUrl: info.avatarUrl,
//                 gender: info.gender,
//                 province: info.province,
//                 city: info.city,
//                 hasInfo:true
//             }
//             self.setData(userInfo);
//             wx.hideLoading();
//             app.globalData.g_userInfo = userInfo;
//         },
//         fail:function(){
//             self.showModal();
//         }
//     })  
// },
// *********************************************
// showModal: function () {
//         var self = this;
//         wx.showModal({
//             title: '获取授权',
//             content: '请开始授权使用公开信息',
//             success: function (res) {
//                 if (res.confirm) {
//                     self.openSetting();
//                 } else if (res.cancel) {
//                     self.showModal()
//                 }
//             }
//         })
//     },
//     openSetting: function () {
//         var self = this;
//         wx.openSetting({
//             success: (res) => {
//                 if (res.authSetting["scope.userInfo"] == true) {
//                     self.getInfo();
//                 } else {
//                     self.showModal();
//                 }
//             }
//         })
//     },
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
        wx.hideLoading();
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