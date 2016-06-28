/**
 * Created by bln on 16-6-28.
 */
//用户表
var shortDataTypes = require('../lib/sequelizex').DataTypes;
module.exports = (sequelize,DataTypes) => {
    var User = sequelize.define('User',{
        account : shortDataTypes.String(),
        pwd : shortDataTypes.String(),
        /**
         * 0 是 普通申请用户
         * 1 是 初审管理员
         * 2 是 二审管理员
         * 3 是 终审管理员
         * 4 是 登簿管理员
         * 5 是 缮证管理员
         * 6 是 档案管理员
         *
         * 100 是 超级管理员
         */
        type : shortDataTypes.Int(),
    },{
        timestamps : false,
        associate : function(models){
            models.User.hasOne(models.UserInfo,{ foreignKey : 'user_id'});
            models.User.hasMany(models.Business,{ foreignKey : 'user_id'});
        }
    });
    return User;
};