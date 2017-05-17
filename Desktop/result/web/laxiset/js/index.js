(function () {
    var getCookie = function (name) {
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
    console.log(userid);
    if (userid ==""||userid==null) {
        console.log(123);
        $(".poplayer").css("display", "block");
        div2.onclick = function () {
            enable = 0;
            $(".ipt").prop('readonly', true);
            $(".title").css("color", "gray");
            if (div1.className = (div1.className == "close1")) {
                div1.className = 'open1';
                $(".title").css("color", "black");
                $(".ipt").prop('readonly', false);
            } else {
                div1.className = 'close1';
            }
            if (div2.className = (div2.className == "close2")) {
                enable = 1;
                div2.className = 'open2';
            } else {
                div2.className = 'close2';
            }
        }
        $(".btn").on('click', function () {
            $(".no_bind").fadeIn(500).fadeOut(500);
        });
    } else {
        var param = {
            "id": 54321,
            "jsonrpc": "2.0",
            "method": "Other.GetUserSetting",
            "params": {
                // "userid": "15158433873"
                "userid":userid
            }
        }
        $.ajax({
            url: "http://app.api.gupiaoxianji.com/v3.7",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(param),
            success: function (data) {
                console.log(data);
                if (data.result.result == 'ok' && data.result.push != null) {
                    var count = data.result.push.count;
                    var app_push = data.result.push.app_push;
                    var wx_push = data.result.push.wx_push;
                    if (app_push == 1) {
                        $(".app_push").attr("checked", "checked");
                    }
                    if (wx_push == 1) {
                        $(".wx_push").attr("checked", "checked");
                    }
                    var enable = data.result.push.enable;
                    console.log(enable);
                }
                $(".app_push").click(function () {
                    if (app_push == 1) {
                        app_push = 0;
                    } else if (app_push == 0) {
                        app_push = 1;
                    }
                });
                $(".wx_push").click(function () {
                    if (wx_push == 1) {
                        wx_push = 0;
                    } else if (wx_push == 0) {
                        wx_push = 1;
                    }
                });
                enable = 1;
                var div2 = document.getElementById("div2");
                var div1 = document.getElementById("div1");
                $(".ipt").prop('readonly', false);
                console.log(123);
                div2.onclick = function () {
                    enable = 0;
                    $(".ipt").prop('readonly', true);
                    $(".title").css("color", "gray");
                    if (div1.className = (div1.className == "close1")) {
                        div1.className = 'open1';
                        $(".title").css("color", "black");
                        $(".ipt").prop('readonly', false);
                    } else {
                        div1.className = 'close1';
                        console.log(456);
                    }
                    if (div2.className = (div2.className == "close2")) {
                        enable = 1;
                        div2.className = 'open2';
                        console.log(123);
                    } else {
                        div2.className = 'close2';
                    }
                }
                $("#stockcount").val(count);
                $(".btn").on("click", function () {
                    //获取用户输入的value值
                    var values = $('#stockcount').val();
                    console.log(values);
                    var kobes = {
                        "id": 54321,
                        "jsonrpc": "2.0",
                        "method": "Other.SetUserPush",
                        "params": {
                            "userid": userid,
                            "push": {
                                "count": parseInt(values),
                                "enable": enable,
                                "app_push": app_push,
                                "wx_push": wx_push
                            }
                        }
                    };
                    $.ajax({
                        url: "http://app.api.gupiaoxianji.com/v3.7",
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify(kobes),
                        success: function (data) {
                            console.log(data);
                            if (data.result.result == "ok") {
                                $(".popup").fadeIn(500).fadeOut(500);
                            } else {
                                $(".popup_no").fadeIn(500).fadeOut(500);
                            }
                        }
                    });
                });
            }
        });
    }
    //关闭弹窗
    $(".js-tap").on('click', function () {
        $(this).parent().parent().css('display', "none");
    });

})();