/**
 * Created by bln on 16-6-28.
 */
var render = require('../../instances/render');
module.exports = (router) => {
    router.get('/user/index',function *(){

    });
    
    router.get('/user/form', function *() {
        var ctx = this;
        ctx.body = yield render('user/form.html');
    })
};