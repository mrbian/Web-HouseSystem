/**
 * Created by bln on 16-6-28.
 */
//业务类型表
var shortDataTypes = require('../lib/sequelizex').DataTypes;
module.exports = (sequelize,DataTypes) => {
    var BusinessKind = sequelize.define('BusinessKind',{
        title : shortDataTypes.String(),
        /**
         * 1 : 所有权登记
         * 2 ： 抵押权登记
         * 3 ： 地役权登记
         * 4 ： 预告登记
         * 0 ： 其他登记
         */
        right_type : shortDataTypes.Int(),
        is_free : shortDataTypes.Bool(),
        /**
         * 0 : 大业务
         * 1 : 小业务
         * 大业务包含小业务
         */
        type : shortDataTypes.Int()
    },{
        timestamps : false,
        hooks : {

        },
        associate : function(models){
            models.BusinessKind.hasMany(models.BusinessKind,{ as: 'SmallBusinessKind', foreignKey : 'business_kind_id'});
            models.BusinessKind.belongsTo(models.BusinessKind,{ as : 'BigBusinessKind', foreignKey : 'business_kind_id'});
            models.BusinessKind.belongsToMany(models.MaterialKind,{
                through : 'BusinessMaterialKind',
                foreignKey : 'business_kind_id',
                otherKey : 'material_kind_id',
                timestamps : false
            });
            models.BusinessKind.hasMany(models.Business, { foreignKey : 'type_id'});
        }
    });
    return BusinessKind;
};