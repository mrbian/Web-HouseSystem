/**
 * Created by bln on 16-6-28.
 */
const render = require('../../instances/render');
const auth = require('../../helpers/auth');
const db = require('../../models/index');
const Business = db.models.Business;
const BusinessKind = db.models.BusinessKind;
const co = require('co');
/**
 * 将表示层也分层正是三层五层架构的思想
 * @param router
 */

module.exports = (router) => {
    router.get('/admin/index',function *(){
        var ctx = this;
        // ctx.body = yield render('admin/index.html');
        var user = yield auth.user(this);
        if(user.type == 100){
            ctx.redirect('/admin/set_material_kind');
        }else if(user.type == 0){
            ctx.redirect('/user/list');
        }else{
            ctx.redirect('/admin/first_check');
        }

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
        var business_id = ctx.params.business_id;
        var business_kind = yield BusinessKind.findOne({
            where : {
                id : business_id,
                type : 1
            }
        });
        ctx.body = yield render('admin/small_business_detail.html',{
            data : JSON.stringify(business_kind)
        });
    });

};