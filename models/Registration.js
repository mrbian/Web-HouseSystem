/**
 * Created by bln on 16-6-28.
 */
//登记簿表
var shortTypes = require('../lib/sequelizex').DataTypes;
module.exports = (sequelize,DataTypes) => {
    var Registration = sequelize.define('Registration',{
        title : shortTypes.String()
    },{
       timestamps : false,
       associate : function(models) {
           models.Registration.belongsTo(models.Business, {foreignKey : 'business_id'});
       }
    });
};