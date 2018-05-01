var app = getApp();
var util = require('../../../utils/util.js');
// var util = require('../../../utils/util.js');
Page({
    data: {
        isMusicPlay: false,
        hasLike:false,
        index:null
    },
    onLoad: function (option) {
        wx.showLoading({
            title: '加载中...',
        })
        this.data.index = option.index;
        //读取post.js存储在app.js中的当前文章数据
        var articleData = app.globalData.g_articleData;
        var articleId = articleData.id;
        //渲染详情页
        this.setData({
            articleData: articleData
        })
        wx.hideLoading();
        this.renderCollection(articleId);
    },
    // 渲染详情页
    // setArticleData: function (tableId, articleId) {
    //     var self = this;
    //     let articleTable = new wx.BaaS.TableObject(tableId)
    //     articleTable.get(articleId).then(res => {
    //         self.setData({
    //             articleData: res.data
    //         })
    //         
    //     }, err => {
    //         console.log('error')
    //     })
    // },
    renderCollection: function (articleId) {
        var self = this;
        var tableId = app.globalData.g_articleCollectionTableId;
        var articleCollectionTable = new wx.BaaS.TableObject(tableId);
        var query = new wx.BaaS.Query();
        query.contains('articleId', articleId);
        articleCollectionTable.setQuery(query).find().then(res => {
            if (res.data.objects.length == 0) {
                self.setData({
                    collected: false
                })
            } else {
                self.setData({
                    collected: true
                })
            }
        }, err => {
            console.log('err:' + res)
        })
    },
    onCollectedTap: function (event) {
        var articleId = event.currentTarget.dataset.articleId;
        this.upDateCollected(articleId)
    },
    upDateCollected: function (articleId) {
        var self = this;
        var tableId = app.globalData.g_articleCollectionTableId;
        var articleCollectionTable = new wx.BaaS.TableObject(tableId);
        var query = new wx.BaaS.Query();
        query.contains('articleId', articleId);
        articleCollectionTable.setQuery(query).find().then(res => {
            if (res.data.objects.length == 0) {
                self.addArticleCollection(tableId, articleId);
            } else {
                var recordId = res.data.objects[0]._id;
                self.deleteArticleCollection(tableId, recordId);
            }
        }, err => {
            console.log('err:' + res)
        })
    },
    addArticleCollection: function (tableId, articleId) {
        var self = this
        var userId = app.globalData.g_userInfo.id;
        var data = {
            userId: userId,
            articleId: articleId
        }
        self.setData({
            collected: true
        })
        var articleCollectionTable = new wx.BaaS.TableObject(tableId);
        var newRecord = articleCollectionTable.create();
        newRecord.set(data);
        newRecord.save();
        wx.showToast({
            title: '收藏成功',
            duration: 800
        })
    },
    deleteArticleCollection: function (tableId, recordId) {
        this.setData({
            collected: false
        })
        var articleCollectionTable = new wx.BaaS.TableObject(tableId);
        articleCollectionTable.delete(recordId);
        
        wx.showToast({
            title: '取消成功',
            duration: 800
        })
    },
    onLikeBtnTap:function(event){
        var hasLike = event.currentTarget.dataset.hasLike;
        var index = this.data.index;
        var totalArticlesData = app.globalData.g_totalArticlesData;
        totalArticlesData[index].hasLike = !hasLike;
        var changeNum = !hasLike ? 1 : -1;
        totalArticlesData[index].like += changeNum;
        app.globalData.g_totalArticlesData = totalArticlesData;
        console.log(app.globalData.g_totalArticlesData)
        // 传入index
        var articleData = util.onLikeEventTap(event, index);
        this.setData({
            articleData: articleData
        })
    }
    // onShareAppMessage:function(res){
    //     return{
    //         title:"嘿嘿嘿",
    //         path:"/pages/welcome/welcome",
    //         success:function(){
    //             console.log("转发成功")
    //         },
    //         fail:function(){
    //             console.log("转发失败")
    //         }
    //     }
    // },
    // onMusicTap:function(){
    //     var currentPost = postsData.postList[this.data.postId];
    //     if(this.data.isMusicPlay){
    //         wx.pauseBackgroundAudio();
    //         this.setData({
    //             isMusicPlay : false
    //         })

    //         app.globalData.g_isMusicPlay = false;
    //     }else{
    //         wx.playBackgroundAudio({
    //             dataUrl: currentPost.music.url,
    //             title: currentPost.music.title,
    //             coverImgUrl: currentPost.music.coverImg
    //         })
    //         this.setData({
    //             isMusicPlay: true
    //         })
    //         app.globalData.g_isMusicPlay = true;
    //         app.globalData.g_currentMusicPlayId = this.data.postId;
    //     }
    // },
    // setMusicMonitor:function(){
    //     var self = this;
    //     wx.onBackgroundAudioPlay(function(){
    //         self.setData({
    //             isMusicPlay: true
    //         })
    //     })
    //     wx.onBackgroundAudioPause(function(){
    //         self.setData({
    //             isMusicPlay: false
    //         })
    //     })
    //     wx.onBackgroundAudioStop(function () {
    //         self.setData({
    //             isMusicPlay: false
    //         })
    //         app.globalData.g_isMusicPlay = false;
    //         app.globalData.g_currentMusicPlayId = null;
    //     })
    //     //如果打开页面和上个相同，则将音乐按钮随着上个页面歌曲状态
    //     if (app.globalData.g_currentMusicPlayId === this.data.postId){
    //         self.setData({
    //             isMusicPlay: app.globalData.g_isMusicPlay
    //         })
    //     }
    // }
})