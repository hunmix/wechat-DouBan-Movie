// pages/mine/mine-collection/mine-collection.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        noThing: false,
        isLoading: true,
        canMove: false,
        articlesData: [],
        startX: null,
        touchIndex: null,
        movedLen: null,
        prevIndex:null
    },
    onLoad: function (options) {
        var self = this;
        var articleCollectionTableId = app.globalData.g_articleCollectionTableId;
        util.setNavigateTitle(options.title);
        var articleCollectionTable = new wx.BaaS.TableObject(articleCollectionTableId);
        articleCollectionTable.find().then(res => {
            var articlesId = self.getArticleId(res);
            if (!articlesId) {
                self.setData({
                    noThing: true,
                    isLoading: false
                })
            } else {
                self.getArticlesInfo(articlesId);
            }
        })
    },
    getArticleId: function (res) {
        var objArray = res.data.objects;
        if (objArray.length == 0) {
            return false;
        }
        var articlesId = [];
        for (var index in objArray) {
            var id = objArray[index].articleId;
            articlesId.push(id);
        }
        return articlesId;
    },
    getArticlesInfo: function (articlesId) {
        var self = this;
        var tableId = app.globalData.g_articleTableId;
        var arr = [];
        var queryObj = {};
        for (var i = 0; i < articlesId.length; i++) {
            var articleId = articlesId[i];
            queryObj[i] = new wx.BaaS.Query();
            queryObj[i].contains('articleId', articlesId[i]);
            arr.push(queryObj[i]);
        }
        // var arr = arr.join(",");
        // console.log(arr)
        var queryAll = wx.BaaS.Query.or(...arr);
        let Product = new wx.BaaS.TableObject(tableId)
        Product.setQuery(queryAll).find().then(res => {
            var articlesData = util.progressArticleData(res);
            articlesData = this.progressContent(articlesData)
            self.setData({
                articlesData: articlesData,
                isLoading: false
            })
            self.data.articlesData = articlesData;
        }, err => {
            console.log("error: " + res);
        })
    },
    progressContent: function (articlesData) {
        for (var index in articlesData) {
            var content = articlesData[index].content.substring(0, 37) + "...";
            articlesData[index].content = content;
        }
        return articlesData;
    },
    onCollectionTap: function (event) {
        var articleId = event.currentTarget.dataset.articleId;
        wx.redirectTo({
            url: "/pages/posts/post-detail/post-detail?id=" + articleId
        })
    },
    onTouchStart: function (event) {
        var prevIndex = this.data.prevIndex;
        var touchIndex = event.currentTarget.dataset.index;
        this.data.touchIndex = touchIndex;
        var articlesData = this.data.articlesData;
        if (prevIndex !== touchIndex){
            this.renderDeleteBtnPos(prevIndex, 0);
        }
        this.data.startX = event.changedTouches[0].pageX;
        this.data.canMove = true;
    },
    onTouchMove: function (event) {
        var canMove = this.data.canMove;
        if (canMove) {
            var startX = this.data.startX;
            var index = this.data.touchIndex;
            var moveX = event.changedTouches[0].pageX;
            var articlesData = this.data.articlesData;
            var movedLen = startX - moveX;
            this.renderDeleteBtnPos(index, movedLen);
            this.data.movedLen = movedLen;
        } else {
            return;
        }
    },
    onTouchEnd: function () {
        var index = this.data.touchIndex;
        var movedLen = this.data.movedLen;
        if (movedLen>75){
            movedLen = 150;
        }else if(movedLen < 75){
            movedLen = 0;
        }
        this.renderDeleteBtnPos(index, movedLen);
        this.data.canMove = false;
        this.data.prevIndex = index;
    },
    renderDeleteBtnPos: function (index, movedLen){
        //第一次调用时直接返回
        if(index == null){
            return;
        }
        // *********************************
        if (this.data.articlesData.length == 0 ){
            return;
        }
        //******************************* */
        var articlesData = this.data.articlesData;
        var contentStyle = 'transform:translate(-' + movedLen + 'rpx)';
        articlesData[index].contentStyle = contentStyle;
        this.setData({
            articlesData: articlesData
        })
    },
    deleteItemTap:function(event){
        var articleId = event.currentTarget.dataset.articleId;
        var self = this;
        wx.showModal({
            title: '提示：',
            content: '确认要删除这个收藏吗',
            success: function (res) {
                if (res.confirm) {
                    self.deleteItem(articleId);
                }
            }
        })
       
    },
    deleteItem: function (articleId){
        var index = this.data.touchIndex;
        var articlesData = this.data.articlesData;
        articlesData.splice(index,1);
        if (articlesData.length == 0){
            this.setData({
                articlesData: articlesData,
                noThing:true
            })
        }else{
            this.setData({
                articlesData: articlesData
            })
        }
        
        //待改进(第一个删除第二个样式变化)***************************
        this.renderDeleteBtnPos(index,0);
        // *******************************
        this.deleteItemInDatabase(articleId);
    },
    deleteItemInDatabase: function (articleId){
        var tableId = app.globalData.g_articleCollectionTableId;
        var query = new wx.BaaS.Query();
        query.contains('articleId', articleId);
        let articleCollectionTable = new wx.BaaS.TableObject(tableId)
        articleCollectionTable.setQuery(query).find().then(res => {
            var _id = res.data.objects[0]._id;
            articleCollectionTable.delete(_id).then(res=>{
                //success
            },res=>{
                wx.showToast({
                    title: '删除失败...',
                    icon:"none"
                })
            })
        }, err => {
            // err
        })
    }
})