var express = require('express');

var router = express.Router(); // 模块化，可挂载的路由句柄

router.get('/',function (req,res)
{
    res.send('index');
})

router.get('/product',function (req,res)
{
    res.send('product页面');
})

module.exports = router;