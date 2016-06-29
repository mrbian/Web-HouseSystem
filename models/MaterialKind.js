/**
 * Created by bln on 16-6-28.
 */
//材料类型表
var shortDataTypes = require('../lib/sequelizex').DataTypes;
module.exports = (sequelize,DataTypes) => {
    var MaterialKind = sequelize.define('MaterialKind',{
        is_need : shortDataTypes.Bool(),
        title : shortDataTypes.String(),
        url : shortDataTypes.String()
    },{
        timestamps : false,
        associate : function(models) {
            models.MaterialKind.belongsToMany(models.BusinessKind,{
                through : 'BusinessMaterialKind',
                foreignKey: 'material_kind_id',
                otherKey : 'business_kind_id',
                timestamps : false
            });
            models.MaterialKind.hasMany(models.Material,{ foreignKey : 'type_id'});
        }
    });
    return MaterialKind;
};