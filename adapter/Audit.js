/**
 * Created by bln on 16-7-11.
 */
const co = require('co');
const Audit = require('../models/index').models.Audit;
const Business = require('../models/index').models.Business;
/**
 * 这里重复实现了错误throw或者callback的思想
 * 但是错误对象太弱了，需要建立起来这样一个对象
 */

var AuditAdapter = module.exports = {
    _findById : function *(id){
        if(! id) throw '_findById id is undefined';
        let audit = yield Audit.findOne({
            where:{
                id : id
            }
        });
        if(! audit) throw '_findById do not have this audit';
        return audit;
    },
    addAudit : function *(business_id) {
        var isRepeat = yield Audit.findOne({
            where : {
                business_id : business_id
            }
        });
        if(isRepeat){
            return 0;
        }
        var business = yield Business.findOne({
            where:{
                id : business_id
            }
        });
        var audits = [];
        for(let i = 0;i < 3;i ++){
            audits.push(
                Audit.create({
                    type : i + 1,
                    comment : ' ',
                    state : i == 0 ? 0 : 2
                })
            );
        }
        audits = yield Promise.all(audits);
        for(let audit of audits){
            yield business.addAudit(audit);
        }
        return 1;
    },
    
    notAccept : function *(audit_id,comment){
        if(! audit_id || !comment) throw 'audit_id or comment is empty';
        yield Audit.update({
            state : -1,
            comment : comment
        },{
            where:{
                id : audit_id
            }
        });
    },

    Accept : function *(audit_id){
        if(! audit_id) throw 'id_empty';
        var audit = yield this._findById(audit_id);
        if(! audit) throw 'do not have this audit';
        yield Audit.update({
            state : 1,
        },{
            where : {
                id : audit_id
            }
        });
        yield this._nextAuditInit(audit_id);
        return 1;
    },

    _nextAuditInit : function *(audit_id){
        if(!audit_id) throw 'id_empty';
        var audit = yield Audit.findOne({
            where : {
                id : audit_id
            }
        });
        if(!audit) throw 'do not have this next audit';
        if(audit.type == 3){
            return;
        }
        yield Audit.update({
            state : 0,
        }, {
            where:{
                business_id : audit.business_id,
                type : audit.type + 1
            }
        });
        return 1;
    },
    getCheckAuditsByBusinessId : function *(business_id,is_valid){
        if(!business_id) throw 'business id is empty';
        var audits = yield Audit.findAll({
            where:{
                business_id : business_id
            }
        });
        if(audits.length !== 3) throw 'audits length != 3';
        if(is_valid){
            var audit = audits[0];
            for(let item of audits){
                if(item.state == 0 && audit.type < item.type){
                    audit = item;
                }
            }
            return audit;
        }
        return audits;
    }
};

/**
 * 测试
 */
// co(function *(){
//     yield AuditAdapter.addAudit(18);
// });
