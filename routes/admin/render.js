/**
 * Created by bln on 16-6-28.
 */
const render = require('../../instances/render');
const auth = require('../../helpers/auth');
const co = require('co');



module.exports = (router) => {
    router.get('/admin/index',function *(){
        var ctx = this;
        ctx.body = yield render('admin/index.html');
    });

    router.get('/admin/first_check',function *(){
       var ctx = this;
       ctx.body = yield render('admin/first_check.html');
    });
    
    router.get('/admin/set_material_kind',function *(){
        var ctx = this;
        ctx.body = yield render('admin/set_material_kind.html');
    });

    router.get('/admin/set_business_kind',function *(){
        var ctx = this;
        ctx.body = yield render('admin/set_business_kind.html');
    });

    router.get('/admin/set_small_business_kind',function *(){
        var ctx = this;
        ctx.body = yield render('admin/set_small_business_kind.html');
    })
};