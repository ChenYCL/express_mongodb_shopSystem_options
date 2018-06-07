var express = require('express');

var router = express.Router(); // 模块化，可挂载的路由句柄

router.get('/',function (req,res)
{
    res.send('显示用户首页');
})

router.get('/add',function (req,res)
{
    res.send('显示增加用户');
})



module.exports = router;