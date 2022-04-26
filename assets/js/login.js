$(function() {
    //点击去注册账号的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();

    })
    $('#link_login').on('click', function() {
            $('.reg-box').hide();
            $('.login-box').show();


        })
        //从layui中获取from对象
    var form = layui.form;
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则
    form.verify({
            //自定义一个psw的校验规则
            'pwd': [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
            //检验两次密码是否一致
            repwd: function(value) {
                //通过形参拿到的是确认密码框中的内容
                //还需要拿到密码框中的内容 进行一次等于比较  失败 return一个提示消息
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次输入的密码不一致';
                }


            }

        })
        //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                layer.msg('注册成功！请登录');

            })
            //模拟人的点击行为
        $('#link_login').click();



    })
    $('#form_login').submit(function(e) {
        //组织默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                //将登陆成功的token字符串保存到localStorage
                localStorage.setItem('token', res.token);
                console.log(res.token);
                //跳转到后台主页
                location.href = '/index.html';

            }
        })

    })




})