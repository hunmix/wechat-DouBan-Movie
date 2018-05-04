// pages/posts/post.js
var postsData = require('../../data/posts-data.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        postData: {},
        isLoading:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            isLoading: true
        })
        this.setPostData();
        // var articleTable = new wx.BaaS.TableObject(articleTableId);
        // articleTable.limit(10).offset(0).find().then(res => {
        //     var postData = util.progressArticleData(res);
        //     self.setData({
        //         postData: postData,
        //         isLoading: false
        //     });
        //     app.globalData.g_totalArticlesData = postData;
        //     self.data.postData = postData;
        // })
    },
    setPostData: function () {
        wx.showNavigationBarLoading();
        var self = this;
        var articleTableId = app.globalData.g_articleTableId;
        var articleTable = new wx.BaaS.TableObject(articleTableId);
        articleTable.limit(10).offset(0).find().then(res => {
            var postData = util.progressArticleData(res);
            self.setData({
                postData: postData,
                isLoading:false
            });
            app.globalData.g_totalArticlesData = postData;
            self.data.postData = postData;
            // ********************
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        })
    },
    // progressData: function (res) {
    //     var data = res.data.objects;
    //     var postData = [];
    //     for (var index in data) {
    //         var info = {
    //             author: data[index].author,
    //             comment: data[index].comment,
    //             avatar: data[index].avatar,
    //             content: data[index].content,
    //             creator: data[index].created_by,
    //             detail: data[index].detail,
    //             id: data[index].id,
    //             imgSrc: data[index].imgSrc,
    //             like: data[index].like,
    //             date: data[index].date
    //         }
    //         postData.push(info);
    //     }
    //     return postData;
    // },
    onPostTap: function (e) {
        var articleData = this.data.postData;
        var index = e.currentTarget.dataset.index;
        app.globalData.g_articleData = articleData[index];
        console.log(app.globalData.g_articleData.like)
        wx.navigateTo({
            url: "post-detail/post-detail?index="+index
        })
    },
    onLikeTap: function (event) {
        var postData = util.onLikeEventTap(event)
        this.setData({
            postData: postData
        })
    },
    onShow:function(){
        var totalArticlesData = app.globalData.g_totalArticlesData;
        var commentsNum = app.globalData.g_commentsNum;
        this.setData({
            postData: totalArticlesData
        })
    },
    onPullDownRefresh:function(){
        wx.showNavigationBarLoading();
        this.setPostData();
    }
})