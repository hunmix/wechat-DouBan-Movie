var app = getApp();
// var util = require('../../../utils/util.js');
Page({
    data: {
        isMusicPlay: false
    },
    onLoad: function (option) {
        wx.showLoading({
            title: '加载中...',
        })
        var articleId = option.id;
        this.setArticleData(app.globalData.g_articleTableId, articleId);
        this.renderCollection(articleId);
        // 根据缓存更新收藏按钮状态
        // var isPostsCollected = wx.getStorageSync('isPostsCollected');
        // if (typeof isPostsCollected[postId] == "boolean"){
        //     var postCollected = isPostsCollected[postId];
        //     this.setData({
        //         collected: postCollected
        //     })
        // }else{
        //     // var isPostsCollected = {};
        //     isPostsCollected[postId] = false;
        //     wx.setStorageSync("isPostsCollected", isPostsCollected)
        // }
        // this.setMusicMonitor();
    },
    // 渲染详情页
    setArticleData: function (tableId, articleId) {
        var self = this;
        let articleTable = new wx.BaaS.TableObject(tableId)
        articleTable.get(articleId).then(res => {
            self.setData({
                articleData: res.data
            })
            wx.hideLoading();
        }, err => {
            console.log('error')
        })
    },
    // // 点击缓存更改状态
    // // onCollectedTap:function(){
    // //     var isPostsCollected = wx.getStorageSync("isPostsCollected");
    // //     console.log(isPostsCollected)
    // //     // 获取当前页面收藏按钮缓存
    // //     var postCollected = isPostsCollected[this.data.postId];
    // //     // 收藏状态切换
    // //     postCollected = !postCollected;
    // //     isPostsCollected[this.data.postId] = postCollected;
    // //     console.log(isPostsCollected)
    // //     // 设置缓存
    // //     wx.setStorageSync("isPostsCollected", isPostsCollected);
    // //     // 更新数据绑定变量，实现收藏图片状态切换
    // //     this.setData({
    // //         collected: postCollected
    // //     })
    // //     wx.showToast({
    // //         title: postCollected ? "收藏成功":"取消成功",
    // //         duration:800,
    // //         icon:"success"
    // //     })
    // // },
    onCollectedTap: function (event) {
        var articleId = event.currentTarget.dataset.articleId;
        this.upDateCollected(articleId)
    },
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
        newRecord.save()
        
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