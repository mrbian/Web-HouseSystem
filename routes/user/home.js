/**
 * Created by bln on 16-6-28.
 */
var render = require('../../instances/render');
const db = require('../../models/index').models;
const BusinessKind = db.BusinessKind;
const BusinessMaterialKind = db.BusinessMaterialKind;
const MaterialKind = db.MaterialKind;
const FORM_CHECK = /^http:\/\/(\w+)(:\d+)?\/user\/form$/;

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

function testReferrer(regex, referrer) {
    return regex.test(referrer);
}


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

module.exports = (router) => {
    router.get('/user/index',function *(){

    });
    
    router.get('/user/form', function *() {
        var ctx = this;
        ctx.body = yield render('user/form.html');
    });

    router.post('/user/form', function *() {
        var ctx = this;
        console.log(ctx.request.body);
    });

    //  上传接口
    router.post('/user/upload/', function *() {
        let ctx = this;
        console.log(ctx.request.body);
    });

    // 下载接口
    router.get('/upload/file/', function *() {
        let ctx = this;
    });

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

// 等哪天再说吧
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