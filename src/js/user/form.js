/**
 * Created by li-rz on 16-6-29.
 */
require('../common/shared');
require('../../scss/user/form.scss');
var $ = jQuery;
var angular = require('angular');

$(document).ready(function () {
    var app = angular.module('app', []);

    app.controller('formController', ['$scope', '$http', function (scope, http) {
        scope.power_items = ['所有权登记',
            '抵押权登记',
            '地役权登记',
            '预告登记',
            '其他登记'];
        
        scope.register_items1 = [
            '初始登记'
        ];

        scope.register_items2 = [
            '商品房初始登记',
            '经济适用房初始登记',
            '城市房屋新建',
            '集体入地房屋新建',
            '集资建房'
        ];

    }]);
});