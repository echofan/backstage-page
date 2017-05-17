define(function(require, exports, module) {


    var Subscribe = require('libs/subscribe');
    var template = require('libs/template');

    template.helper('numToPercent', function (number) {
        return (number*100).toFixed(2)
    });

    template.helper('shortDate', function (date) {
        return date.substring(4,6) + '.' + date.substring(6);
    });

    var Action = {
        bindEvent : function(){
            $('body').delegate('.js-tap', $.Func.TAP, function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            })
        },
        getFundid: function(callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.EagleEyesInfo",
                "id": 54321
            };
            $.Func.ajax(param, function(res){
                if(res.result){
                    callback && callback(res.result.productclass);
                }
            })
        },
        //关闭弹层
        closeLayer : function(){
            $(this).parent().parent().removeClass('show');
        },
        //鹰眼播报
        getEye: function(){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.Broadcast",
                "id": 54321,
                "params" : {
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                var date = result.day.toString();

                //日期
                result.newDate = date.substring(0, 4) + '年' +  date.substring(4, 6) + '月' +  date.substring(6) + '日';
                var html = template('broadcast-template', result);
                $('#broadcast').html(html);
                that.getHistory(date);
            })
        },
        //播报历史记录
        getHistory: function(date){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.BroadcastHistory",
                "id": 54321,
                "params" : {
                    "date":date
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                var html = template('probability-template', result);
                $('#probability').html(html);
            })
        },
        //板块
        getBlock: function(){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.Block",
                "id": 54321,
                "params" : {
                }
            };
            $.Func.ajax(param, function(res){
                var result = res.result;
                if(result && result.bkdata){
                    result.colors = ['block-color1', 'block-color2', 'block-color3', 'block-color4', 'block-color5', 'block-color6', 'block-color7', 'block-color8', 'block-color9', 'block-color10'];
                    var html = template('block-template', result);
                    $('#block').html(html);
                }else{
                    var html = '<li class="empty-li">暂无板块推荐</li>';
                    $('#block').html(html);
                }
            })
        },
        //展示鹰眼介绍页
        showSubscribe: function (productid) {
            $('#noSubscribe').removeClass('hide');
            $('#noSubscribe img').each(function (i, t) {
                var src = $(t).data('src');
                $(t).attr('src', src);
            });
            $('#nosubscribeBtn').html('<a href="../../pay/pay.html?productid=' + productid + '"><img src="../res/img/hawkeye/yybb_btn.png" width="100%" alt=""/></a>');
        },
        init : function(){
            var that = this;

            //判断登录态
            $.Func.getUserInfo();

            //获取productid
            that.getFundid(function(productid){
                if(!$.User.wxgzh){
                    that.showSubscribe(productid);
                }else{
                    var uin = $.User.userid;
                    //判断是否在服务期内,在服务期内则正常展示
                    Subscribe.vipService(uin, function(vipArr){
                        if(~$.inArray(productid, vipArr)){
                            that.getEye();
                            that.getBlock();
                            $('#subscribe').removeClass('hide');
                        }else{
                            that.showSubscribe(productid);
                        }
                    })
                }

            })

            this.bindEvent();
        }
    }

    module.exports = Action;
});