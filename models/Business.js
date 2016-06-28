/**
 * Created by bln on 16-6-28.
 */
//业务表
var shortDataTypes = require('../lib/sequelizex').DataTypes;
module.exports = (sequelize,DataTypes) => {
    var Business = sequelize.define('Business',{
        logic_id : shortDataTypes.String(),
        title : shortDataTypes.String(),
        info : shortDataTypes.String()
    },{
        timestamps : false,
        associate : function(models) {
            models.Business.belongsTo(models.User,{foreignKey : 'user_id'});
            models.Business.belongsTo(models.BusinessKind,{foreignKey: 'type_id'});
            models.Business.hasMany(models.Audit, { foreignKey : 'business_id',constraints : false});
            models.Business.hasMany(models.Material, { foreignKey : 'business_id'});
            models.Business.hasOne(models.Registration,{foreignKey : 'business_id'});
        }
    });
    return Business;
};