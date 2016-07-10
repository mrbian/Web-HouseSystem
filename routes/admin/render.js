/**
 * Created by bln on 16-6-28.
 */
const render = require('../../instances/render');
const auth = require('../../helpers/auth');
const co = require('co');
const db = require('../../models/index').models;
const Audit = db.Audit;
const Business = db.Business;
const FIRST_CHECK = /^http:\/\/(\w+)(:\d+)?\/admin\/first_check$/;

const TYPE = {
    EXCLUSION: 0,
    SUCCESS: 1// console.log(register_type2);
};



function testReferrer(regex, referrer) {
    return regex.test(referrer);
}



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
        if (body.type === TYPE.EXCLUSION) {// console.log(register_type2);
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
                .dataValues;

            let create_data = {
                type: success_type.type + 1,
                state: 0,
                comment: ' ',
                business_id: success_type.business_id
            };
            if (success_type > 3) {
                create_data.state = 1;
            }
            console.log(create_data);
            yield Audit.create(create_data);


            ctx.body = yield {finish: true}
        }
    });
    
    
    router.get('/admin/set_material_kind',function *(){
        var ctx = this;
        ctx.body = yield render('admin/set_material_kind.html');
    });
    
    router.get('/admin/first_check_data', function *() {
        var ctx = this;
        // 检查cookie和referer// materialKind寻找相应的material
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
        } else {// console.log(register_type2);
            ctx.status = 404;
            // ctx.body = yield {};
        }
    });

    // right_id => 权力类型
    // id => 大类

    router.get('/admin/set_business_kind',function *(){
        var ctx = this;
        ctx.body = yield render('admin/set_business_kind.html');
    });

    router.get('/admin/set_small_business_kind',function *(){
        var ctx = this;
        ctx.body = yield render('admin/set_small_business_kind.html');
    })
};