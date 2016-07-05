var Router = require('koa-router');

// local
var fs = require('fs');
var path = require('path');
var util = require('util');

var render = require('./../instances/render.js');
var db = require('./../models/index.js');
var debug = require('./../instances/debug.js');
var auth = require('../helpers/auth.js');
var context = require('../instances/context');
var User = db.models.User;
var router = new Router();

/****************************
 登录过滤
 ***************************/
// todo: for test
router.use(function *(next) {
    var test_user = yield User.findOne({
        where : {
            type : 3
        }
    });
    auth.login(this,test_user);
    context.set(this); //这个context只用来读，不写,auth.login()会修改this，每次login都需要重新set一下
    var user = yield auth.user(this);
    yield next;
});

/****************************/

var loadDir = (dir) => {
    fs
        .readdirSync(dir)
        .forEach( (file) => {
            var nextPath = path.join(dir, file);
            var stat = fs.statSync(nextPath);
            if (stat.isDirectory()) {
                loadDir(nextPath);
            } else if (stat.isFile() && file.indexOf('.') !== 0 && file !== 'index.js') {
                require(nextPath)(router);
            }
        });
};

loadDir(__dirname);

module.exports = router.middleware();