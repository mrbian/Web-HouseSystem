/**
 * Created by bln on 16-6-29.
 */
var db = require('../../models/index');
var util = require('../../lib/utilx');
var MaterialKind = db.models.MaterialKind;
var BusinessKind = db.models.BusinessKind;
var SmallBusinessKind = db.models.BusinessKind;
const auth = require('../../helpers/auth');
const co = require('co');
const Audit = db.models.Audit;
const Business = db.models.Business;
const User = db.models.User;
const Material = db.models.Material;
const AuditAdapter = require('../../adapter/Audit');
const FIRST_CHECK = /^http:\/\/(\w+)(:\d+)?\/admin\/first_check$/;
const debug = true;

//棒棒这样定义常量确实不错
const TYPE = {
    EXCLUSION: -1,
    SUCCESS: 1// console.log(register_type2);
};



function testReferrer(regex, referrer) {
    return regex.test(referrer);
}



module.exports = (router) => {
    /**
     * 这里就体现了js的缺点了，我在addBusiness后面还需要添加一个Audit
     * 但是如果直接在路由下面写代码非常差劲，所以应该用类的思想加一层adapter
     * 路由驱动还是事件驱动？加一层adapter来语义化代码不错。
     */
    router.post('/user/agent/addBusiness',function *(){
        var ctx = this;
        var body = ctx.request.body;
        ctx.checkBody('title').notEmpty();
        ctx.checkBody('info').notEmpty();
        ctx.checkBody('materialItems').notEmpty();
        ctx.checkBody('type').notEmpty();
        if(ctx.errors){
            ctx.body = ctx.errors;
            return;
        }
        var user = yield User.findOne({
            where:{
                id : (yield auth.user(ctx)).id
            }
        });
        let materialLists = [];
        for(let item of body.materialItems){
            if(item.newUrl){
                materialLists.push({
                    id : item.id,
                    url : item.newUrl,
                    title : item.title
                });
            }
        }
        var business = yield Business.create({
            title : body.title  || '',
            info : body.info || '',
            logic_id : util.getUniqueStr()
        });
        user.addBusiness(business);
        for(let item of materialLists){
            let material = yield Material.create({
                logic_id : util.getUniqueStr(),
                url : item.url,
                info : 'null',
                title : item.title,
                state : 0
            });
            business.addMaterial(material);
        }
        yield AuditAdapter.addAudit(business.id);
        ctx.body = 'ok';
    });

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
    router.get('/super/agent/get_all_small_business_kind',function *(){
        var ctx = this;
        var data = yield SmallBusinessKind.findAll({
            where:{
                type : 1
            }
        });
        ctx.body = data;
    });

    /**
     * 审核以及缮证的代码
     */

    router.get('/admin/first_check_data', function *() {
        var ctx = this;
            let type_num = (yield auth.user(this)).type;
            let business_id = yield Audit.findAll({
                where: {
                    type: type_num,
                    state: 0
                }
            }).map(function (value) {
                return value.dataValues.business_id;
            });
        /**
         * sequelize 本身就对数组支持很好，棒棒可以的
         */
            ctx.body = yield Business.findAll({
                where: {
                    id: business_id
                }
            });
    });

    // right_id => 权力类型
    // id => 大类

    /**
     * 这样写不对！！根本没有考虑到权限问题 囧
     */
    router.post('/admin/first_check', function *() {
        let ctx = this;
        // body => {type, comment}
        let body = ctx.request.body;
        ctx.checkBody('type').notEmpty();
        ctx.checkBody('comment').notEmpty().toString();
        ctx.checkBody('id').notEmpty();
        if(ctx.errors){
            ctx.body = ctx.errors;
            return;
        }
        try {
            var audit = yield AuditAdapter.getCheckAuditsByBusinessId(body.id,true);
            if (body.type == TYPE.EXCLUSION) {// console.log(register_type2);
                //不通过
                yield AuditAdapter.notAccept(audit.id,body.comment);
            } else if (body.type == TYPE.SUCCESS) {
                //通过
                // yield AuditAdapter.Accept(audit.id);
            }
            ctx.body = {business_id : body.id};
        }catch(err){
            console.error(err.stack);
            ctx.body = debug ? err : '500';
            console.log(arguments);
        }
    });
};