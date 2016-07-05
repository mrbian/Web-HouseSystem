/**
 * Created by bln on 16-6-28.
 */
const render = require('../../instances/render');
const auth = require('../../helpers/auth');
const Audit = require('../../models/index').models.Audit;
const Business = require('../../models/index').models.Business;

const FIRST_CHECK = /^http:\/\/(\w+)(:\d+)?\/admin\/first_check$/;
const TYPE = {
    EXCLUSION: 0,
    SUCCESS: 1
};


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
        // body => {type, comment}
        let body = ctx.request.body;
        ctx.checkBody('type').notEmpty();
        ctx.checkBody('comment').notEmpty().toString();
        ctx.checkBody('id').notEmpty();
        if (body.type === TYPE.EXCLUSION) {
            yield Audit.update({
                comment: body.comment,
                state: -1
            }, {
                where: {
                    id: body.id
                }
            });
            ctx.body = yield {finish: true};
        } else if (body.type === TYPE.SUCCESS) {
            let where_data = {
                where: {
                    id: body.id
                }
            };


            let success_type = (yield Audit.findOne(where_data))
                .dataValues.type;

            let update_data = {
                type: success_type + 1
            };
            if (success_type > 3) {
                update_data.state = 1;
            }
            yield Audit.update(update_data, where_data);


            ctx.body = yield {finish: true}
        }
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
                    type: type_num,
                    state: 0
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
            // ctx.body = yield {};
        }
    });
};