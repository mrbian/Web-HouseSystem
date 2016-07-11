/**
 * Created by bln on 16-6-28.
 */
const render = require('../../instances/render');
const auth = require('../../helpers/auth');
const db = require('../../models/index');
const Business = db.models.Business;
const co = require('co');
/**
 * 将表示层也分层正是三层五层架构的思想
 * @param router
 */

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
    });

    router.get('/admin/small_business_detail',function *(){
        var ctx = this;
        ctx.body = yield render('admin/small_business_detail.html',{
            data : JSON.stringify({})
        });
    });

    router.get('/admin/small_business_detail/:business_id',function *(){
        var ctx = this;
        var business_id = ctx.query.business_id;
        var business = yield Business.findOne({
            where : {
                id : business_id
            }
        });
        ctx.body = yield render('admin/small_business_detail.html',{
            data : JSON.stringify(business)
        });
    });
};