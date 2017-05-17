define(function(require, exports, module) {

    var template = require('libs/template');

    var Action = {
        //板块股票
        getBlockStock: function(){
            var param = {
                "jsonrpc": "2.0",
                "method": "Stock.Realtime",
                "id": 54321,
                "params" : {
                    "blockid": 885734
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                console.log(result);
            })
        },
        getRealTime: function(){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.IndustryStock",
                "id": 54321,
                "params" : {
                    "industryid": 885734
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                console.log(result);
            })
        },
        //工业股票
        getIndustryStock: function(){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.IndustryStock",
                "id": 54321,
                "params" : {
                    "industryid": 885734
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
            })
        },
        renderList: function(){
            var action = $.Func.getParam('action');
            this.getBlockStock(); //test
            if('block' === action){
                this.getBlockStock();
            }else if('industry' === action){
                this.getIndustryStock();
            }
        },
        init: function(){
            this.renderList();
        }
    }

    return Action;
})