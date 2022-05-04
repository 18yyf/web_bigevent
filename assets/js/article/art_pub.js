$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    //初始化富文本编辑器
    initEditor();
    //定义加载文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败！')
                }
                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //一定要记得调用form.render()方法
                form.render();


            }

        })
    }

    //获取剪裁区区域的DOM元素
    var $image = $('#image');
    //配置选项
    const options = {
            //纵横比
            aspectRatio: 400 / 280,
            //指定预览区域
            preview: '.img-preview'
        }
        //创建剪裁区域
    $image.cropper(options);

    //选择封面的按钮来绑定点击事件
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();

        })
        //监听coverFile的change事件 获取用户选择的文件列表 
    $('#coverFile').on('change', function(e) {
            //获取用户选择的文件
            var files = e.target.files;
            if (files.length === 0) {
                return layer.msg('请选择照片');
            }

            //将文件转化为路径
            var newImgURL = URL.createObjectURL(files[0]);
            //重新初始化剪裁
            $image
                .cropper('destroy') //销毁旧的剪裁区域
                .attr('src', newImgURL) //重新设置图片区域路径
                .cropper(options) //重新初始化剪裁区域

        })
        //定义文章的发布状态
    var art_state = '已发布';

    //为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
            art_state = '草稿';

        })
        // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
            // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
            // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
            // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }


})