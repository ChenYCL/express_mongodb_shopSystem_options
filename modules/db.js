var MongoClient = require('mongodb').MongoClient;
var DbUrl = 'mongodb://119.29.23.185:27017';
var ObjectId = require('mongodb').ObjectId;

// 暴露 ObjectID
exports.ObjectId = ObjectId;

function __connectDb(callback) {
    MongoClient.connect(DbUrl, function (err, client) {
        if (err) {
            console.log('数据库连接失败');
            return;
        }
        // 增加 修改 删除
        callback(err, client); // 解决异步
    })
}

/**
 * 数据库查询
 * @param schemaname
 * @param collectionname
 * @param json
 * @param callback
 */
exports.find = function (schemaname, collectionname, json, callback) {
    __connectDb(function (err, client) {
        var result = client.db(schemaname).collection(collectionname).find(json);
        result.toArray(function (err, data) {
            callback(err, data); // 拿到数据执行回调
            client.close(); // 断开连接
        })
    })
}

/**
 * 数据库插入数据
 * @param schemaname 表名
 * @param collectionname 集合名
 * @param json 插入内容
 * @param callback
 */
exports.insert = function (schemaname, collectionname, json, callback) {
    __connectDb(function (err, client) {
        if (err) {
            console.log(err);
            return false;
        }
        client.db(schemaname).collection(collectionname).insertOne(json, function (error, data) {
            callback(error, data);
        })

    })
}

/**
 * 数据库更新
 * @param schemaname
 * @param collectionname
 * @param json1  查询条件
 * @param json2   修改内容
 * @param callback
 */
exports.update = function (schemaname, collectionname, json1, json2, callback) {
    __connectDb(function (err, client) {
        if (err) {
            console.log(err);
            return false;
        }
        client.db(schemaname).collection(collectionname).updateOne(json1, {$set: {json2}}, function (error, data) {
            callback(error, data);
        })

    })
}


exports.deleteOne = function (schemaname, collectionname, json1, callback) {
    __connectDb(function (err, client) {
        client.db(schemaname).collection(collectionname).deleteOne(json1, function (error, data) {
            callback(error, data);
        })
    })
}
