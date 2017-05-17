define(function(require, exports, module) {

    var template = require('libs/template');

    template.helper('dateFormate', function (createdate) {
        var date = createdate.substring(0, 10).split('-');
        return date[0] + '年' + date[1] + '月' + date[2] + '日';
    });

    //
    template.helper('getNowDate', function () {
        var now = new Date();
        var format = 'yyyy-MM-dd h:m:s';
        var date = {
            "M+": now.getMonth() + 1,
            "d+": now.getDate(),
            "h+": now.getHours(),
            "m+": now.getMinutes(),
            "s+": now.getSeconds(),
            "q+": Math.floor((now.getMonth() + 3) / 3),
            "S+": now.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (now.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    });

    var Action = {
        bindEvent : function(){
            $('body').delegate('.js-tap', 'click', function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            })
        },
        nowTime: function(){
            var now = new Date();
            var format = 'yyyy-MM-dd h:m:s';
            var date = {
                "M+": now.getMonth() + 1,
                "d+": now.getDate(),
                "h+": now.getHours(),
                "m+": now.getMinutes(),
                "s+": now.getSeconds(),
                "q+": Math.floor((now.getMonth() + 3) / 3),
                "S+": now.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (now.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        },
        showTable: function(){
            var $parent = $(this).parent();
            if($parent.hasClass('on')){
                $parent.removeClass('on');
            }else{
                $parent.addClass('on');
            }
        },
        getData: function(fundid){
            var time = this.nowTime();
            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.FundOperateRecordGroup",
                "id": 54321,
                "params" : {
                    "Operatetime": time,
                    "Fundid": fundid,
                    "Count": 200
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                $.each(result.data, function(i, t){
                    result.data[i].updatetime = t.data[0].updatetime;
                })
                var html = template('day-template', result);
                $('#list').html(html);

                console.log(result);
            })
        },
        init : function(){
            //判断登录态
            $.Func.getUserInfo();
            if(!$.User.wxgzh){
                location.href = $.CONFIG.INDEX;
            }

            var fundid = $.Func.getParam('fundid');
            if(fundid){
                this.getData(fundid);
                this.bindEvent();
            }
        }
    }

    module.exports = Action;
});