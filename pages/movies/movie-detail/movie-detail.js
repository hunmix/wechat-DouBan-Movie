// pages/movies/movie-detail/movie-detail.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({
    data: {

    },
    onLoad: function (options) {
        wx.showLoading({
            title: '努力加载中...',
        })
        var movieId = options.id;
        var url = app.globalData.g_doubanBase + "v2/movie/subject/" + movieId;
        util.http(url, this.processData);
    },
    processData: function (data) {
        if (!data) {
            return;
        }
        var director = {
            avatar: "",
            name: "",
            id: ""
        }
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large

            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            generes: data.genres.join("、"),
            stars: util.toStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        }
        this.setData(movie)
        wx.hideLoading();
    },
    //预览图片
    onViewImg: function (event) {
        var src = event.currentTarget.dataset.src;
        var urls = event.currentTarget.dataset.urls || [src];
        wx.previewImage({
            current: src, //当前显示图片的http链接
            urls: urls  //需要预览的图片http链接列表
        })
    }
})