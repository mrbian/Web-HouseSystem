/**
 * Created by bln on 16-6-29.
 */
var db = require('../../models/index');
var util = require('../../lib/utilx');
var MaterialKind = db.models.MaterialKind;
var BusinessKind = db.models.BusinessKind;
var SmallBusinessKind = db.models.BusinessKind;

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
        // console.log(data);
        ctx.body = data;
    });

    router.get('/super/agent/check_business_title',function *(){
        var ctx = this;
        ctx.checkQuery('title').notEmpty();
        if(ctx.errors){
            ctx.body = ctx.errors;
            return;
        }
        // console.log(ctx.request.query);
        var data = yield BusinessKind.findOne({
            where : {
                title : ctx.query.title
            }
        });
        if(data){
            ctx.body = 'false';
            return;
        }
        ctx.body = 'ok';
    });

    router.post('/super/agent/add_business_kind',function *(){
        var ctx = this;
        ctx.checkBody('title').notEmpty();
        ctx.checkBody('right_type').notEmpty();
        if(ctx.errors){
            ctx.body = ctx.errors;
            return;
        }
        var body = ctx.request.body;
        var business_kind = yield BusinessKind.findOne({
           where:{
               title : body.title
           }
        });
        if(business_kind){
            ctx.body = 'false';
            return;
        }
        business_kind = yield BusinessKind.create({
            title: body.title,
            right_type : body.right_type,
            type : 0
        });
        ctx.body = business_kind;
    });

    router.post('/super/agent/change_business_kind',function *(){
        var ctx = this;
        ctx.checkBody('title').notEmpty();
        ctx.checkBody('id').notEmpty().toInt();
        ctx.checkBody('right_type').notEmpty().toInt();
        if(ctx.errors){
            ctx.body = ctx.errors;
            return;
        }
        var body = ctx.request.body;
        var business_kind = yield BusinessKind.findOne({
            where:{
                title : body.title,
                id : {
                    $ne : body.id
                }
            }
        });
        if(business_kind){
            ctx.body = 'false';
            return;
        }
        yield BusinessKind.update({
            title : body.title,
            right_type : body.right_type
        },{
            where:{
                id : body.id
            }
        });
        ctx.body = 'ok';
    });

    router.post('/super/agent/del_business_kind',function *(){
        var ctx = this;
        ctx.checkBody('id').notEmpty();
        if(ctx.errors){
            ctx.body = ctx.errors;
            return;
        }
        var body = ctx.request.body;
        /**
         * 检测登记小类的依赖
         */
        var small_business_kind = yield SmallBusinessKind.findOne({
            where:{
                type : 1,
                business_kind_id : body.id
            }
        });
        if(small_business_kind){
            ctx.body = 'false';
            return;
        }
        yield SmallBusinessKind.destroy({
            where:{
                type : 0,
                id : body.id
            }
        });
        ctx.body = 'ok';
    });

    /**
     * 登记小类的增删改查
     */
    
};