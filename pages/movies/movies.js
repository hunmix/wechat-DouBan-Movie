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
        isSearchLoading:false,
        isInResearching:false
    },
    onLoad: function () {
        wx.showNavigationBarLoading();
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
            //请求成功回调函数
            success: function (res) {
                self.progressData(res.data, key, category);
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    //电影数据处理
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
        //判断是否请求到电影数据
        if(movies.length === 0){
            this.data.noData = true;
        }else{
            this.data.noData = false;
        }
        //是否处于搜索状态
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
        //渲染数据
        this.setData(readyData);
        this.setData({
            isSearchLoading: false,//搜索加载icon
            isLoading: false,//movie加载icon
            containerShow: true,//movie主页面是否展示
            isInResearching:false//是否按了搜索键
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
            isSearchLoading: true,
            isInResearching: true //是否按了搜索键
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