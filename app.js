/**
 *  提取路由模块
 */

var express = require('express');

// 引入模块
var admin  = require('./routes/admin.js');
var index  = require('./routes/index.js');


var app = new express();

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

// 配置静态资源
app.use(express.static('public'));
app.use('/upload', express.static('upload'));
app.get('/', function (req, res) {
    res.send('index');
})

// 模板引擎
app.set('view engine', 'ejs');

// 配置静态资源
app.use(express.static('public'));



// admin

app.use('/admin',admin);
app.use('/',index);




app.listen(8888);