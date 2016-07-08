/**
 * Created by bln on 16-6-28.
 */
const render = require('../../instances/render');
const auth = require('../../helpers/auth');
const co = require('co');
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
    SUCCESS: 1// console.log(register_type2);
};

const PARAM_NUM = [
    {
        register1: true,
        register2: true,
        file_items: true
    },
    {
        register1: false,
        register2: true,
        file_items: true
    },
    {
        register1: false,
        register2: false,
        file_items: true
    }
];

function* getRegisterData(data, type) {
    yield BusinessKind.findAll({
        where: {
            right_type: data,
            type: 0
        }
    }).map(function (value) {
        return value.dataValues;
    });

    yield BusinessKind.findAll({
        where: {
            type: type || 1,
            right_type: data
        }
    }).map(function (value) {
        return value.dataValues;
    });

}

function* getMaterialId(business_id) {
    yield BusinessMaterialKind.findAll({
        where: {
            business_kind_id: business_id
        }
    }).map(function (value) {
        return value.dataValues;
    });
}

function* getMaterialData(material_id) {
    yield MaterialKind.findAll({
        where: {
            id: material_id
            }
    }).map(function (value) {
        return value.dataValues;
    });

}



// function* implementFunction(params_id, param_num) {
//     let material_kind;
//     let material_id;
//     let registerFn = getRegisterData(params_id.right_id, params_id.id);
//
//     // businesskind寻找小类(按照大类id)
//     let register_type1 = yield registerFn.next().value;
//
//     // 获取小类的id
//     let register_type2 = yield registerFn.next().value;
//
//     // businessMaterialkind寻找相应的(Materialkind)
//     let materialFn = getMaterialId(register_type2[0].id);
//     material_id = yield materialFn.next().value;
//
//     // materialKind寻找相应的material
//     let materialDataFn = getMaterialData(
//         material_id.map((value) => {
//             return value.material_kind_id;
//         })
//     );
//     material_kind = yield materialDataFn.next().value;
//     // console.log();
//     let all_data = {
//         register1: register_type1,
//         register2: register_type2,
//         file_items: material_kind
//     };
//
//     let return_data = {};
//
//     Object.keys(param_num).forEach(function (value) {
//         if (param_num[value]) {
//             return_data[value] = all_data[value];
//         }
//     });
//
//     yield return_data;
// }

function testReferrer(regex, referrer) {
    return regex.test(referrer);
}



module.exports = (router) => {
    router.get('/admin/index',function *(){
        var ctx = this;
        ctx.body = yield render('admin/index.html');console.log(material_kind);
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
    router.get('/user/form_data/:right_id', function* () {
        let ctx = this;
        let header = ctx.header;
    
        if (testReferrer(FORM_CHECK, header.referer)) {
            let params_id = {
                right_id: this.params.right_id || undefined,
                id: this.params.id || undefined,
                business_id: this.params.business_id || undefined
            };
    
            let material_kind;
            let material_id;
            let registerFn = getRegisterData(params_id.right_id, params_id.id);
    
            // businesskind寻找小类(按照大类id)
            let register_type1 = yield registerFn.next().value;
    
            // 获取小类的id
            let register_type2 = yield registerFn.next().value;
    
            // businessMaterialkind寻找相应的(Materialkind)
            let materialFn = getMaterialId(register_type2[0].id);
            material_id = yield materialFn.next().value;
    
            // materialKind寻找相应的material
            let materialDataFn = getMaterialData(
                material_id.map((value) => {
                    return value.material_kind_id;
                })
            );
            material_kind = yield materialDataFn.next().value;
    
            ctx.body = yield {
                register1: register_type1,
                register2: register_type2,
                file_items: material_kind
            };
    
        } else {
            ctx.status = 404;
        }
    
    });

    router.get('/user/form_data/:right_id/:id', function *() {
        let ctx = this;
        let header = ctx.header;
        if (testReferrer(FORM_CHECK, header.referer)) {

            // businesskind寻找大类<null>为大类
            let params_id = {
                right_id: this.params.right_id || undefined,
                id: this.params.id || undefined,
                business_id: this.params.business_id || undefined
            };
            console.log(params_id);

            let material_kind;
            let material_id;
            let registerFn = getRegisterData(params_id.right_id, params_id.id);

            // businesskind寻找小类(按照大类id)
            let register_type1 = yield registerFn.next().value;

            // 获取小类的id
            let register_type2 = yield registerFn.next().value;

            // businessMaterialkind寻找相应的(Materialkind)
            let materialFn = getMaterialId(register_type2[0].id);
            material_id = yield materialFn.next().value;

            // materialKind寻找相应的material
            let materialDataFn = getMaterialData(
                material_id.map((value) => {
                    return value.material_kind_id;
                })
            );
            material_kind = yield materialDataFn.next().value;
            ctx.body = yield {
                register2: register_type2,
                file_items: material_kind
            };

        } else {
            ctx.status = 404;
        }
    });

    router.get('/user/form_data/:right_id/:id/:business_id', function* () {
        let ctx = this;
        let header = ctx.header;
        if (testReferrer(FORM_CHECK, header.referer)) {

            // businesskind寻找大类<null>为大类
            let params_id = {
                right_id: this.params.right_id || undefined,
                id: this.params.id || undefined,
                business_id: this.params.business_id || undefined
            };
            let material_kind;
            let material_id;
            let materialFn = getMaterialId(params_id.business_id);
            material_id = yield materialFn.next().value;
            // materialKind寻找相应的material
            let materialDataFn = getMaterialData(
                material_id.map((value) => {
                    return value.material_kind_id;
                })
            );
            material_kind = yield materialDataFn.next().value;
            ctx.body = yield {
                file_items: material_kind
            };

        } else {
            ctx.status = 404;
        }
    });
};