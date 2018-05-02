// pages/test/test.js
var app = getApp();
Page({
    data: {
        tableId: 34671,
        userInfo: {}
    },
    onLoad: function (options) {
        // let contentGroupID = 1524909156796193
        // let richTextID = 1524913441193603

        // 查找该内容库下的所有内容
        // MyContentGroup.find().then()

        // 查找该内容库下在指定分类下的内容
        // let MyContentGroup = new wx.BaaS.ContentGroup(1524909156796193)
        // let query = new wx.BaaS.Query();
        // MyContentGroup.setQuery(query).find().then(res => {
        //     console.log(res)
        //     this.setData({
        //         richText: res
        //     })
        // }, err => {
        //     // err
        // })
        var tableId = app.globalData.g_commentDetailTableId;
        var Product = new wx.BaaS.TableObject(tableId);
        var query = new wx.BaaS.Query();
        console.log(tableId)
        query.contains('articleId', '5ae48e5d2f6fc419ed17f13b')
        Product.setQuery(query).find().then(res => {
            console.log(res)
        })
        
    }
})