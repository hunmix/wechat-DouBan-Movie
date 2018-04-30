// pages/mine/mine-collection/mine-collection.js
var util = require('../../../utils/util.js');
Page({
    data: {

    },
    onLoad: function (options) {
        util.setNavigateTitle(options.title);
    },
    onCopyTap: function (event) {
        var message = event.currentTarget.dataset.message;
        wx.setClipboardData({
            data: message,
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        })
    }
})