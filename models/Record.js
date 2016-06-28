/**
 * Created by bln on 16-6-28.
 */
var shortDataTypes = require('../lib/sequelizex').DataTypes;
module.exports = (sequelize,DataTypes) => {
    sequelize.define('Record',{
        title : shortDataTypes.String(),
        person_id : shortDataTypes.String(),
        phone : shortDataTypes.String()
    },{
        timestamps : false
    });
};