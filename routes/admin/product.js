var express = require('express');

var router = express.Router(); // 模块化，可挂载的路由句柄

// 引入数据库 Db
var Db = require('../../modules/db.js');  // 引入数据库封装模块

// form提交插件 带图片
var multiparty = require('multiparty');

var fs = require('fs');

router.get('/', function (req, res) {
    Db.find('productmanage', 'product', {}, function (err, data) {
        if (err) {
            return false;
        } else {
            // console.log(data);
            res.render('admin/product/index', {
                table_data: data
            });
        }
    })
})

// add
router.get('/add', function (req, res) {
    res.render('admin/product/add');
})

// doAdd
router.post('/doAdd', function (req, res) {
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
                res.redirect('/admin/product');
                /*上传成功到首页*/
            }
        })
    });
})

// 商品的编辑
router.get('/edit', function (req, res) {
    console.log(1);
    Db.find('productmanage', 'product', {"_id": new Db.ObjectId(req.query.id)}, function (err, data) {
        console.log(data);
        // res.render('/admin/product/edit', {
        //     list: data[0]
        // })
        console.log(data[0]);
        res.render('admin/product/edit',
            {
                list: data[0]
            });
    })
})

// 点击编辑
router.post('/doEdit', function (req, res) {
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
        if (originalFilename) {
            var setData = {
                title,
                price,
                fee,
                description,
                pic
            }
        } else {
            var setData = {
                title,
                price,
                fee,
                description
            }
            fs.unlink(pic, function (err) {
                if (err) {
                    console.log('错误\n', err)
                }
            });
        }

        console.log(_id);
        Db.update('productmanage', 'product', {"_id": new Db.ObjectId(_id)}, setData, function (err, data) {
            if (!err) {
                res.redirect('/admin/product');
            }
        })

    });
})
//  商品的删除
router.get('/delete', function (req, res) {
    console.log({"_id": new Db.ObjectId(req.query.id)});
    Db.deleteOne('productmanage', 'product', {"_id": new Db.ObjectId(req.query.id)}, function (err, data) {
        res.redirect('/admin/product');
    });

})

module.exports = router;