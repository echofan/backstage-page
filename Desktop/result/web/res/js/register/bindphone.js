// define("register/bindphone",[],function(e,n,s){var a={bindEvent:function(){$("body").delegate(".js-tap","click",function(e){var n=$(this).data("handler");a[n]&&a[n].call(this)})},checkPhone:function(){var e=$("#phone").val();e=e.replace(/(^\s+)|(\s+$)/g,"");var n=/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;return!!n.test(e)&&e},checkSmsCode:function(e,n){var s=$("#smsCode").val();s&&(s=s.replace(/(^\s+)|(\s+$)/g,""));var a=new RegExp("^\\d{4}$");if(!s||!a.test(s))return $.Func.pop("请输入正确短信验证码！"),!1;var t={jsonrpc:"2.0",method:"Other.VerifyVerificationCode",id:54321,params:{phone:e,code:s}};$.Func.ajax(t,function(e){var s=e.result;s&&(s.status>1?$.Func.pop(s.statusmsg):$.isFunction(n)&&n())})},getSmsCode:function(){var e=this,n=a.checkPhone();if(!n)return $.Func.pop("请输入有效的手机号码！"),!1;var s={jsonrpc:"2.0",method:"Other.SendVerificationCode",id:54321,params:{phone:n}},t=$(e).attr("disabled");t||$.Func.ajax(s,function(n){var s=n.result;if(s){var a=($(e).attr("disabled"),60);$(e).addClass("disabled").attr("disabled","disabled").html(a+"s后重新获取");var t=setInterval(function(){a--,a>0?$(e).html(a+"s后重新获取"):($(e).removeClass("disabled").removeAttr("disabled").html("重新发送"),clearInterval(t))},1e3)}else $.Func.pop(n.error.message)})},back:function(){history.go(-1)},closeLayer:function(){$("#layer").removeClass("show")},submit:function(){var e,n=a.checkPhone(),s=$.User.entrance;switch(s){case"club":e=$.CONFIG.CLUB;break;case"fund":e=$.CONFIG.INDEX}a.checkSmsCode(n,function(s){$.User.wxapp||$.Func.bindWeixin(n,$.User.unionid,function(){}),$.User.wxgzh?e?location.href=e:$("body").addClass("show-result"):$.Func.bindGZH(n,$.User.openid,function(n){var s=n.result;if(s)switch(s.status){case 1:$("body").addClass("show-result"),e&&setTimeout(function(){location.href=e},2e3);break;case 2:e?location.href=e:$("body").addClass("show-result");break;default:$.Func.pop(s.statusmsg)}else $.Func.pop(n.error.message)})})},init:function(){$.Func.getUserInfo(),a.bindEvent();var e=$.User.entrance;e&&"bind"!=e&&$("#back").removeClass("hide")}};s.exports=a});


//define("register/bindphone",[],function(b,a,d){console.log(123);var c={isbind:function(){var e={"id":54321,"jsonrpc":"2.0","method":"User.CheckBindGzhNxb","params":{"userid":userid,"openid":openid}};ajax(e,function(f){if(f.result.status==4){$(".bind_ok").show();$(".container").css({"display":"none"})}else{$.Func.getUserInfo();c.bindEvent()}})},bindEvent:function(){$("body").delegate(".js-tap","click",function(g){var f=$(this).data("handler");c[f]&&c[f].call(this)})},checkPhone:function(){var e=$("#phone").val();e=e.replace(/(^\s+)|(\s+$)/g,"");var f=/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;if(!f.test(e)){return false}return e},checkSmsCode:function(e,i){var f=$("#smsCode").val();if(f){f=f.replace(/(^\s+)|(\s+$)/g,"")}var g=new RegExp("^\\d{4}$");if(!f||!g.test(f)){$.Func.pop("请输入正确短信验证码！");return false}var h={"jsonrpc":"2.0","method":"Other.VerifyVerificationCode","id":54321,"params":{"phone":e,"code":f}};$.Func.ajax(h,function(k){var j=k.result;if(j){if(j.status>1){$.Func.pop(j.statusmsg)}else{$.isFunction(i)&&i()}}})},getSmsCode:function(){var g=this;var e=c.checkPhone();if(!e){$.Func.pop("请输入有效的手机号码！");return false}var h={"jsonrpc":"2.0","method":"Other.SendVerificationCode","id":54321,"params":{"phone":e}};var f=$(g).attr("disabled");if(!f){$.Func.ajax(h,function(j){var i=j.result;if(i){var k=$(g).attr("disabled");var l=60;$(g).addClass("disabled").attr("disabled","disabled").html(l+"s后重新获取");var m=setInterval(function(){l--;if(l>0){$(g).html(l+"s后重新获取")}else{$(g).removeClass("disabled").removeAttr("disabled").html("重新发送");clearInterval(m);null}},1000)}else{$.Func.pop(j.error.message)}})}},back:function(){history.go(-1)},closeLayer:function(){$("#layer").removeClass("show")},submit:function(){var e=c.checkPhone();var g=$.User.entrance;var f;switch(g){case"club":f=$.CONFIG.CLUB;break;case"fund":f=$.CONFIG.INDEX;break;default:break}var h=c.checkSmsCode(e,function(i){if(!$.User.wxapp){$.Func.bindWeixin(e,$.User.unionid,function(){})}if(!$.User.wxgzh){$.Func.bindGZH(e,$.User.openid,function(k){var j=k.result;if(j){switch(j.status){case 1:$("body").addClass("show-result");if(f){setTimeout(function(){location.href=f},2000)}break;case 2:if(f){location.href=f}else{$("body").addClass("show-result")}break;default:$.Func.pop(j.statusmsg)}}else{$.Func.pop(k.error.message)}})}else{if(f){location.href=f}else{$("body").addClass("show-result")}}})},init:function(){c.isbind();var e=$.User.entrance;if(e&&e!="bind"){$("#back").removeClass("hide")}}};d.exports=c});


