/**
 * Created by bln on 16-6-28.
 */
var render = require('../../instances/render');

module.exports = (router) => {
    router.get('/admin/index',function *(){
        var ctx = this;
        ctx.body = yield render('admin/index.html');
    });
};