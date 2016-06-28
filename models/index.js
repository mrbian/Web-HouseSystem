/**
 * Created by bln on 16-6-28.
 */
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');

var configs = require('./../instances/config.js');

var sequelize = new Sequelize(configs.db.toString(), {
    logging: function () {}
});
console.log(configs.db.toString());

//todo : 给所有表段添加约束
//todo : 添加时间戳

//  autoload
fs
    .readdirSync( __dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js' &&  file !== 'migrate.js');
    })
    .forEach(function (file) {
        try {
            sequelize.import(path.join(__dirname, file));
        } catch (e) {
            console.log(e);
        }
    });

var models = sequelize.models;
Object.keys(sequelize.models).forEach(function (modelName) {
    if (models[modelName].options.hasOwnProperty('associate')) {
        models[modelName].options.associate(models);
    }
});

module.exports = sequelize;