define("register/bindphone", [],
    function (b, a, d) {
        console.log(123);
        var c = {
            isbind: function () {
                //获取用户登录cookie信息
                getCookie = function (name) {
                    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                    if (arr = document.cookie.match(reg)) {
                        return unescape(arr[2]);
                        return unescape(arr[2]);
                    }
                    else {
                        return null;
                    }
                }
                var userid = getCookie("userid");
                var openid = getCookie("openid");
                var e = {
                    "id": 54321,
                    "jsonrpc": "2.0",
                    "method": "User.CheckBindGzhNxb",
                    "params": {
                        // "userid": '15158433873',
                        // "openid": 'ofQzPv__JgWKSRB4eh5AiMmecgms'
                          "userid":userid,
                          "openid":openid
                    }
                };
                $.Func.ajax(e, function (f) {
                    console.log(f);
                    if (f.result.status == 2) {
                        console.log(123);
                        $(".bind_ok").show();
                        $(".container").css({
                            "display": "none"
                        })
                    } else {
                        $.Func.getUserInfo();
                        c.bindEvent()
                    }
                })
            },
            bindEvent: function () {
                $("body").delegate(".js-tap", "click",
                    function (g) {
                        var f = $(this).data("handler");
                        c[f] && c[f].call(this)
                    })
            },
            checkPhone: function () {
                var e = $("#phone").val();
                e = e.replace(/(^\s+)|(\s+$)/g, "");
                var f = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if (!f.test(e)) {
                    return false
                }
                return e
            },
            checkSmsCode: function (e, i) {
                var f = $("#smsCode").val();
                if (f) {
                    f = f.replace(/(^\s+)|(\s+$)/g, "")
                }
                var g = new RegExp("^\\d{4}$");
                if (!f || !g.test(f)) {
                    $.Func.pop("请输入正确短信验证码！");
                    return false
                }
                var h = {
                    "jsonrpc": "2.0",
                    "method": "Other.VerifyVerificationCode",
                    "id": 54321,
                    "params": {
                        "phone": e,
                        "code": f
                    }
                };
                $.Func.ajax(h,
                    function (k) {
                        var j = k.result;
                        if (j) {
                            if (j.status > 1) {
                                $.Func.pop(j.statusmsg)
                            } else {
                                $.isFunction(i) && i()
                            }
                        }
                    })
            },
            getSmsCode: function () {
                var g = this;
                var e = c.checkPhone();
                if (!e) {
                    $.Func.pop("请输入有效的手机号码！");
                    return false
                }
                var h = {
                    "jsonrpc": "2.0",
                    "method": "Other.SendVerificationCode",
                    "id": 54321,
                    "params": {
                        "phone": e
                    }
                };
                var f = $(g).attr("disabled");
                if (!f) {
                    $.Func.ajax(h,
                        function (j) {
                            var i = j.result;
                            if (i) {
                                var k = $(g).attr("disabled");
                                var l = 60;
                                $(g).addClass("disabled").attr("disabled", "disabled").html(l + "s后重新获取");
                                var m = setInterval(function () {
                                    l--;
                                    if (l > 0) {
                                        $(g).html(l + "s后重新获取")
                                    } else {
                                        $(g).removeClass("disabled").removeAttr("disabled").html("重新发送");
                                        clearInterval(m);
                                        null
                                    }
                                },
                                    1000)
                            } else {
                                $.Func.pop(j.error.message)
                            }
                        })
                }
            },
            back: function () {
                history.go(- 1)
            },
            closeLayer: function () {
                $("#layer").removeClass("show")
            },
            submit: function () {
                var e = c.checkPhone();
                var g = $.User.entrance;
                var f;
                switch (g) {
                    case "club":
                        f = $.CONFIG.CLUB;
                        break;
                    case "fund":
                        f = $.CONFIG.INDEX;
                        break;
                    default:
                        break
                }
                var h = c.checkSmsCode(e,
                    function (i) {
                        if (!$.User.wxapp) {
                            $.Func.bindWeixin(e, $.User.unionid,
                                function () { })
                        }
                        if (!$.User.wxgzh) {
                            $.Func.bindGZH(e, $.User.openid,
                                function (k) {
                                    var j = k.result;
                                    if (j) {
                                        switch (j.status) {
                                            case 1:
                                                $("body").addClass("show-result");
                                                if (f) {
                                                    setTimeout(function () {
                                                        location.href = f
                                                    },
                                                        2000)
                                                }
                                                break;
                                            case 2:
                                                if (f) {
                                                    location.href = f
                                                } else {
                                                    $("body").addClass("show-result")
                                                }
                                                break;
                                            default:
                                                $.Func.pop(j.statusmsg)
                                        }
                                    } else {
                                        $.Func.pop(k.error.message)
                                    }
                                })
                        } else {
                            if (f) {
                                location.href = f
                            } else {
                                $("body").addClass("show-result")
                            }
                        }
                    })
            },
            init: function () {
                c.isbind();
                var e = $.User.entrance;
                if (e && e != "bind") {
                    $("#back").removeClass("hide")
                }
            }
        };
        d.exports = c
    });