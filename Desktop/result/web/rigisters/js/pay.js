$(function () {
    $('.smscode_right').on('click', function () {
        _this = $(this);
        var phone = $('#username').val();
        phone = phone.replace(/(^\s+)|(\s+$)/g, '');
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(phone)) {
            $('.player').css('display', 'block');
            $('.text').text("手机号输入有误！");
            return false;
        } else {
            var param = {        //发送验证码请求
                "id": 54321,
                "jsonrpc": "2.0",
                "method": "Other.SendVerificationCode",
                "params": {
                    "phone": phone
                }
            }
            $.ajax({
                url: "http://app.api.gupiaoxianji.com/v3.7",  //接口地址
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(param),
                success: function (res) {
                    console.log(res);
                    $('.register').on('click', function () {
                    if($('#checkout').is(':checked')){                          
                        var smscode = $('#smscode').val();
                        // var smscode =3355;
                        var passwd = $('#password').val();
                        if (smscode) {
                            smscode = smscode.replace(/(^\s+)|(\s+$)/g, '');
                        }
                        // 检查验证码是否正确
                        var pattern = new RegExp("^\\d{4}$");
                        if (!smscode || !pattern.test(smscode)) {
                            $('.player').css('display', 'block');
                            $('.text').html('验证码有误!');
                        }

                        if (passwd) {
                            passwd = passwd.replace(/(^\s+)|(\s+$)/g, '');
                        }
                        var pwd = new RegExp(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/);
                        if (!passwd || pwd.test(passwd)) {
                            if (!pwd.test(passwd)) {
                                $('.player').css('display', 'block');
                                $('.text').html('请输入合格的密码');
                            }
                        }
                        var inviteCode = $('#inviteCode').val();
                        var kobe = {
                            "id": 54321,
                            "jsonrpc": "2.0",
                            "method": "User.Regist",
                            "params": {
                                "channel": 1,
                                "mobile": parseInt(phone),
                                "nickname": phone,
                                "passwd": passwd,
                                "category": 'regist',
                                "inviteCode": inviteCode,
                                "smscode": smscode
                            }
                        }
                        $.ajax({
                            url: "http://app.api.gupiaoxianji.com/v3.7",  //接口地址
                            type: "POST",
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify(kobe),
                            success: function (res) {
                                console.log(res);
                                if (passwd && smscode) {
                                    if (res.error) {
                                        $('.player').css('display', 'block');
                                        $('.text').html(res.error.message)
                                    }
                                    if (res.result) {
                                        if (res.result.status == 1) {
                                            $('.player').css('display', 'block');
                                            $('.text').html('注册成功！');
                                        }
                                        else if (res.result.status == 2) {
                                            $('.player').css('display', 'block');
                                            $('.text').html(res.result.statusmsg);
                                        }
                                        else if (res.result.status == 4) {
                                            $('.player').css('display', 'block');
                                            $('.text').html(res.result.statusmsg);
                                        }
                                    }
                                }

                            }
                        });
                     }else{
                            $('.player').css('display', 'block');
                            $('.text').html("请同意服务协议"); 
                       }
                    });
                }
            });
            //验证码倒计时
            _this.addClass("disabled");
            $(".smscode_right").attr("disabled", true);
            var seconds = 60;
            var ids = setInterval(function () {
                seconds--;
                _this.html(seconds + '秒后获取');
                if (seconds < 0) {
                    _this.removeClass('disabled');
                    _this.html("获取验证码");
                    $(".smscode_right").attr("disabled", false);
                    clearInterval(ids);
                }
            }, 1000);
        }
    })
    $.md5($('#password').val());
    $('.btns').on('click', function () {
        $(this).parent().parent().hide();
    });
});