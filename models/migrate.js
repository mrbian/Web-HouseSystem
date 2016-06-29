var co = require('co');
var utilx = require('../lib/utilx');
var db = require('./index.js');
var models = db.models;
var User = models.User;
var UserInfo = models.UserInfo;
var BusinessKind = models.BusinessKind;
var Business = models.Business;
var MaterialKind = models.MaterialKind;
var Material = models.Material;
var Audit = models.Audit;
var Registration = models.Registration;
var Record = models.Record;

function * superUserInit(){
    console.log('superUserInit');
    yield User.create({
        account : 'super',
        pwd : '123456',
        type : 100,
    });
}

function * UserInit () {
    console.log('UserInit');
    for(var i = 0; i < 10; i++){
        yield User.create({
            account : 'user' + i,
            pwd : '123456',
            type : i % 7
        });
    }
}

function * UserInfoInit() {
    console.log('UserInfoInit');
    var users = yield User.findAll({});
    for(var x in users){
        yield UserInfo.create({
            person_id : '341222199707010018',
            phone : '18340861711',
            head_img_url : '/upload/image/head.jpg',
            user_id : users[x].id
        });
    }
}

function * BusinessKindInit(){
    console.log('BusinessKindInit');
    for(var i = 0; i < 5; i++){
        yield BusinessKind.create({
            title : '第' + i + '大登记类',
            right_type : (i % 5),
            is_free : i % 2 === 0,
            type : 0
        });
    }
    var BigBusinessKinds = yield BusinessKind.findAll({});
    for(var j = 0 ;j < BigBusinessKinds.length; j ++){
        var BigBusinessKind = BigBusinessKinds[j];
        for(var k =0; k < 10;k ++){
              yield BusinessKind.create({
                  title : '第' + k + '小登记类',
                  right_type: BigBusinessKind.right_type,
                  is_free : i % 2 === 0,
                  type : 1,
                  business_kind_id : BigBusinessKind.id
              });
        }
    }
}

function * MaterialKindInit(){
    console.log('MaterialKindInit');
    var SmallBusinessKinds = yield BusinessKind.findAll({
        where:{
            type : 1
        }
    });
    for(var i = 0; i < 20; i ++){
        var material = yield MaterialKind.create({
            is_need : i % 2 === 0,
            title : '文件' + i,
            url : '/upload/file/'
        });
        for(var idx in SmallBusinessKinds){
            var SmallBusinessKind = SmallBusinessKinds[idx];
            SmallBusinessKind.addMaterialKind(material);
        }
    }
}

function * BusinessInit(){
    console.log('BusinessInit');
    var SmallBusinessKinds = yield BusinessKind.findAll({
        where:{
            type : 1
        }
    });
    for(var idx in SmallBusinessKinds){
        var SmallBusinessKind = SmallBusinessKinds[idx];
        for(var i = 0; i < 10; i++){
            yield Business.create({
                logic_id : utilx.getUniqueStr(),
                title : '业务' + i,
                info : '地皮不要钱',
                type_id : SmallBusinessKind.id
            });
        }
    }
}

function * MaterialInit(){
    console.log('MaterialInit');
}

function * init(){
    yield db.sync({force : true});
    yield superUserInit();
    yield UserInit();
    yield UserInfoInit();
    yield BusinessKindInit();
    yield MaterialKindInit();
    yield BusinessInit();
    yield MaterialInit();
}

co(function *(){
    yield init();
    console.log('finished');
}).catch(function(err){
    console.log(err);
});