function init() {
    $(".rule").on('tap', function() {
        $('.rule_trigger').toggle();
        $(this).children('.rule_bot').toggleClass('rule_top');
    });
    $('.btns').on('tap', function() {
        $(this).parent().parent().hide();
    });
    $('.btns_two').on('tap', function() {
        $(this).parent().parent().hide();
    });
    $('.btns_ipt').on('tap', function() {
        $(this).parent().parent().hide();
    });
    var URL = "http://app.api.gupiaoxianji.com/v3.7";
    // $(".zjd").on('tap', function () {
    //判断是否在微信打开
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i)!= "micromessenger") {
        //获取用户id
        function GetQueryString(name) {
          
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return r[2];
            return null;
        }
        var userid = GetQueryString('userid');
        if (userid == "" || userid == null || userid == undefined) {

            $(".nav_phone").css('display', 'block');
            $(".btns_ipt").on('tap', function() {
                var phone = $('#ipt').val();
                phone = phone.replace(/(^\s+)|(\s+$)/g, '');
                var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                console.log(phone);
                if (!myreg.test(phone)) {
                    $(".nav_phone").css('display', 'none');
                    $('.player>.tips>.text').html('对不起，手机号不正确!');
                    $('.player').css('display', 'block');
                    $('.zjd').on('tap', function() {
                        $(".nav_phone").css('display', 'block');
                    })
                } else {
                    //判断用户是否注册
                    var kobe = {
                        "id": 54321,
                        "jsonrpc": "2.0",
                        "method": "User.CheckRegist",
                        "params": {
                            "userid": phone
                        }
                    }
                    $.ajax({
                        url: URL,  //接口地址
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify(kobe),
                        success: function(res) {
                            console.log(res);
                            if (res.error) {
                                $('.player>.tips>.text').html(res.error.message);
                                $('.player').css('display', 'block');
                                $('.player>.tips>.btns').html("立即注册");
                                $('.player>.tips>.btns').tap(function() {
                                    window.location.href = "../rigisters2/pay.html";
                                });
                            }
                            else {
                                var parma = {
                                    "id": 54321,
                                    "jsonrpc": "2.0",
                                    "method": "Activity.JoinActivity",
                                    "params": {
                                        "activityname": "act_newyear_info",
                                        "userid": phone
                                    }
                                }
                                $.ajax({
                                    url: URL,  //接口地址
                                    type: "POST",
                                    contentType: "application/json",
                                    dataType: "json",
                                    data: JSON.stringify(parma),
                                    success: function(res) {
                                        console.log(res);
                                        if (res.result.msg == "") {
                                            $('.player>.tips>.text').html('系统错误!');
                                            $('.player').css('display', 'block');
                                        } else {
                                            var result = eval('(' + res.result.msg + ')');
                                            var num = result.left;
                                            console.log(num);
                                            $('.title').html(num);
                                            $('.zjd').on('tap', function() {
                                                $(".nav_phone").css('display', 'none');
                                                var parm = {
                                                    "id": 54321,
                                                    "jsonrpc": "2.0",
                                                    "method": "Activity.JoinActivity",
                                                    "params": {
                                                        "activityname": "act_newyear",
                                                        "userid": phone
                                                    }
                                                }
                                                $.ajax({
                                                    url: URL,
                                                    type: "POST",
                                                    contentType: "application/json",
                                                    dataType: "json",
                                                    data: JSON.stringify(parm),
                                                    success: function(res) {
                                                        console.log(res);
                                                        $(".player_two>.tips_two>.text_two").html(res.result.msg + '<br/>' + '客人,是不是不过瘾呢!(分享活动或者微信绑定账号可以继续砸哦');
                                                        $('.title').html(res.result.left);
                                                        $(".player_two").css('display', 'block');
                                                        if (res.result.left == 0) {
                                                            $(".player_two>.tips_two>.btns").html('继续攒彩头');
                                                        }
                                                    }
                                                })
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            });
        }
        else {
            var parma = {
                "id": 54321,
                "jsonrpc": "2.0",
                "method": "Activity.JoinActivity",
                "params": {
                    "activityname": "act_newyear_info",
                    "userid": userid
                }
            }
            $.ajax({
                url: URL,  //接口地址
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(parma),
                success: function(res) {
                    console.log(res);
                    if (res.result.msg == "") {
                        $('.player>.tips>.text').html('系统错误!');
                        $('.player').css('display', 'block');
                    } else {
                        var result = eval('(' + res.result.msg + ')');
                        var num = result.left;
                        console.log(num);
                        $('.title').html(num);
                        $('.zjd').on('tap', function() {
                            $(".nav_phone").css('display', 'none');
                            var parm = {
                                "id": 54321,
                                "jsonrpc": "2.0",
                                "method": "Activity.JoinActivity",
                                "params": {
                                    "activityname": "act_newyear",
                                    "userid": userid
                                }
                            }
                            $.ajax({
                                url: URL,
                                type: "POST",
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify(parm),
                                success: function(res) {
                                    console.log(res);
                                    $(".player_two>.tips_two>.text_two").html(res.result.msg + '<br/>' + '客人,是不是不过瘾呢!(分享活动或者微信绑定账号可以继续砸哦');
                                    $('.title').html(res.result.left);
                                    $(".player_two").css('display', 'block');
                                    if (res.result.left == 0) {
                                        $(".player_two>.tips_two>.btns").html('继续攒彩头');
                                    }
                                }
                            })
                        })
                    }
                }
            })
        }
        // });
    } else {
        //从微信进入的！！！！！！！
        //获取用户userid
        var getCookie = function(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
                // return unescape(arr[2]);
            }
            else {
                return null;
            }
        }
        var userid = getCookie("userid");
        // var userid;
        console.log(userid);
        //判断用户是否绑定
        if (userid == "" || userid == null) {
            $(".player>.tips>.text").html("客人，绑定就能砸蛋咯~");
            $(".player>.tips>.btns").html("知道了,退下吧");
            $(".player").css('display', 'block');
            $(".player>.tips>.btns").on('tap', function() {
                location.href = "http://wx.gupiaoxianji.com/auth/indexcallbackbind/";
            });
        } else {
            var parma = {
                "id": 54321,
                "jsonrpc": "2.0",
                "method": "Activity.JoinActivity",
                "params": {
                    "activityname": "act_newyear_info",
                    "userid": userid
                }
            }
            $.ajax({
                url: URL,  //接口地址
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(parma),
                success: function(res) {
                    console.log(res);
                    if (res.result.msg =="") {
                        $('.player>.tips>.text').html('系统错误!');
                        $('.player').css('display', 'block');
                    } else {
                        var result = eval('(' + res.result.msg + ')');
                        var num = result.left;
                        console.log(num);
                        $('.title').html(num);
                        $('.zjd').on('tap', function() {
                            $(".nav_phone").css('display', 'none');
                            var parm = {
                                "id": 54321,
                                "jsonrpc": "2.0",
                                "method": "Activity.JoinActivity",
                                "params": {
                                    "activityname": "act_newyear",
                                    "userid": userid
                                }
                            }
                            $.ajax({
                                url: URL,
                                type: "POST",
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify(parm),
                                success: function(res) {
                                    console.log(res);
                                    $(".player_two>.tips_two>.text_two").html("客人,前往股票先机APP分享活动或者“股票先机客户服务”微信公众号进行绑定就能继续砸蛋咯");
                                    $('.title').html(res.result.left);
                                    $(".player_two").css('display', 'block');
                                    if (res.result.left == 0) {
                                        $(".player_two>.tips_two>.btns_two").html('知道了，退下吧~');
                                    }
                                }
                            })
                        })
                    }
                }
            })
        }
    }
    // });

    //获取用户中奖的名单
    var parma = {
        "id": 54321,
        "jsonrpc": "2.0",
        "method": "Activity.JoinActivity",
        "params": {
            "activityname": "act_newyear_win_list",
            "userid": "18575590207"
        }
    }
    $.ajax({
        url: URL,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parma),
        success: function(res) {
            console.log(res);
            arr = res.result.msg.split(';'); //字符分割 
            console.log(arr);
            strlist = '';
            for (var i = arr.length - 1; i >= 0; i--) {
                strlist += arr[i] + '<br/>';
            }
            $('.ul ul').html(strlist);
        }
    })
};

