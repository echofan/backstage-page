define(function(require, exports, module) {

    var template = require('libs/template');

    var Action = {
        bindEvent : function(){
            $('body').delegate('.js-tap', $.Func.TAP, function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            });
        },
        //支付完成跳转回去
        back: function(){

            var productid = $.Func.getParam('productid');
            if(!productid) return;

            switch (productid){
                case 'yingyan':
                    location.href = $.CONFIG.BASE + 'web/hawkeye/index.html';
                    break;
                case 'weipan':
                    location.href = $.CONFIG.BASE + 'web/club/wallet.html';
                    break;
                default:
                    location.href = $.CONFIG.BASE + 'web/fund/detail.html?fundid=' + productid;
                    break;
            }

        },
        init: function(){
            $.Func.getUserInfo();
            var data = {
                status: $.Func.getParam('status'),
                money: $.Func.getParam('money')
            }
            var html = template('result-template', data);
            $('#result').html(html);

            this.bindEvent();
        }
    }

    module.exports = Action;
});