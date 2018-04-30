// pages/movies/movies.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
    data:{
        containerShow: false,
        searchPanelShow: false,
        searchResult: {},
        inTheater: {},
        top250: {},
        commingSoon: {},
        noData:false,
        inputValue:"",
        inSearchPage:false,
        searchUrl:"",
        searchDataSize:0,
        totalMovies:null,
        isSearchEmpty:true,
        isSearchLoading:false
    },
    onLoad: function () {
        // wx.showLoading({
        //     title: '加载中',
        // })
        this.setData({
            isLoading: true
        })
        var top250Url = app.globalData.g_doubanBase + "v2/movie/top250?start=0&count=3";
        var commingSoonUrl = app.globalData.g_doubanBase + "v2/movie/coming_soon?start=0&count=3";
        var inTheaterUrl = app.globalData.g_doubanBase + "v2/movie/in_theaters?start=0&count=3";
        this.getMoviesData(inTheaterUrl, "inTheater", "正在热映");
        this.getMoviesData(top250Url, "top250", "top250");
        this.getMoviesData(commingSoonUrl, "commingSoon", "即将上映");
    },
    getMoviesData: function (url, key, category) {
        var self = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                "Content-Type": "json"
            },
            success: function (res) {
                self.progressData(res.data, key, category);
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    progressData: function (moviesData, key, category) {
        var movies = [];
        var totalMovies = this.data.totalMovies;
        var searchDataSize = this.data.searchDataSize;
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
        if(movies.length === 0){
            this.data.noData = true;
        }else{
            this.data.noData = false;
        }
        if (this.data.isSearchEmpty && this.data.inSearchPage) {
            totalMovies = movies;
            this.data.isSearchEmpty = false;
        } else if (!this.data.isSearchEmpty &&this.data.inSearchPage){
            totalMovies = totalMovies.concat(movies);
        }else{
            totalMovies = movies;
        }
        this.data.totalMovies = totalMovies;
        var readyData = {};
        readyData[key] = {
            category: category,
            movies: this.data.totalMovies,
            noData: this.data.noData,
            searchDataSize: searchDataSize
        }
        this.setData(readyData);
        this.setData({
            isSearchLoading: false,
            isLoading: false,
            containerShow: true,
        })
        this.data.searchDataSize += 18;
        wx.hideNavigationBarLoading();
        wx.hideLoading();
    },
    onGetMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category
        })
    },
    onBindFocus: function () {
        this.setData({
            containerShow: false,
            searchPanelShow: true,
            inSearchPage: true
        })
    },
    // onBindBlur: function () {
    //     this.setData({
    //         containerShow: true,
    //         searchPanel: false
    //     })
    // },
    onCancelImgTap: function () {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult:{},
            noData:false,
            inputValue:"",
            inSearchPage: false
        })
    },
    onBindConfirm: function (event) {
        this.setData({
            isSearchLoading: true
        })
        this.data.inSearchPage = true;
        this.data.isSearchEmpty = true;
        this.data.totalMovies = null;
        var text = event.detail.value;
        var searchUrl = app.globalData.g_doubanBase + "v2/movie/search?q="+text;
        this.data.searchUrl = searchUrl;
        searchUrl = searchUrl +"&start=0&count=18";
        this.getMoviesData(searchUrl,"searchResult","");
        wx.showNavigationBarLoading();
    },
    onReachBottom:function(){
        //判断是否在搜索页面
        if (!this.data.inSearchPage){
            return false;
        }
        this.setData({
            // isLoading:true,
            isSearchLoading: true,
            noData: false
        })
        console.log("onReachBottom")
        var nextUrl = this.data.searchUrl + "&start="+this.data.searchDataSize+"&count=18";
        this.getMoviesData(nextUrl, "searchResult", "");
        wx.showNavigationBarLoading();
    },
    onMovieTap:function(event){
        wx.navigateTo({
            url: "/pages/movies/movie-detail/movie-detail?id="+event.currentTarget.dataset.movieId
        })
    }
})