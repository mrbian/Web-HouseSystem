/**
 * Created by bln on 16-6-28.
 */
var render = require('../../instances/render');
const db = require('../../models/index').models;
const extend = require('util')._extend;
const BusinessKind = db.BusinessKind;
const BusinessMaterialKind = db.BusinessMaterialKind;
const MaterialKind = db.MaterialKind;
const FORM_CHECK = /^http:\/\/(\w+)(:\d+)?\/user\/form$/;
const fs = require('fs');
const path = require('path');

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


function* getRegisterData(data, id) {
    yield BusinessKind.findAll({
        where: {
            right_type: data,
            type: 0
        }
    }).map(function (value) {
        return value.dataValues;
    });

    var where  = {
        type: 1,
        right_type: data,
    };

    where = id ? extend(where,{
        business_kind_id : id
    }) : where;

    yield BusinessKind.findAll({
        where
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
    router.get('/user/list',function *(){
        var ctx = this;
        ctx.body = yield render('user/list.html');
    });
    
    router.get('/user/form', function *() {
        var ctx = this;
        ctx.body = yield render('user/form.html');
    });

    router.post('/user/form', function *() {
        var ctx = this;
        console.log(ctx.request.body);
    });

    // 下载接口
    router.get('/upload/file/', function *() {
        var ctx = this;
        console.log(path.join(__dirname, '../../public/upload/file/887093_4.3demo.cpp'));
        ctx.type = path.extname(path.join(__dirname, '../../public/upload/file/887093_4.3demo.cpp'));
        ctx.body =
            fs.createReadStream(path.join(__dirname, '../../public/upload/file/887093_4.3demo.cpp'));
    });

    router.get('/user/form_data/:right_id', function* () {
        var ctx = this;
        var header = ctx.header;

            var params_id = {
                right_id: this.params.right_id || undefined,
                id: this.params.id || undefined,
                business_id: this.params.business_id || undefined
            };

            var material_kind;
            var material_id;
            var registerFn = getRegisterData(params_id.right_id, params_id.id);

            // businesskind寻找小类(按照大类id)
            var register_type1 = yield registerFn.next().value;

            // 获取小类的id
            var register_type2 = yield registerFn.next().value;

            // businessMaterialkind寻找相应的(Materialkind)
            var materialFn = getMaterialId(register_type2[0].id);
            material_id = yield materialFn.next().value;

            // materialKind寻找相应的material
            var materialDataFn = getMaterialData(
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

    });

    router.get('/user/form_data/:right_id/:id', function *() {
        var ctx = this;
        var header = ctx.header;
            // businesskind寻找大类<null>为大类
            var params_id = {
                right_id: this.params.right_id || undefined,
                id: this.params.id || undefined,
                business_id: this.params.business_id || undefined
            };
            console.log(params_id);

            var material_kind;
            var material_id;
            var registerFn = getRegisterData(params_id.right_id, params_id.id);

            // businesskind寻找小类(按照大类id)
            var register_type1 = yield registerFn.next().value;

            // 获取小类的id
            var register_type2 = yield registerFn.next().value;

            // businessMaterialkind寻找相应的(Materialkind)
            var materialFn = getMaterialId(register_type2[0].id);
            material_id = yield materialFn.next().value;

            // materialKind寻找相应的material
            var materialDataFn = getMaterialData(
                material_id.map((value) => {
                    return value.material_kind_id;
                })
            );
            material_kind = yield materialDataFn.next().value;
            ctx.body = yield {
                register2: register_type2,
                file_items: material_kind
            };
    });

    router.get('/user/form_data/:right_id/:id/:business_id', function* () {
        var ctx = this;
        var header = ctx.header;
            // businesskind寻找大类<null>为大类
            var params_id = {
                right_id: this.params.right_id || undefined,
                id: this.params.id || undefined,
                business_id: this.params.business_id || undefined
            };
            var material_kind;
            var material_id;
            var materialFn = getMaterialId(params_id.business_id);
            material_id = yield materialFn.next().value;
            // materialKind寻找相应的material
            var materialDataFn = getMaterialData(
                material_id.map((value) => {
                    return value.material_kind_id;
                })
            );
            material_kind = yield materialDataFn.next().value;
            ctx.body = yield {
                file_items: material_kind
            };
    });
};