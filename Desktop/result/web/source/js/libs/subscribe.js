define(function(require, exports, module) {

    var Subscribe = {
        //订阅基金
        subscribeFund: function(uin, fundid, callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.SubscribeV3",
                "id": 54321,
                "params" : {
                    "userid": $.User.userid,
                    "fundid": fundid
                }
            };
            $.Func.ajax(param, function(data){
                $.isFunction(callback) && callback(data);
            })
        },
        //订阅列表
        subscribeList : function(uin, callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.SubscribeList",
                "id": 54321,
                "params" : {
                    "userid": uin
                }
            };
            $.Func.ajax(param, function(res){
                var subscribeArr = [];
                var result = res.result;
                if(result){
                    var data = result.data;
                    for(var obj in data){
                        subscribeArr.push(data[obj].fundid);
                    }
                }
                $.isFunction(callback) && callback(subscribeArr);
            })
        },
        //判断是否处于服务期内
        vipService : function(uin, callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "Product.VIPService",
                "id": 54321,
                "params" : {
                    "userid": uin
                }
            };
            $.Func.ajax(param, function(res){
                var vipArr = [];
                var result = res.result;
                if(result){
                    var data = result.data;
                    for(var obj in data){
                        if(data[obj].status.toString() === '1'){
                            vipArr.push(data[obj].productclass);
                        }
                    }
                }
                $.isFunction(callback) && callback(vipArr);
            })
        },
        //查询是否免费接口
        checkFundFreeStatus : function(uin, productid, callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "Product.ProductFreeStatus",
                "id": 54321,
                "params" : {
                    "userid": uin,
                    "productclass": productid
                }
            };
            $.Func.ajax(param, function(res){
                if(res.result){
                    $.isFunction(callback) && callback(res.result.status);
                }
            })
        }
    }

    return Subscribe;
});

