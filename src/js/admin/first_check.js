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
    app.controller('check_controller', ['$scope', '$http', '$templateCache', function (scope, http, cache) {
        scope.loaded = false;
        scope.loading = '加载中.......';
        scope.check_items = [];
        scope.if_reason = true;
        scope.reason = '';
        scope.TYPE = {
            SUCCESS: 1,
            EXCLUSION: 0
        };

        scope.prepare = {
            item: undefined,
            message: undefined
        };

        /**
         * 拖数据
         */
        http({
            method: 'GET',
            url: 'first_check_data',
            cache: cache
        }).then(function (res) {
            scope.all_item = res.data.map(function (value) {
                return value.title;
            });
            scope.check_items = scope.all_item.slice();
            scope.loaded = true;
        }, function (res) {
            scope.loading = '加载失败，请刷新';
            // console.log(res);
        });

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

            /**
             * 发送数据，改变数据库内参数
             * @param type
             * @param data
             */
            function sendMessage (type, data) {
                http({
                    method: 'POST',
                    url: 'first_check'
                }).then(
                    function (res) {},
                    function (error) {})
            }
            
            switch(type) {
                case scope.TYPE.EXCLUSION:
                    if(!scope.reason) {
                        scope.if_reason = false;
                    }
                    sendMessage(scope.TYPE.EXCLUSION, scope.reason);
                    // 成功关闭
                    // $('#delete-item').modal('hide'); // add to sendMessage
                    // scope.reason = '';
                    // 关掉模态框
                    break;

                case scope.TYPE.SUCCESS:
                    sendMessage(scope.TYPE.SUCCESS);
                    // 发送结果
                    break;

                default:
                    throw Error('Fuck You!');
                    break;
            }
        };
        
        /**
         * 清除准备项目
         */
        scope.clearPrepare = function () {
            console.log(scope.prepare);
            Object.keys(scope.prepare).forEach(function (index) {
                scope.prepare[index] = undefined;
            });

            scope.if_reason = true;
        };
        
        
    }]);

    angular.bootstrap(document, ['app']);
});


