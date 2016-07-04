/**
 * Created by bln on 16-6-28.
 */
var render = require('../../instances/render');
const auth = require('../../helpers/auth');
const Audit = require('../../models/index').models.Audit;
const Business = require('../../models/index').models.Business;

const FIRST_CHECK = /^http:\/\/(\w+)?(:\d+)\/admin\/first_check$/;

module.exports = (router) => {
    router.get('/admin/index',function *(){
        var ctx = this;
        ctx.body = yield render('admin/index.html');
    });

    router.get('/admin/first_check',function *(){
       var ctx = this;
       ctx.body = yield render('admin/first_check.html');
    });
    router.post('/admin/first_check', function *() {
        let ctx = this;
        console.log(ctx.body);
    });
    
    
    router.get('/admin/set_material_kind',function *(){
        var ctx = this;
        ctx.body = yield render('admin/set_material_kind.html');
    });
    
    router.get('/admin/first_check_data', function *() {
        var ctx = this;
        // 检查cookie和referer
        let header = ctx.header;
        // console.log(ctx);
        if (FIRST_CHECK.test(header.referer)) {
            let type_num = (yield auth.user(this)).type;
            
            let business_id = yield Audit.findAll({
                where: {
                    type:type_num
                }
            }).map(function (value) {
                return value.dataValues.business_id;
            });
            
            ctx.body = yield Business.findAll({
                where: {
                    id: business_id
                }
            });
        } else {
            ctx.status = 404;
            ctx.body = yield {};
        }
    });
};