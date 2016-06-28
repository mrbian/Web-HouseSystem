var Router = require('koa-router');

// local
var fs = require('fs');
var path = require('path');
var util = require('util');

var render = require('./../instances/render.js');
var db = require('./../models/index.js');
var debug = require('./../instances/debug.js');
var auth = require('../helpers/auth.js');

var router = new Router();

/****************************
 登录过滤
 ***************************/
// todo: for test
router.use(function *(next) {
    //context.set(this)  只是读不会产生临界区，但是有读有写可能会产生临界区
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