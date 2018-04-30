// pages/posts/post.js
var postsData = require('../../data/posts-data.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
        wx.showLoading({
            title: '加载中',
        });
        var articleTableId = app.globalData.g_articleTableId;
        var articleTable = new wx.BaaS.TableObject(articleTableId);
        articleTable.limit(10).offset(0).find().then(res => {
            var postData = util.progressArticleData(res);
            self.setData({
                postkey: postData
            });
            wx.hideLoading();
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
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "post-detail/post-detail?id=" + id
        })
    },
    // onSwiperTap: function (e) {
    //     var postId = e.target.dataset.postId;
    //     wx.navigateTo({
    //         url: "post-detail/post-detail?id=" + postId
    //     })
    // },
    
})