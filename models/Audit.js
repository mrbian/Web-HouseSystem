/**
 * Created by bln on 16-6-28.
 */
//审计表
var shortDataTypes = require('../lib/sequelizex').DataTypes;
module.exports = (sequelize,DataTypes) => {
    var Audit = sequelize.define('Audit',{
        /**
         * 1 ： 一审
         * 2 ： 二审
         * 3 ： 三审
         */
        type : shortDataTypes.Int(),
        comment : shortDataTypes.String(),
        /**
         * 0 : 审核中
         * 1 : 审核通过
         * -1 : 审核未通过
         */
        state : shortDataTypes.Int(),
    },{
        timestamps : false,
        associate : function(models) {
            models.Audit.belongsTo(models.Business,{foreignKey : 'business_id'});
        }
    });
    return Audit;
};