$(function() {
    //调用getUserInfo获取用户的基本信息
    getUserInfo();

    var layer = layui.layer;
    //按钮实现退出功能
    $('#btnLogout').on('click', function() {
        //提示用户是否确认退出
        layer.confirm('is not', { icon: 3, title: '提示' }, function(index) {
            //do something
            //清空本地存储中的token
            localStorage.removeItem('token');
            //2重新跳转到登录页面
            location.href = '/login.html'
                //关闭退出询问框
            laye.close(index);

        })
    })



})


//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        methode: 'GET',
        // headers请求头配置对象
        //headers: { Authorization: localStorage.getItem('token') || '' },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            };
            // / renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
        //无论成功还是失败，最终都会调用complete回调函数
        // complete: function(res) {
        //     //console.log('执行了complete 回调：');
        //     //console.log(res);
        //     //在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //强制清空token
        //         localStorage.removeItem('token');
        //         //强制跳转登录页面
        //         location.href = '/login.html';
        //     }

        // }

    })

}
//渲染用户的头像
function renderAvatar(user) {
    //获取用户的名称
    var name = user.nickname || user.username;
    //设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //按需渲染用户的头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();

    } else {
        //渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();

    }

}