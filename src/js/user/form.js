/**
 * Created by li-rz on 16-6-29.
 */
require('../common/shared');
require('../../scss/share/main.scss');
require('../../scss/user/form.scss');
require('../../bower_components/angular-toastr/dist/angular-toastr.min.css');
require('expose?Webuploader!../../bower_components/fex-webuploader/dist/webuploader');
require('angular');
require('angular-animate');
// require('toastr');
require('angular-toastr');
require('angular-route');
var $ = jQuery;
/**
 * todo : scope.upload_index不生效，原因待查
 * @type {number}
 */
var u_index = -1;
$(document).ready(function () {
    var app = angular.module('app', ['ngAnimate', 'toastr','ngRoute']);
    /**
     * 不同的router使用一个controller，而且两个页面之间最好不要有数据依赖！！！
     */
    app.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/',{
            controller : 'MainCtrl',
            templateUrl : 'Main.html'
        }).when('/info',{
            controller : 'infoCtrl',
            templateUrl : 'info.html'
        }).when('/file',{
            controller : 'formController',
            templateUrl : 'form.html'
        });
    }]);
    var progress = $('#progress');
    // 当有文件添加进来的时候
    // 文件上传过程中创建进度条实时显示。

    var uploader = Webuploader.create({
                // 不压缩image
                resize: false,
                server: '/upload',
                pick: '#upload'
            });

    app.controller('OutCtrl',['$scope','$location',function(scope,$location){
        scope.step = 0;
        scope.last = false;
        scope.isRefresh = true;
        scope.next = function(){
            scope.isRefresh = false;
            scope.step = (++ scope.step) % 3;
            console.log(scope.step);
            scope.last = scope.step == 2;
            var href = scope.step == 1 ? '/info' :
                scope.step == 2 ? '/file' : '';
            $location.path(href);
        };


        /**
         * 下面的代码是给MainCtrl和formCtrl通信用
         */
        scope.TYPE = {
            POWER: 0,
            REGISTER1: 1,
            REGISTER2: 2
        };

        scope.loaded = false;
        scope.loading = '加载中.......';
        scope.upload_index = -1;

        scope.insert_data = {
            power: [
                {title: '所有权登记', right_type: 1},
                {title: '抵押权登记', right_type: 2},
                {title: '地役权登记', right_type: 3},
                {title: '预告登记', right_type: 4},
                {title: '其他登记', right_type: 0}
            ],
            register1: undefined,
            register2: undefined,
            file_items: undefined
        };
        scope.button = {
            power: scope.insert_data.power[0].title,
            register1: undefined,
            register2: undefined
        };

        scope.show_data  = {
            power: undefined,
            register1: undefined,
            register2: undefined
        };
    }]);

    app.controller('MainCtrl',['$scope', '$http', '$templateCache', 'toastr', '$location',
        function(scope, http, cache, toastr,$location) {

            /**
             * 权力类型，大类id，小类id
             * @param right_id
             * @param id
             * @param business_id
             */
            function getData (right_id, id, business_id) {
                console.log(arguments);
                http({
                    method: 'GET',
                    url: '/user/form_data/' +
                    right_id +
                    (id ?
                    '/' + id +
                    (business_id ? '/' + business_id : '')
                        : ''),
                    cache: cache
                }).then(function (res) {
                        var data = res.data;
                        scope.loaded = true;
                        Object.keys(data).forEach(function (value) {
                            scope.insert_data[value] = data[value];
                        });
                        console.log(data);
                        Object.keys(data).forEach(function (value) {
                            scope.button[value] = data[value][0].title
                        });

                        scope.show_data.power = right_id;
                        scope.show_data.register1 = id || scope.insert_data.register1[0].id;
                        scope.show_data.register2 = business_id || scope.insert_data.register2[0].id;
                    },
                    function (err) {
                        scope.loading = '加载失败';
                        console.error(err);
                        toastr.error('加载失败', '错误：');
                    });
            }

            getData(1);

            /**
             * 接收按钮改变事件，并且重新拉取数据
             * @param type
             * @param text
             * @param index
             */
            scope.changePowerButton = function (type, text, index) {
                console.log(index);
                switch (type) {
                    case scope.TYPE.POWER:
                        if (scope.button.power ===
                            scope.insert_data.power[index].title) {
                            return;
                        }
                        // console.log('button: ', scope.button);
                        getData(scope.insert_data.power[index].right_type);
                        scope.button.power = text.title;
                        break;
                    case scope.TYPE.REGISTER1:
                        if (scope.button.register1 ===
                            scope.insert_data.register1[index].title) {
                            return;
                        }
                        getData(scope.show_data.power,
                            scope.insert_data.register1[index].id);
                        scope.button.register1 = text.title;
                        break;

                    case scope.TYPE.REGISTER2:
                        if (scope.button.register2 ===
                            scope.insert_data.register2[index].title) {
                            return;
                        }
                        getData(scope.show_data.power,
                            scope.show_data.register1,
                            scope.insert_data.register2[index].id);

                        scope.button.register2 = text.title;


                        break;
                    default:
                        throw Error('Fuck You');
                        break;
                }
            };

            /**
             * todo : upload 监听就像scoket.on 一样执行几次监听几次，需要写的更安全点
             */
            uploader.on('fileQueued', function (file) {
                toastr.info(file.name + '文件上传中');
                uploader.upload(file);
            });

            uploader.on('uploadSuccess', function (file) {
                toastr.success(file.name + '上传成功');
                scope.insert_data.file_items[u_index].isUpload = true;
                uploader.reset();
                scope.upload_id = undefined;
                u_index = -1;
                scope.upload_index = -1;
                http({
                    method: "POST",
                    data: JSON.stringify({id: scope.upload_id}),
                    url: '/user/form'
                }).then(
                    function (res) {
                        console.log(res);
                    },
                    function (err) {
                        console.error(err);
                    });
            });

            uploader.on('uploadError', function (file) {
                scope.upload_id = undefined;
                scope.upload_index = -1;
                u_index = -1;
                toastr.error('上传文件失败', '错误：');
                uploader.reset();
            });

            // http.post()
        }
    ]);

    app.controller('infoCtrl',['$scope', '$http', '$templateCache', 'toastr', '$location',
        function(scope, http, cache, toastr, $location) {
            if(scope.isRefresh){
                $location.path('/');
            }
        }
    ]);

    app.controller('formController', ['$scope', '$http', '$templateCache', 'toastr', '$location',
        function (scope, http, cache, toastr,$location) {

            var upload = document.querySelector('#upload');

            if(scope.isRefresh){
                $location.path('/');
            }

            scope.upload_id = undefined;
            scope.uploadFile = function (index) {
                var file_input = upload.querySelector('input[type="file"]');
                // console.log(file_input);
                scope.upload_index = index;
                u_index = index;
                scope.upload_id = scope.insert_data.file_items[index].id;
                file_input.click();
            };

            scope.downloadFile = function (index) {
                var url = scope.insert_data.file_items[index].url;
                window.open(window.location.host + url);
                // http({
                //     method: 'GET',
                //     url: url
                // }).then(
                //     function (res) {
                //         console.log(res);
                //     },
                //     function (err) {
                //         console.error(err);
                //         toastr.error('下载文件失败', '错误：');
                //     });
            };

        }]);

    angular.bootstrap(document, ['app']);
});