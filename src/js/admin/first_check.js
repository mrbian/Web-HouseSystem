/**
 * Created by bln on 16-6-29.
 */
require('../common/shared');
require('../../scss/share/main.scss');
require('../../scss/admin/first_check.scss');
require('angular');
var $ = jQuery;
$(document).ready(function () {
    var app = angular.module('app', []);
    app.controller('check_controller', ['$scope', '$http', function (scope, http) {
        scope.loaded = false;

        http({
            method: 'GET',
            url: ''
        }).then(function (res) {});
        
        scope.check_items = [
            '日出江花', 
            '蛤蛤吼哇'
        ];

        scope.TYPE = {
            SUCCESS: 1,
            EXCLUSION: 0
        };

        scope.prepare = {
            item: undefined,
            message: undefined
        };

        /**
         * 更新prepare
         * @param type - 类型
         * @param index - 索引号
         */
        scope.checkItem = function (type, index) {
            switch (type) {

                case scope.TYPE.EXCLUSION:
                    scope.prepare.item = index;
                    scope.prepare.message = scope.TYPE.EXCLUSION;
                    break;

                case scope.TYPE.SUCCESS:
                    scope.prepare.item = index;
                    scope.prepare.message = scope.TYPE.SUCCESS;
                    break;

                default:
                    throw Error('Fuck You');
            }
        };

        scope.verifiedItem = function (type) {
            // 发送数据，准备删除
        };
        
        /**
         * 清除准备项目
         */
        scope.clearPrepare = function () {
            console.log(scope.prepare);
            Object.keys(scope.prepare).forEach(function (index) {
                scope.prepare[index] = undefined;
            });
        };
        
        
    }]);

    angular.bootstrap(document, ['app']);
});


