App({
    globalData:{
        g_isMusicPlay:false,
        g_currentMusicPlayId:null,
        g_doubanBase:"https://douban.uieee.com/",
        g_userInfo:null,
        g_articleTableId: 34671,
        g_articleCollectionTableId: 34733,
        g_commentDetailTableId: 35056,
        g_totalArticle:{},
        g_collectedArticleId:null,
        // 当前详情页面文章信息
        g_articleData:null,
        g_totalArticlesData:null,
        g_commentsNum:null
    },
    onLaunch() {
        // 引入 SDK
        require('./utils/sdk-v1.3.0');
        // 初始化 SDK
        let clientID = '8c1c9054efce81bf3893';
        wx.BaaS.init(clientID);
    }
})
