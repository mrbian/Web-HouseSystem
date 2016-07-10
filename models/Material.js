/**
 * Created by bln on 16-6-28.
 */
//具体材料表
var shortDataTypes = require('../lib/sequelizex').DataTypes;
module.exports = (sequelize,DataTypes) => {
    var Material = sequelize.define('Material',{
        logic_id : shortDataTypes.String(),
        url : shortDataTypes.String(),
        info : shortDataTypes.String(),
        title : shortDataTypes.String(),
        /**
         * 0 : 未上传
         * 1 : 已上传
         */
        state : shortDataTypes.Int()
    },{
        timestamps : false,
        associate : function(models) {
            models.Material.belongsTo( models.MaterialKind, { foreignKey : 'type_id'});
            models.Material.belongsTo( models.Business, { foreignKey: 'business_id'});
        }
    });
    return Material;
};