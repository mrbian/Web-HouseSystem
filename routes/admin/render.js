/**
 * Created by bln on 16-6-28.
 */
const render = require('../../instances/render');
const auth = require('../../helpers/auth');
const db = require('../../models/index').models;
const Audit = db.Audit;
const Business = db.Business;
const BusinessKind = db.BusinessKind;
const BusinessMaterialKind = db.BusinessMaterialKind;
const MaterialKind = db.MaterialKind;
const FIRST_CHECK = /^http:\/\/(\w+)(:\d+)?\/admin\/first_check$/;
const FORM_CHECK = /^http:\/\/(\w+)(:\d+)?\/user\/form$/;
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

    // right_id => 权力类型
    // id => 大类
    router.get('/user/form_data/:right_id/:id', function *() {
        var ctx = this;
        let header = ctx.header;
        console.log(header.referer);
        if (FORM_CHECK.test(header.referer)) {

            // businesskind寻找大类<null>为大类
            let params_id = {
                id: this.params.id,
                right_id: this.params.right_id
            };
            let register_type1 = yield BusinessKind.findAll({
                where: {
                    type: 0
                }
            }).map(function (value) {
                return value.dataValues;
            });
            // console.log(params_id);

            // businesskind寻找小类(按照大类id)
            let register_type2 = yield BusinessKind.findAll({
                where: {
                    type: parseInt(params_id.id),
                    right_type: parseInt(params_id.right_id)
                }
            }).map(function (value) {
                return value.dataValues;
            });

            // 获取小类的id

            // console.log(register_type2);
            // businessMaterialkind寻找相应的(Materialkind)
            let material_id = [];
            if (register_type2.length > 0) {
                material_id = yield BusinessMaterialKind.findAll({
                   where: {
                       business_kind_id: register_type2[0].id
                   }
                }).map(function (value) {
                    return value.dataValues;
                });
            }

            // console.log(material_id);

            let material_kind = yield MaterialKind.findAll({
                where: {
                    id: material_id.map(function (value) {
                        return value.material_kind_id;
                    })
                }
            }).map(function (value) {
                return value.dataValues;
            });

            ctx.body = yield {
                register1: register_type1,
                register2: register_type2,
                file_items: material_kind
            };
            // console.log(material_kind_id);
            // materialKind寻找相应的material

        } else {
            ctx.status = 404;
        }

    });
};