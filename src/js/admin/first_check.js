/**
 * Created by bln on 16-6-29.
 */
require('../common/shared');
require('../../scss/share/main.scss');
require('../../scss/admin/first_check.scss');
require('angular');
// var JSON = require("querystring");

var $ = jQuery;
$(document).ready(function () {
    var app = angular.module('app', []);
    app.controller('check_controller', ['$scope', '$http', '$templateCache',
        function (scope, http, cache) {
        scope.loaded = false; // 判断是否已经成功加载
        scope.loading = '加载中.......';　// 加载中或者加载失败（加载文字）
        scope.if_reason = true; // 展示不能为空comment
        scope.reason = ''; // comment
        scope.TYPE = {
            SUCCESS: 1,
            EXCLUSION: 0
        };
        scope.search = ''; // 搜索内容
        // scope.data  = undefined; // 数据
        scope.all_items = undefined; // all title => {id, title}
        scope.check_items = undefined; // show title

        scope.prepare = {
            item: undefined,
            message: undefined
        }; // 准备发送的数据

        /**
         * 拖数据
         */
        http({
            method: 'GET',
            url: 'first_check_data',
            cache: cache
        }).then(function (res) {
            // scope.data = ;

            scope.all_items = res.data.map(function (value) {
                return {
                    title: value.title,
                    id: value.id
                };
            });
            scope.check_items = scope.all_items.slice();
            // console.log(scope.check_items);
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

        /**
         *
         * @param type
         */
        scope.verifiedItem = function (type) {
            // 发送数据，准备删除

            /**
             * 发送数据，改变数据库内参数
             * @param type
             * @param data
             */
            function sendMessage (type, data) {
                var post_data = {
                    type: type,
                    id: scope.check_items[scope.prepare.item].id,
                    comment: data || ' '
                };

                http.post(
                    'first_check',
                    JSON.stringify(post_data)
                ).then(
                    function (res) {
                        console.log(res);
                        if (res.data.finish) {
                            scope.all_items = scope.all_items.filter(function (value) {
                                console.log(value.id);
                                return value.id !== scope.check_items[scope.prepare.item].id;
                            });

                            // 清除搜索框
                            scope.check_items = scope.all_items.slice();
                            // if (type === scope.TYPE.EXCLUSION) {
                            //     $('#delete-item').modal('hide');
                            // } else if (type === scope.TYPE.SUCCESS) {
                            //     $('#pass-item').modal('hide');
                            // }
                            scope.clearPrepare();
                        }
                    },
                    function (error) {
                        console.error(error);
                    })
            }

            switch(type) {
                case scope.TYPE.EXCLUSION:
                    if(!scope.reason) {
                        scope.if_reason = false;
                        return;
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

        scope.searchItem = function () {
            if (scope.search) {
                scope.check_items = scope.check_items.filter(function (value) {
                    return value.title.indexOf(scope.search) > -1;
                });
                scope.search = '';
            } else {
                scope.check_items = scope.all_items.slice();
            }
        }

    }]);

    angular.bootstrap(document, ['app']);
});


