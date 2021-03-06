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
const extend = require('util')._extend;
const AuditAdapter = require('../../adapter/Audit');
const FIRST_CHECK = /^http:\/\/(\w+)(:\d+)?\/admin\/first_check$/;
const debug = true;
var context= require('../../instances/context');

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
     * 这里就体现了js的缺点了，我在addBusiness后面还需要添加一个Audit更改事件
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
        var  materialLists = [];
        for(var  item of body.materialItems){
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
        for(var  item of materialLists){
            var  material = yield Material.create({
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
            },
            include : {
                model : BusinessKind,
                as : 'BigBusinessKind'
            }
        }).map((data) => {
            return extend(data.get(),{
                big_title : data.BigBusinessKind.title
            });
        });
        console.log(data[0]);
        ctx.body = data;
    });

    router.get('/super/agent/get_all_small_business_file/:business_kind_id',function *(){
        var ctx = this;
        var business_kind_id = ctx.params.business_kind_id;
        var small_business_kind = yield BusinessKind.findOne({
            where:{
                id : business_kind_id,
                type : 1
            }
        });
        var data = yield small_business_kind.getMaterialKinds();
        ctx.body = data;
    });

    router.post('/super/agent/small_business_del_file',function *(){
        var ctx = this;
        var body = ctx.request.body;
        var business_kind_id = body.business_id;
        var material_kind_id = body.material_id;
        var small_business_kind = yield BusinessKind.findOne({
            where : {
                id : business_kind_id
            }
        });
        var material_kind = yield MaterialKind.findOne({
            where : {
                id : material_kind_id
            }
        });
        yield small_business_kind.removeMaterialKind(material_kind);
        ctx.body = 'ok';
    });
    
    router.post('/super/agent/change_small_business_kind',function *(){
        var ctx =  this;
        var body = ctx.request.body;
        var title = body.title;
        var is_free = body.is_free;
        var small_business_id = body.business_id;
        var big_business_id = body.big_business_id;
        yield BusinessKind.update({
            title : title,
            is_free : !! is_free,
            business_kind_id : big_business_id
        },{
            where : {
                id : small_business_id,
                type : 1
            }
        });
        ctx.body = 'ok';
    });

    router.post('/super/agent/add_small_business_kind',function *(){
        var ctx = this;
        var body = ctx.request.body;
        var title = body.title;
        var is_free = body.is_free;
        var file_list = body.file_list;
        var belong_id = body.belong_id;
        var big_business_kind = yield BusinessKind.findOne({
            where : {
                id : belong_id,
                type : 0
            }
        });
        var small_business_kind = yield BusinessKind.create({
            title : title,
            is_free : !! is_free,
            type : 1,
            right_type : big_business_kind.right_type
        });
        //有意思，主语还必须是级别更大的一个
        yield big_business_kind.addSmallBusinessKind(small_business_kind);
        console.log(file_list);
        for(var  item of file_list){
           var  material_kind = yield MaterialKind.findOne({
               where:{
                   id : item.id
               }
           });
           yield small_business_kind.addMaterialKind(material_kind);
        }
        ctx.body = 'ok';
    });

    
    router.post('/super/agent/small_business_kind_add_material',function *(){
        var ctx = this;
        var body = ctx.request.body;
        var material_kind_id = body.material_kind_id;
        var business_kind_id = body.business_kind_id;
        var small_business_kind = yield SmallBusinessKind.findOne({
            where :{
                id : business_kind_id
            }
        });
        var material_kind = yield MaterialKind.findOne({
            where : {
                id : material_kind_id
            }
        });
        //不知道是不是不允许多个重复的？
        yield small_business_kind.addMaterialKind(material_kind);
        ctx.body = 'ok';
    });

    //删除肯定没有这么简单的= - =，这个要求必须有数据备份
    router.post('/super/agent/del_small_business_kind',function *(){
        var ctx = this;
        var body = ctx.request.body;
        var small_business_id = body.id;
        yield BusinessKind.destroy({
            where : {
                id : small_business_id
            }
        });
        ctx.body = 'ok';
    });
    /**
     * 审核以及缮证的代码
     */

    router.get('/admin/first_check_data', function *() {
        var ctx = this;
            var  type_num = (yield auth.user(this)).type;
            var  business_id = yield Audit.findAll({
                where: {
                    type: type_num,
                    state: 0
                }
            }).map(function (value) {
                return value.get().business_id;
            });
        /**
         * 这里利用sequelize对数组支持很好的特性，用一个数组写where很棒
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
        var  ctx = this;
        // body => {type, comment}
        var  body = ctx.request.body;
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
                yield AuditAdapter.Accept(audit.id);
            }
            ctx.body = {business_id : body.id};
        }catch(err){
            console.error(err.stack);
            ctx.body = debug ? err : '500';
            console.log(arguments);
        }
    });

    router.post('/login',function *(){
        var ctx = this;
        var body = ctx.request.body;
        var name = body.name.toString('utf8');
        var pwd = body.pwd.toString('utf8');
        var user = yield User.findOne({
            where : {
                account : name,
                pwd : pwd
            }
        });
        if(!user) {
            ctx.body = 'false';
            return;
        }
        auth.login(ctx,user);
        ctx.body = 'ok';
    });
};