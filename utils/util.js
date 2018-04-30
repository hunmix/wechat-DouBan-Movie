function toStarsArray(stars) {
    var starsNum = 5;
    var arr = [];
    var num = stars.toString().substring(0, 1);
    for (var i = 0; i < starsNum; i++) {
        if(i < num){
            arr.push(1);
        }else{
            arr.push(0);
        }
    }
    return arr;
}
function http(url,callBack) {
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
        fail:function(res){
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
function progressArticleData(res) {
    var data = res.data.objects;
    var postData = [];
    for (var index in data) {
        var info = {
            author: data[index].author,
            comment: data[index].comment,
            avatar: data[index].avatar,
            content: data[index].content,
            creator: data[index].created_by,
            detail: data[index].detail,
            id: data[index].id,
            imgSrc: data[index].imgSrc,
            like: data[index].like,
            date: data[index].date
        }
        postData.push(info);
    }
    return postData;
}
module.exports={
    toStarsArray: toStarsArray,
    http:http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos,
    setNavigateTitle: setNavigateTitle,
    progressArticleData: progressArticleData
}