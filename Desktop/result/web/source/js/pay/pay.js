define(function(require, exports, module) {

    var Template = require('libs/template');

    Template.helper('fenToyuan', function (money) {
        var amount = Math.ceil(money/100);
        return amount;
    });


    Template.helper('dateFormate', function (createdate) {
        return createdate.substring(0, 10);
    });

    Template.helper('arrayToString', function (arr) {
        return arr.join(',');
    });

    var couponCache = {
        iscroll: null,
        curType: 1,
        type1: {
            data: null
        },
        type2: {
            data: null
        }
    };

    //总价
    var totalPrice = 0;
    //商品信息
    var goodsCache = {
        productclass: null,
        curNum: 0,
        discount:0,
        data: {}
    };
    //支付签名
    var signCache = {};

    var Action = {
        bindEvent : function(){
            $('body').delegate('.js-tap', $.Func.TAP, function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            });

            window.onhashchange=function(){
                var hashStr = location.hash.replace("#","");
                if('coupon' == hashStr){
                    $('body').addClass('showCounpons');
                }else{
                    $('body').removeClass('showCounpons');
                }
            }
        },
        modifyTitle: function(title){
            if(title){
                var $body = $('body');
                document.title = title;
                // hack在微信等webview中无法修改document.title的情况
                var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
                    setTimeout(function() {
                        $iframe.off('load').remove()
                    }, 0)
                }).appendTo($body);
            }
        },
        //持仓详情
        productInfo: function(productid){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "Product.PriceDetail",
                "id": 54321,
                "params" : {
                    "productclass": productid
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                if(result){
                    goodsCache = {
                        productclass: productid,
                        curNum: 0,
                        discount:0,
                        data: result.goods
                    }

                    var title = goodsCache.data[goodsCache.curNum].productname + '信息服务';
                    totalPrice = result.goods[goodsCache.curNum].actualprice;
                    that.modifyTitle(title);
                    $('#title').html(title);
                    $('#totalPrice').html(totalPrice.toFixed(2));
                    var html = Template('price-template', goodsCache.data[goodsCache.curNum]);
                    $('#price').html(html);

                    html = Template('payment-template', result);
                    $('#paymentList').html(html);

                    that.checkCounpon();
                }
            })
        },
        //减少数量
        reducePeriod: function(){
            var period = parseInt($('#period').val()) || 1;
            var discount = goodsCache.discount;

            if(period > 1){
                period--;
                $('#period').val(period);
                totalPrice = goodsCache.data[goodsCache.curNum].actualprice * period;
                $('#totalPrice').html((totalPrice - discount).toFixed(2));
            }
        },
        //添加数量
        addPeriod: function(){
            var period = parseInt($('#period').val()) || 1;
            var discount = goodsCache.discount;

            period++;
            $('#period').val(period);
            totalPrice = goodsCache.data[goodsCache.curNum].actualprice * period;
            $('#totalPrice').html((totalPrice - discount).toFixed(2));
        },
        //根据选择的时间长度（年，季度，月）付费
        showPrice: function(){
            var productid = $(this).data('productid');
            var number = $(this).data('number');
            var period = parseInt($('#period').val()) || 1;
            goodsCache.curNum = number;
            goodsCache.discount = 0;

            //优惠券
            Action.checkCounpon();

            $('#paymentList .js-tap').removeClass('on')
                .eq(number).addClass('on');
            $('#productid').val(productid);
            totalPrice = goodsCache.data[number].actualprice * period;
            $('#totalPrice').html(totalPrice.toFixed(2));
            var html = Template('price-template', goodsCache.data[number]);
            $('#price').html(html);
        },
        //添加数量
        showCoupons: function(){

            var that = Action;

            $.Func.getUserInfo();
            if($.User.wxgzh){
                //先定义iscroll
                location.hash = 'coupon';
                that.couponUserObtain(couponCache.curType, function(result){
                    couponCache.type1.data = result.data;
                    that.renderCoupon(result);
                });
            }
        },
        getCounpons: function(callback) {
            var that = this;
            $.Func.getUserInfo();
            if($.User.wxgzh){
                if(couponCache.type1.data){
                    $.isFunction(callback) && callback(couponCache.type1.data);
                }else{
                    that.couponUserObtain(couponCache.curType, function(result){
                        couponCache.type1.data = result.data;
                        $.isFunction(callback) && callback(result.data);
                    });
                }
            }
        },
        //查询有多少张优惠券可用
        checkCounpon: function(){

            var that = this;
            var number = 0;
            var productid = $('#productid').val();

            that.getCounpons(function(data){
                if(data){
                    $.each(data, function(i, t){
                        if(~$.inArray(productid, t.productsavailable)){
                            number++;
                        }
                        if(i == data.length-1){
                            $('#coupon').val(number);
                            $('#couponLink').html(number + '张可用');
                        }
                    });
                }
            })
        },

        //使用优惠券
        useCoupon: function(){
            var couponid = $(this).data('couponid');
            var productArr = $(this).data('productid').toString().split('.');
            var prodcutid = goodsCache.data[goodsCache.curNum].productid.toString();
            var amount = $(this).data('amount');
            //判断优惠券是否有效
            if(~$.inArray(prodcutid, productArr)){
                goodsCache.discount = +amount;
                $('#coupon').val(couponid);
                $('#couponLink').html('优惠'+amount+'元');
                location.hash = 'coupon';
            }else{
                $.Func.pop('这张优惠券不能用在当前产品上！');
            }
        },
        //创建订单
        createOrder: function(productid, quantity, couponid, callback){

            var param = {
                "jsonrpc": "2.0",
                "method": "Product.CreateOrderGZH",
                "id": 54321,
                "params" : {
                    "userid": $.User.userid,
                    "openid": $.User.openid,
                    "productid": productid,
                    "quantity": quantity,
                    "channelid":1,
                    "appenv":"weixin_gzh_nxb",
                    "couponid":couponid
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                if(result){
                    callback && callback(result);
                }
            })
        },
        //申请支付
        payWX: function(){
            var productid = parseInt($('#productid').val());
            var quantity = parseInt($('#period').val()) || 1;
            var signType = productid.toString()+'-'+quantity.toString();
            var couponid = parseInt($('#couponid').val()) || 0;

            if(!productid){
                $.Func.pop('请选择产品支付');
                return false;
            }
            $('#btnLine').addClass('btnline-loading');
            if(signCache.hasOwnProperty(signType)){
                Action.onpay(signCache[signType]);
            }else{
                Action.createOrder(productid, quantity, couponid, function(sign){

                    if(1 == sign.status){       //下单成功
                        signCache[signType] = sign;
                        Action.onpay(sign);     //下单失败
                    }else{
                        $.Func.pop(sign.statusmsg);
                        $('#btnLine').removeClass('btnline-loading');
                    }
                });
            }
        },
        //调起支付
        onpay: function(sign){
            var that = Action;
            wx.ready(function () {
                function onBridgeReady() {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            "appId": sign.appId,     //公众号名称，由商户传入
                            "timeStamp": sign.timeStamp,  //时间戳，自1970年以来的秒数
                            "nonceStr": sign.nonceStr, //随机串
                            "package": sign.package,
                            "signType": sign.signType,         //微信签名方式：
                            "paySign": sign.paySign //微信签名
                        },
                        function (res) {
                            //支付成功
                            if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                that.payCoupons(sign.orderid, function(){
                                    var money = totalPrice.toFixed(2);
                                    location.href = 'pay_result.html?status=1&productid='+ goodsCache.productclass +'&money='+ money;
                                });
                            }else{
                                //location.href = 'pay_result.html?status=0';
                            }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                            $('#btnLine').removeClass('btnline-loading');
                        }
                    );
                }

                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            });
        },
        //支付成功后，获取优惠券
        payCoupons: function(orderid, callback){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "Coupon.CouponOrderGift",
                "id": 54321,
                "params" : {
                    "orderid": orderid,
                    "channel":100
                }
            };
            $.Func.ajax(param, function(res){
                var result = res.result;
                if(result){
                    $.isFunction(callback) && callback(result);
                }
            })
        },
        //切换优惠券tab
        showTab: function(){
            var that = Action;
            var index = $(this).data('type') || 1;
            couponCache.curType = index;

            $(this).parent().children().removeClass('on');
            $(this).addClass('on');
            if(couponCache['type'+index].data){
                that.renderCoupon(couponCache['type'+index]);
            }else{
                that.couponUserObtain(couponCache.curType, function(result){
                    that.renderCoupon(result);
                    couponCache['type'+index].data = result.data;

                });
            }
        },
        couponUserObtain: function(typeid, callback){
            var that = this;
            uin = $.User.userid;
            var param = {
                "jsonrpc": "2.0",
                "method": "Coupon.CouponUserObtain",
                "id": 54321,
                "params" : {
                    "userid": uin,
                    "type": typeid
                }
            };
            $.Func.ajax(param, function(res){
                var result = res.result;
                if(result){
                    $.isFunction(callback) && callback(result);
                }
            })
        },
        renderCoupon: function(result){

            if(!couponCache.iscroll){
                couponCache.iscroll = new IScroll('#wrapper');
            }

            //判断是否空数据
            if(result.data){
                $('#wrapper').removeClass('show-empty');
            }else{
                $('#wrapper').addClass('show-empty');
            }

            var html = Template('li-template', result);
            $('#couponList').html(html);
            couponCache.iscroll.refresh();  //刷新数据
        },
        closeLayer: function () {
            $(this).parent().parent().removeClass('show');
        },
        filter: function(s){
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        init : function(){
            $.Func.getJSAPI();
            var productid = $.Func.getParam('productid');
            if(productid){
                productid = this.filter(productid);
                this.productInfo(productid);
                this.bindEvent();
            }

        }
    }

    module.exports = Action;
});