var app = getApp();
var util = require('../../../utils/util.js');
// var util = require('../../../utils/util.js');
Page({
    data: {
        isMusicPlay: false,
        hasLike: false,
        index: null,
        focus: false,
        noComment: false,
        textValue: ""
    },
    onLoad: function (option) {
        wx.showLoading({
            title: '加载中...',
        })
        this.data.index = option.index;
        //读取post.js存储在app.js中的当前文章数据
        var articleData = app.globalData.g_articleData;
        // post页面跳转
        if (articleData) {
            var articleId = articleData.id;
            this.setCommnetsData(articleId, articleData);
        } else {
            // myCollection页面跳转
            articleId = option.articleId;
            // 异步获取articleId，所以将setCommnetsData
            this.getArticleData(articleId);
        }
        wx.hideLoading();
        this.renderCollection(articleId);
    },
    getArticleData: function (articleId) {
        var self = this;
        var tableId = app.globalData.g_articleTableId;
        let query = new wx.BaaS.Query()
        let articleTable = new wx.BaaS.TableObject(tableId)
        query.contains('articleId', articleId)
        articleTable.setQuery(query).find().then(res => {
            var articleData=util.progressArticleData(res);
            // ****************************************
            app.globalData.g_articleData = articleData[0];
            //设置ommnetsData
            self.setCommnetsData(articleId, articleData[0]);
        }, err => {
            // err
        })
    },
    setCommnetsData: function (articleId, articleData) {
        console.log(articleData)
        var self = this;
        var tableId = app.globalData.g_commentDetailTableId;
        var commnetsData = new wx.BaaS.TableObject(tableId);
        var query = new wx.BaaS.Query();
        query.contains('articleId', articleId)
        commnetsData.setQuery(query).find().then(res => {
            var commentsData = self.progressCommnetsData(res, articleId);
            // **********************************************
            // this.sendCommentsNumInDatabase(commentsData.length, articleId);
            if (commentsData) {
                //渲染详情页
                this.setData({
                    articleData: articleData,
                    commentsData: commentsData,
                    noComment: false
                })
            } else {
                this.setData({
                    articleData: articleData,
                    noComment: true
                })
            }

        }, err => {
            // err
        })
    },
    progressCommnetsData: function (res, articleId) {
        var data = res.data.objects;
        if (data.length == 0) return false;
        var infoArr = [];
        for (var index in data) {
            var date = util.transformDate(data[index].created_at);
            var canDelete = data[index].canDelete || false;
            var info = {
                _id: data[index].id,
                articleId: data[index].articleId,
                author: data[index].author,
                commentDetail: data[index].commentDetail,
                userId: data[index].created_by,
                date: date,
                canDelete: canDelete,
                avatar: data[index].avatar,
                commentsNum: data.length
            }
            infoArr.push(info);
        }
        this.sendCommentsNumInDatabase(infoArr.length, articleId);
        //上传评论数到数据库
        // this.sendCommentsNumInDatabase(data.length, articleId);
        return infoArr;
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
    onLikeBtnTap: function (event) {
        var articleId = event.currentTarget.dataset.articleId;
        var hasLike = event.currentTarget.dataset.hasLike;
        var totalArticlesData = app.globalData.g_totalArticlesData;
        if (this.data.index){
            var index = this.data.index;
        }else{
            var index = this.getArticleIndexInTotalData(totalArticlesData, articleId);
        }
        totalArticlesData[index].hasLike = !hasLike;
        var changeNum = !hasLike ? 1 : -1;
        totalArticlesData[index].like += changeNum;
        app.globalData.g_totalArticlesData = totalArticlesData;
        // 传入index
        var articleData = util.onLikeEventTap(event, index);
        this.setData({
            articleData: articleData
        })
    },
    getArticleIndexInTotalData: function (totalArticlesData,articleId){
        for (var index in totalArticlesData){
            if (totalArticlesData[index].articleId == articleId){
                return index;
            }
        }
    },
    onCancelTap: function () {
        this.setData({
            focus: false,
            textValue: ""
        })
    },
    onWriteTap: function (event) {
        var articleId = event.currentTarget.dataset.articleId;
        var commentValue = this.data.commentValue || " ";
        var focus = this.data.focus;
        console.log(focus)
        if (focus == true) {
            console.log(focus, commentValue)
            if (commentValue.length < 6) {
                wx.showToast({
                    title: '输入字数不能小于5位',
                    icon: 'none',
                    duration: 1500
                })
                this.setData({
                    focus: true,
                    textValue: ""
                })
                return;
            }
            wx.showLoading({
                title: '提交中...',
            })
            this.setCommentValueInDatabase(commentValue, articleId);
        }
        this.setData({
            focus: !focus,
            textValue: "",
            noComment: false
        })
    },
    setCommentValueInDatabase: function (commentValue, articleId) {
        var self = this;
        var userInfo = app.globalData.g_userInfo;
        var tableId = app.globalData.g_commentDetailTableId;
        var commentDetail = commentValue;
        var author = userInfo.nickName;
        var avatar = userInfo.avatarUrl;
        var commentInfo = {
            commentDetail: commentValue,
            author: author,
            avatar: avatar,
            articleId: articleId
        }
        var commentValueTable = new wx.BaaS.TableObject(tableId);
        var MyRecord = commentValueTable.create();
        MyRecord.set(commentInfo).save().then(res => {
            self.refreshCommentData(articleId)
        })
    },
    onInputTap: function (event) {
        var commentValue = event.detail.value;
        this.data.commentValue = commentValue;
    },
    refreshCommentData: function (articleId) {
        var self = this;
        var tableId = app.globalData.g_commentDetailTableId;
        var commnetsData = new wx.BaaS.TableObject(tableId)
        var query = new wx.BaaS.Query();
        query.contains('articleId', articleId)
        commnetsData.setQuery(query).find().then(res => {
            var commentsData = self.progressCommnetsData(res, articleId);
            //更新post页面的评论数量
            self.refreshPostCommnetsNum(commentsData.length);
            if (commentsData.length == 0) {
                var noComment = true
            } else {
                var noComment = false
            }
            //渲染详情页
            self.setData({
                commentsData: commentsData,
                noComment: noComment
            })
            console.log(res)
            wx.showToast({
                title: '操作成功',
                icon: 'none',
                duration: 1000
            })
            wx.hideLoading();
            //更新post页面的评论数量

        })
    },
    // 删除按钮
    onDeleteTap: function (event) {
        var self = this;
        var articleId = event.currentTarget.dataset.articleId;
        console.log(articleId)
        var _id = event.currentTarget.dataset._id;
        var tableId = app.globalData.g_commentDetailTableId;
        wx.showModal({
            title: '删除',
            content: '确认要删除吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '删除中...',
                    })
                    let commentsDataTable = new wx.BaaS.TableObject(tableId)
                    commentsDataTable.delete(_id).then(res => {
                        self.refreshCommentData(articleId);
                    }, err => {
                        // err
                    })
                } else if (res.cancel) {
                    return;
                }
            }
        })
    },
    refreshPostCommnetsNum: function (commentsNum = 0) {
        var totalArticlesData = app.globalData.g_totalArticlesData;
        var index = this.data.index;
        totalArticlesData[index].commentsNum = commentsNum;
        app.globalData.totalArticlesData = totalArticlesData;
    },
    sendCommentsNumInDatabase: function (num = 0, articleId) {
        let tableId = app.globalData.g_articleTableId;
        let commentDataTable = new wx.BaaS.TableObject(tableId)
        let commentData = commentDataTable.getWithoutData(articleId)
        commentData.set('commentsNum', num);
        commentData.update().then(res => {
            //send success
        }, err => {
            console.log(res)
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