define(function(require, exports, module) {

    var template = require('libs/template');

    var Action = {
        //板块股票
        getBlockStock: function(blockid, callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.BlockStock",
                "id": 54321,
                "params" : {
                    "blockid": blockid
                }
            };
            $.Func.ajax(param, function(res){
                var result = res.result;
                if(result){
                    var data = result.data, stockArr = [];
                    var len = data.length>20 ? 20 : data.length;
                    for(var i=0; i<len; i++){
                        stockArr.push(data[i].stockid.toString());
                    }
                    $.isFunction(callback) && callback(stockArr);
                }
            });
        },
        //工业股票
        getIndustryStock: function(industryid, callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.IndustryStock",
                "id": 54321,
                "params" : {
                    "industryid": industryid
                }
            };
            $.Func.ajax(param, function(res){
                var result = res.result;
                if(result){
                    var data = result.data, stockArr = [];
                    var len = data.length>20 ? 20 : data.length;
                    for(var i=0; i<len; i++){
                        stockArr.push(data[i].stockid.toString());
                    }
                    $.isFunction(callback) && callback(stockArr);
                }
            });
        },
        //获取股票信息
        getRealTime: function(arr){
            var param = {
                "jsonrpc": "2.0",
                "method": "Stock.Realtime",
                "id": 54321,
                "params" : {
                    "stockid": arr
                }
            };
            $.Func.ajax(param, function(res){
                var result = res.result;
                var html = template('li-template', result);
                $('#stockList').html(html);
            })
        },
        renderList: function(){
            var action = $.Func.getParam('action');
            var id = +$.Func.getParam('id');
            if(action && id){
                if('block' === action){
                    this.getBlockStock(id, this.getRealTime);
                }else if('industry' === action){
                    this.getIndustryStock(id, this.getRealTime);
                }
            }
        },
        init: function(){
            this.renderList();
        }
    }

    return Action;
})