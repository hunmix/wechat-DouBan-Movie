// pages/mine/mine-collection/mine-collection.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {
        hasThing: false,
        isLoading:true
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
                    hasThing: true,
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
        for (var i = 0; i < articlesId.length;i++) {
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
                isLoading:false
            })
        }, err => {
            console.log("error: "+res);
        })
    },
    progressContent: function (articlesData){
        for (var index in articlesData){
            var content = articlesData[index].content.substring(0,37)+"...";
            articlesData[index].content = content;
        }
        return articlesData;
    },
    onCollectionTap:function(event){
        var articleId = event.currentTarget.dataset.articleId;
        wx.redirectTo({
            url: "/pages/posts/post-detail/post-detail?id=" + articleId
        })
    }
})