/**
 * Created by bln on 16-7-13.
 */
var db = require('../../models/index');
var User = db.models.User;
var Business = db.models.Business;
var auth = require('../../helpers/auth');
var extend = require('util')._extend;
//权限泄露！！ User不应该能接触到Audit表的，应该设计加一个表或者表段来转接数据！
var Audit = db.models.Audit;
const STATE = {
    NOT_PASS : -1,
    FIRST : 1,
    SECOND : 2,
    THIRD : 3,
    PASS : 4,
    ERROR : -2
};
module.exports = (router) => {
    router.get('/user/agent/get_all_business',function *(){
        var ctx =this;
        var businesses = yield Business.findAll({
            where : {
                user_id : (yield auth.user(ctx)).id
            },
            include : {
                model : Audit,
                order : [['type']]
            }
        });
        businesses = businesses.map(function(item){
            var state;
            var comment;
            for(ele of item.Audits){
                if(ele.state == -1){
                   state = STATE.NOT_PASS;
                    comment = ele.comment;
                    break;
                }
                if(ele.state == 0){
                    state = ele.type == 1 ? STATE.FIRST :
                            ele.type == 2 ? STATE.SECOND :
                            ele.type == 3 ? STATE.THIRD : STATE.ERROR;
                    break;
                }
            }
            state = state || STATE.PASS;
           return extend(item.get(),{
                state : state,
                comment : comment || ' '
           });
        });
        ctx.body = businesses;
    });
};