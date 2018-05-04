var app = getApp();
function toStarsArray(stars) {
    var starsNum = 5;
    var arr = [];
    var num = stars.toString().substring(0, 1);
    for (var i = 0; i < starsNum; i++) {
        if (i < num) {
            arr.push(1);
        } else {
            arr.push(0);
        }
    }
    return arr;
}
function http(url, callBack) {
    var self = this;
    wx.request({
        url: url,
        method: 'GET',
        header: {
            "Content-Type": "json"
        },
        success: function (res) {
            callBack(res.data);
        },
        fail: function (res) {
            console.log(res)
        }
    })
}
function convertToCastString(casts) {
    var castsjoin = "";
    for (var index in casts) {
        castsjoin = castsjoin + casts[index].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
    var castsArray = []
    var urls = [];
    for (var index in casts) {
        var cast = {
            img: casts[index].avatars ? casts[index].avatars.large : "",
            name: casts[index].name
        }
        urls.push(cast.img);
        cast.urls = urls;
        castsArray.push(cast);
    }
    return castsArray;
}
function setNavigateTitle(navigateTitle) {
    wx.setNavigationBarTitle({
        title: navigateTitle
    })
}
// function castActorImgUrls(infoArray){
//     var urls = [];
//     for (var index in infoArray){
//         urls.push(infoArray[index].src);
//     }
//     return urls;
// }
// function getCurrentUserId(){
//     var uesrInfo = wx.BaaS.storage.get('userinfo');
//     var userId = userInfo.id;
//     return userId;
// }
// *********************************************************************************
function progressArticleData(res) {
    var data = res.data.objects;
    var postData = [];
    for (var index in data) {
        var hasLike = getHasLike(index, data);
        var date = transformDate(data[index].created_at);
        var info = {
            author: data[index].author,
            commentsNum: data[index].commentsNum,
            avatar: data[index].avatar,
            content: data[index].content,
            creator: data[index].created_by,
            detail: data[index].detail,
            id: data[index].id,
            imgSrc: data[index].imgSrc,
            like: data[index].hasLikeUsers.length,
            date: date,
            articleId: data[index].articleId,
            hasLike: hasLike,
            likeStyle: "",
            title: data[index].title
        }
        postData.push(info);
    }
    return postData;
}
function getHasLike(index, data) {
    var hasLikeUsers = data[index].hasLikeUsers;
    var userId = app.globalData.g_userInfo.id.toString();
    var hasLike;
    if (hasLikeUsers.indexOf(userId) == -1) {
        return false;
    } else {
        return true;
    }
}
// **********************************************************************************
// **********************************************************************************
// 点赞事件
function onLikeEventTap(event, tempIndex) {
    var userId = app.globalData.g_userInfo.id;
    var hasLike = !event.currentTarget.dataset.hasLike;
    var likeStyle = judgeLikeBtnStyle(hasLike);
    var totalPostData = app.globalData.g_totalArticlesData;
    // post页面传入event参数，post-detail传入event和tempIndex
    if (tempIndex) {
        // 当前页面为post-detail页面
        // 获取当前文章数据
        var postData = app.globalData.g_articleData;
        var articleId = postData.id;
        postData.hasLike = hasLike;
        postData.likeStyle = likeStyle;
        if (hasLike) {
            postData.like += 1;
        } else {
            postData.like -= 1;
        }
        // 更改全部文章数据，以便于post页面获取数据同步更新赞
        totalPostData[tempIndex] = postData;
    } else {
        var index = event.currentTarget.dataset.index;
        var totalPostData = app.globalData.g_totalArticlesData;
        var articleId = totalPostData[index].id;
        totalPostData[index].hasLike = hasLike;
        totalPostData[index].likeStyle = likeStyle;
        if (hasLike) {
            totalPostData[index].like += 1;
        } else {
            totalPostData[index].like -= 1;
        }
        app.globalData.g_totalArticlesData = totalPostData;
        var postData = totalPostData;
    }
    setLikeDataInDatabase(articleId, userId, hasLike);
    //最关键数据
    return postData;
    // this.setData({
    //     postData: postData
    // })
}
//获取文章id
function setLikeDataInDatabase(articleId, userId, hasLike) {
    var tableId = app.globalData.g_articleTableId;
    var articleTable = new wx.BaaS.TableObject(tableId);
    articleTable.get(articleId).then(res => {
        sendLikeDataToDatabase(tableId, articleId, userId, hasLike)
    }, err => {
        // err
        console.log('error')
    })
}
//将userId存入数据库或删除 (hasLike用于判断删除或存入)
function sendLikeDataToDatabase(tableId, articleId, userId, hasLike) {
    var articleTable = new wx.BaaS.TableObject(tableId);
    var articleTableSet = articleTable.getWithoutData(articleId);
    userId = userId.toString();
    if (hasLike) {
        articleTableSet.append('hasLikeUsers', userId);
    } else {
        articleTableSet.remove('hasLikeUsers', userId);
    }
    articleTableSet.update().then(res => {
        // success
    }, err => {
        // err
    })
}
function judgeLikeBtnStyle(hasLike) {
    if (hasLike == true) {
        var likeStyle = 'animation:click .5s;';
    } else {
        var likeStyle = '';
    }
    return likeStyle;
}
// **************************************************************************************
//时间转换
function transformDate(date) {
    var date = new Date(date * 1000);//如果date为10位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}
module.exports = {
    toStarsArray: toStarsArray,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos,
    setNavigateTitle: setNavigateTitle,
    progressArticleData: progressArticleData,
    onLikeEventTap: onLikeEventTap,
    transformDate: transformDate
}