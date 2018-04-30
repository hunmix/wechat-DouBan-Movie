// pages/test/test.js
Page({
    data: {
        tableId: 34671,
        userInfo:{}
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
        var Product = new wx.BaaS.TableObject(34671);
        Product.limit(10).offset(0).find().then(res => {
            console.log(res)
        })
    }
})