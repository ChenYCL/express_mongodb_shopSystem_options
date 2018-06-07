var express = require('express');

var router = express.Router(); // 模块化，可挂载的路由句柄

// form提交插件 带图片
var multiparty = require('multiparty');

// 引入md5

var md5 = require('md5-node');

// 引入数据库 Db
var Db = require('../../modules/db.js');  // 引入数据库封装模块



router.get('/',function (req,res)
{
    res.render('admin/login');
})

// 处理登陆的业务逻辑
router.post('/doLogin',function (req,res)
{
    // 连接mongodb
    var form = new multiparty.Form(); // form 实例
    form.parse(req, function (err, fields, files) {
        // 得到表单信息 查询
        Db.find('productmanage', 'user', {
            "username": fields.username[0],
            "password": md5(fields.password[0])
        }, function (err, data) {
            if (err) {
                console.log(err);
                return false;
            } else {
                if (data.length > 0) {
                    console.log('登陆成功');
                    req.session.userinfo=data[0];
                    req.app.locals['username'] = req.session.userinfo.username;
                    res.redirect('/admin/product');  /*登录成功跳转到商品列表*/

                } else {
                    console.log(err);
                    console.log('登陆失败');
                    res.send("<script>alert('登陆失败');location.href='/admin/login'</script>")
                }
            }
        })

    })
})


router.get('/loginOut',function(req,res){


    //销毁session

    req.session.destroy(function(err){

        if(err){
            console.log(err);
        }else{
            // session.userinfo = null;
            res.redirect('/admin/login');
        }
    })
})

module.exports = router;