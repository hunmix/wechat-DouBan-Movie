// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({
    data: {
        navigateTitle: "",
        requestUrl: "",
        totalMovies: null,
        totalCount:0,
        isMoviesEmpty:true,
        noMoreData:false,
        isLoading:false
    },
    onLoad: function (options) {
        this.setData({
            isLoading: true,
            noMoreData: false
        })
        var category = options.category;
        this.data.navigateTitle = options.category;
        var mainUrl = app.globalData.g_doubanBase;
        var url = "";
        switch (category) {
            case "正在热映":
                url = mainUrl + 'v2/movie/in_theaters';
                break;
            case "即将上映":
                url = mainUrl + 'v2/movie/coming_soon';
                break;
            case "top250":
                url = mainUrl + 'v2/movie/top250';
                break;
        }
        var baseUrl = url;
        this.data.requestUrl = baseUrl;
        url += "?start=0&count=18";
        util.http(url, this.progressMovieData);
    },
    progressMovieData: function (moviesData) {
        var movies = [];
        for (var index in moviesData.subjects) {
            var subject = moviesData.subjects[index];
            var title = subject.title;
            if (title.length > 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                stars: util.toStarsArray(subject.rating.stars)
            }
            movies.push(temp);
        }
        if (movies.length === 0) {
            this.data.noMoreData = true;
        } else {
            this.data.noMoreData = false;
        }
        //新加载数据和旧数据存放在一起
        if (!this.data.isMoviesEmpty) {
            this.data.totalMovies = this.data.totalMovies.concat(movies);
        } else {
            this.data.totalMovies = movies;
            this.data.isMoviesEmpty = false;
        }
        this.setData({
            movies: this.data.totalMovies,
            noMoreData: this.data.noMoreData,
            isLoading: false
        });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.data.totalCount += 18;
    },
    onReachBottom: function () {
        var isLoading = true;
        this.setData({
            isLoading: isLoading,
            noMoreData:false
        })
        var nextUrl = this.data.requestUrl+"?start="+this.data.totalCount+"&count=18";
        util.http(nextUrl, this.progressMovieData);
        wx.showNavigationBarLoading();
    },
    onPullDownRefresh:function(){
        var refreshUrl = this.data.requestUrl + "?start=0&count=18";
        this.data.totalMovies = null;
        this.data.totalCount = 0;
        this.data.isMoviesEmpty = true
        util.http(refreshUrl, this.progressMovieData);
        wx.showNavigationBarLoading();
    },
    onMovieTap:function (event) {
        wx.navigateTo({
            url: "/pages/movies/movie-detail/movie-detail?id=" + event.currentTarget.dataset.movieId
        })
    },
    onReady: function (event) {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle
        })
    }
})