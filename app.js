var express = require('express');

var md5 = require('md5-node');
var app = new express();
var fs = require('fs');
// 数据库 操作模块
var Db = require('./modules/db.js');
var session = require('express-session'); // 引入seesion 服务器生成key-value 并返回key给前台
app.use(session({
    // 配置session
    secret: 'keyboard cat',
    resave: false, // session没有修改的时候 也给保存
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30  // 过期时间
    },
    rolling: true // 操作重新累计 30分钟
}));

app.set('view engine', 'ejs');

// 配置静态资源
app.use(express.static('public'));
app.use('/upload', express.static('upload'));
app.get('/', function (req, res) {
    res.send('index');
})

// --- 当有图片模块上传的时候，不使用body-parser ---
/*var boydParser = require('body-parser');
app.use(boydParser.urlencoded({ extended: false }));*/

// form提交插件 带图片
var multiparty = require('multiparty');

// 自定义中间键 判断是否登陆

app.use(function (req, res, next) {
    // 只有登陆页面不需要判别 是不是登陆了
    console.log(req.url);
    if (req.url == '/login' || req.url == '/doLogin') {
        next();
    } else {
        // 当session未保存cookie中
        if (session.userinfo && session.userinfo.username != '') {
            next();
        } else {
            res.redirect('/login');
        }
    }
})


// login 
app.get('/login', function (req, res) {
    res.render('login')
})

// product route
app.get('/product', function (req, res) {
    Db.find('productmanage', 'product', {}, function (err, data) {
        if (err) {
            return false;
        } else {
            // console.log(data);
            res.render('product', {table_data: data});
        }
    })
});

// product-add route
app.get('/productadd', function (req, res) {
    res.render('productadd'); // 显示增加商品的页面
})

// product-edit route
app.get('/productedit', function (req, res) {
    Db.find('productmanage', 'product', {"_id": new Db.ObjectId(req.query.id)}, function (err, data) {
        console.log(data);
        res.render('productedit', {
            list: data[0]
        })
    })
})

// form upload
app.post('/doAdd', function (req, res) {
    var form = new multiparty.Form(); // form 实例
    form.uploadDir = 'upload'; // 上传图片保存的地址
    form.parse(req, function (err, fields, files) {
        // console.log(fields); // 获取表单的数据
        // console.log(files); // 图片上传成功返回的信息
        var title = fields.title[0];
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];
        var pic = files.pic[0].path;
        console.log(pic);
        // console.log(pic);
        Db.insert('productmanage', 'product', {
            title,
            price,
            fee,
            description,
            pic
        }, function (err, data) {
            if (!err) {
                res.redirect('/product');
                /*上传成功到首页*/
            }
        })
    });

})

// product-edit 
app.post('/doProductEdit', function (req, res) {
//    编辑product的相关操作
    var form = new multiparty.Form(); // form 实例
    form.uploadDir = 'upload'; // 上传图片保存的地址
    form.parse(req, function (err, fields, files) {
        var _id = fields._id[0];
        var title = fields.title[0];
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];
        var pic = files.pic[0].path;

        var originalFilename = files.pic[0].originalFilename;
        if(originalFilename){
           var setData = {
               title,
               price,
               fee,
               description,
               pic
           }
        }else {
            var setData = {
                title,
                price,
                fee,
                description
            }
            fs.unlink(pic,function (err) {
                if(err){
                    console.log('错误\n',err)
                }
            });
        }

        console.log(_id);
        Db.update('productmanage','product',{"_id": new Db.ObjectId(_id)},setData,function (err,data) {
            if(!err){
                res.redirect('/product');
            }
        })

    });
})

// product-delete route
app.get('/productdelete', function (req, res) {
        console.log( {"_id": new Db.ObjectId(req.query.id)});
        Db.deleteOne('productmanage', 'product', {"_id": new Db.ObjectId(req.query.id)}, function (err, data) {
            res.redirect('/product');
        });


})

// 获取登陆提交的数据
app.post('/doLogin', function (req, res) {
    console.log(req.body);  // 获取注册的内容
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
                    res.redirect('/product'); // 重定向
                    // 保存用户信息
                    session.userinfo = data[0];
                    app.locals['username'] = session.userinfo.username;

                } else {
                    console.log(err);
                    console.log('登陆失败');
                    res.send("<script>alert('登陆失败');location.href='/login'</script>")
                }
            }
        })

    })


})

app.get('/loginout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            session.userinfo = null;
            res.redirect('/login');
        }
    })
})


app.listen(8888);