// pages/mine/mine/mine.js
var app = getApp();
var util = require("../../utils/util.js")
Page({
    data: {
        userInfo: {},
        settingOptions: [{
            title: "我的收藏",
            titleImg: "/images/mine/collection.png",
            url: "/pages/mine/mine-collection/mine-collection"
        }, 
        // {
        //     title: "设置",
        //     titleImg: "/images/mine/setting.png",
        //     url: "/pages/mine/mine-setting/mine-setting"
        // }, 
        {
            title: "关于",
            titleImg: "/images/mine/question.png",
            url: "/pages/mine/mine-about/mine-about"
        }]
    },
    onLoad: function () {
        wx.showLoading({
            title: '加载中...',
        })
        var settingOptions = this.data.settingOptions;
        var userInfo = app.globalData.g_userInfo;
        this.setData({
            userInfo: userInfo,
            settingOptions: settingOptions
        })
        wx.hideLoading();
    },
    onDetailTap: function (event){
        var url = event.currentTarget.dataset.url;
        var title = event.currentTarget.dataset.title;
        wx.navigateTo({
            url:url+"?title="+title
        })
    }
})