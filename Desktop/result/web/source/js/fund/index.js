define(function(require, exports, module) {

    var Chart = require('libs/chart');
    var Subscribe = require('libs/subscribe');
    var template = require('libs/template');

    //缓存曲线数据
    var chartCache = {};
    var status = {};

    template.helper('numToPercent', function (number) {
        var re = '([0-9]+)\.([0-9]{2})[0-9]*';
        number = (number*100).toFixed(2).toString();
        newNumber = number.match(re);
        return newNumber[1] + '.<span class="float">' + newNumber[2] + '%</span>';
    });

    template.helper('dateFormate', function (createdate) {
        var date = createdate.substring(0, 10).split('-');
        return date[0] + '.' + date[1] + '.' + date[2];
    });

    var Slider = function(id){
        this.$ele = $(id);
        this.$child = $('#bannerUl');
        this.curSlide = 0;
        this.timer = null;
        this.width = $(window).width();
        this.init();
    };

    Slider.prototype = {
        init: function(){
            this.getData();
        },
        getData: function(){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "Banner.GetWithSize",
                "id": 54321,
                "params": {
                    "name":"fund",
                    "size": "200"
                }
            };
            $.Func.ajax(param, function(res){
                var result = res.result;
                if(result){
                    that.render(result);
                }
            })
        },
        slide: function(){
            var that = this;
            if(!that.timer){
                that.timer = setInterval(function(){
                    that.next();
                }, 5000);
            }else{
                clearInterval(that.timer);
                that.timer = null;
                setTimeout(function(){
                    that.slide();
                }, 5000);
            }
        },
        render: function(result){
            var data = result.data;
            var html = template('banner-template', result);
            var $li = '';
            $('#bannerUl').html(html);

            this.$child.css({
                'width': this.width * this.$child.find('li').length + 'px'
            });
            this.$child.find('li').css({
                'width': this.width + 'px'
            });

            $.each(data, function(i, t){
                $li += '<li>&bull;</li>';
            });
            $('#bannerTab').html($li);

            if(data && data.length>1){
                this.slide();
                this.bindEvent();
            }

        },
        bindEvent: function(){
            var that = this;
            that.$ele.on('swipeleft', function(){
                that.next.apply(that);
            });
            that.$ele.on('swiperight', function(){
                that.prev.apply(that);
            });
        },
        next: function(){
            var $li = this.$child.find('li');
            this.curSlide++;
            if(this.curSlide >= $li.length) this.curSlide = 0;
            this.slideTo(this.curSlide);
            this.slide();
        },
        prev: function(){
            var $li = this.$child.find('li');
            this.curSlide--;
            if(this.curSlide < 0) this.curSlide = $li.length-1;
            this.slideTo(this.curSlide);
            this.slide();
        },
        slideTo: function(index){
            var left = -index*this.width;
            this.$child.css({
                'margin-left': left+'px'
            });
            $('#bannerTab').find('li').removeClass('on').eq(index).addClass('on');
        }
    }



    var Action = {
        bindEvent : function(){
            $('body').delegate('.js-tap', 'click', function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            })
        },
        showMore : function(e){
            var $parent = $(this).parent();
            var fundid = $(this).data('fundid');
            var index = $(this).data('index');
            var range = $('#onRange-'+index).val();
            if($parent.hasClass('on')){
                $parent.removeClass('on');
            }else{
                $parent.addClass('on');

                //判断是否已经加载过，加载过的话，就不再加载
                if(chartCache.hasOwnProperty(index+range)){
                    chartCache[index+range].paint();
                }else {
                    Action.fundHistoryPctchg(fundid, range, index);
                }
            }
            Action.showBtn(fundid, index);
        },
        //切换范围(初始时间、一年、三个月)
        showTab: function(){
            var tab = $(this).data('range').split('-');
            var range = tab[0];
            var index = tab[1];
            var fundid = $('#onRange-'+index).data('fundid');
            $(this).parent().children().removeClass('on');
            $(this).addClass('on');
            //判断是否已经加载过，加载过的话，就不再加载
            if(chartCache.hasOwnProperty(index+range)){
                chartCache[index+range].paint();
            }else {
                Action.fundHistoryPctchg(fundid, range, index);
            }
        },
        showBtn: function(fundid, index){

            if(!$.User.wxgzh){
                $('#btn-'+index).html('<a class="btn btn-red" href="bindphone.html">绑定账号并订阅</a>').removeClass('hide');
                return false;
            }

            var uin = $.User.userid;
            var that = this;

            //查询订阅列表，看是否已经订阅
            Subscribe.subscribeList(uin, function(subscribeArr){
                if(~$.inArray(fundid, subscribeArr)){
                    $('#btn-'+index).html('<a class="btn btn-red" href="detail.html?fundid=' + fundid + '">查看详情</a>').removeClass('hide');
                }else{
                    Subscribe.vipService(uin, function(vipArr){
                        if(~$.inArray(fundid, vipArr)){
                            $('#btn-'+index).html('<a class="btn btn-red js-tap" data-handler="subscribe" data-fundid=" '+ fundid + '" href="javascript:;">订阅</a>').removeClass('hide');
                        }else{
                            //检测是否免费订阅
                            Subscribe.checkFundFreeStatus(uin, fundid, function(status){
                                if(1 == status){
                                    $('#btn-'+index).html('<a class="btn btn-red js-tap" data-fundid="' + fundid + '" data-handler="subscribe" href="javascript:;">免费订阅</a>').removeClass('hide');
                                }else{
                                    $('#btn-'+index).html('<a class="btn btn-red" href="../../pay/pay.html?productid=' + fundid + '">购买</a>').removeClass('hide');
                                }
                            });
                        }
                    })
                }
            });
        },
        //基金历史涨幅
        fundHistoryPctchg : function(fundid, range, index){

            //获取当前日期
            var now = new Date();
            var eday = $.Func.formatDate(now);
            var sday = null;
            var createtime = $('#create-'+index).val();
            var queryType = 0;
            createtime = $.Func.formatDate(createtime);

            switch (range){
                case 'begin':
                    sday = createtime;
                    queryType = 0;
                    break;
                case 'year':
                    sday = $.Func.formatDate(now, 'year');
                    if(parseInt(sday) < parseInt(createtime)){
                        sday = createtime;
                    }
                    queryType = 1;
                    break;
                case 'month':
                    sday = $.Func.formatDate(now, 'mon');
                    queryType = 2;
                    break;
            }

            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.FundHistoryPctchg",
                "id": 54321,
                "params" : {
                    "Fundid" : fundid,
                    "Pctchgtype" : 0,
                    "QueryType": queryType,
                    "StartDay": parseInt(sday),
                    "EndDay": parseInt(eday)
                }
            };
            $.Func.ajax(param, function(res){
                var result = res.result;
                if(result){
                    Action.drawCanvas(index,range, result.data);
                }
            })
        },
        //订阅
        subscribe : function(){
            var fundid = $(this).data('fundid').trim();
            if(!fundid) return false;
            if(!$.User.wxgzh){
                $.Func.showLayer('#popBindAccount');
            }else{
                Subscribe.subscribeFund($.User.userid, fundid, function(data){
                    if(data.result.status == 1){
                        $.Func.pop('订阅成功！', function(){
                            setTimeout(function(){
                                location.href = $.CONFIG.BASE + 'web/fund/detail.html?fundid=' + fundid;
                            }, 500);
                        });
                    }else{
                        location.href = $.CONFIG.BASE + 'pay/pay.html?productid=' + fundid;
                    }
                });
            }
        },
        //先机基金列表
        fundList : function(callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.FundList",
                "id": 54321,
                "params" : {
                    "blockid": 885494
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                if(result.data){
                    var html = template('li-template', result);
                    $('#fundlist').html(html);
                }

                var canvasWidth = $(window).width() - 20;
                $('.canvas canvas').width(canvasWidth);
                $.isFunction(callback) && callback(result.data);
            })
        },
        hawkeye: function(){
            if(!$.User.wxgzh){
                $.Func.showLayer('#popBindAccount');
            }else{
                location.href = '../hawkeye/index.html';
            }
        },
        //关闭弹层
        closeLayer : function(){
            $(this).parent().parent().removeClass('show');
        },
        //画曲线图
        drawCanvas : function(index, range, days){
            if(days[0].data && days[1].data){
                chartCache[index+range] = new Chart({
                    selector: '#canvas-' + index,
                    point: 'pctchg',
                    days: [{
                        fillStyle: '#CC0153',
                        data: days[0].data
                    }, {
                        fillStyle: '#0166CE',
                        data: days[1].data
                    }]
                });
            }
        },
        init : function(){
            var that = this;

            //判断登录态
            $.Func.getUserInfo();
            if(!$.User.wxgzh){
                $.Func.showLayer('#popBindAccount');
            }

            //获取基金列表
            var fundlist = [];
            that.fundList(function(data){
                $.each(data, function(i, t){
                    fundlist.push(t.fundid);
                })
            });

            var slider = new Slider('#banner');
            this.bindEvent();

        }
    }

    module.exports = Action;
});