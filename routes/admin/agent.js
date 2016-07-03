/**
 * Created by bln on 16-6-29.
 */
var db = require('../../models/index');
var util = require('../../lib/utilx');
var MaterialKind = db.models.MaterialKind;
var BusinessKind = db.models.BusinessKind;

module.exports = (router) => {
    /**
     * 材料种类增删改查
     */
    router.get('/super/agent/get_all_material_kind',function *(){
        var ctx = this;
        var data = yield MaterialKind.findAll({
            attributes:{
                // exclude : ['id']
            }
        });
        // console.log(data);
        ctx.body = data;
    });

    router.post('/super/agent/add_material_kind',function *(){
        var ctx = this;
        ctx.checkBody('title').notEmpty().toString();
        ctx.checkBody('url').notEmpty().toString();
        ctx.checkBody('is_need').notEmpty();
        if(ctx.errors){
            console.log(ctx.errors);
            ctx.body = 'false';
            return;
        }
        var body = ctx.request.body;
        var data = yield MaterialKind.create({
            title :  body.title,
            url : body.url,
            is_need : body.is_need === 1
        });
        ctx.body = data.id;
    });

    router.post('/super/agent/del_material_kind',function *(){
        var ctx = this;
        ctx.checkBody('id').notEmpty().toString();
        if(ctx.errors){
            ctx.body = 'false';
            return;
        }
        var body = ctx.request.body;
        yield MaterialKind.destroy({
            where :{
                id : body.id
            }
        });
        ctx.body = 'ok';
    });

    router.post('/super/agent/change_material_kind',function *(){
        var ctx = this;
        ctx.checkBody('id').notEmpty();
        ctx.checkBody('title').notEmpty();
        ctx.checkBody('url').notEmpty();
        ctx.checkBody('is_need').notEmpty();
        if(ctx.errors){
            ctx.body = 'false';
            return;
        }
        var body = ctx.request.body;
        yield MaterialKind.update({
            title : body.title,
            url : body.url,
            is_need : body.is_need
        },{
            where:{
                id : body.id
            }
        });
        ctx.body = 'ok';
    });


    /**
     * 登记大类增删改查
     */
    router.get('/super/agent/get_all_business_kind',function *(){
        var ctx = this;
        var data = yield BusinessKind.findAll({
            where:{
                type : 0
            }
        });
        console.log(data);
        ctx.body = data;
    });
};