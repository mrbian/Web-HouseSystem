/**
 * Created by bln on 16-6-28.
 */
//用户信息表
var shortDataTypes = require('../lib/sequelizex').DataTypes;
module.exports = (sequelize,DataTypes) => {
    var UserInfo = sequelize.define('UserInfo',{
        person_id : shortDataTypes.String(),
        phone   : shortDataTypes.String(),
        head_img_url : shortDataTypes.String()
    },{
        timestamps : false,
        associate : function (models) {
            models.UserInfo.belongsTo(models.User,{foreignKey : 'user_id'});
        }
    });
    return UserInfo;
};