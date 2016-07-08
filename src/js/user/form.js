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
var $ = jQuery;

// var Webuploader = Webuploader;
// require('angular');

$(document).ready(function () {
    var app = angular.module('app', ['ngAnimate', 'toastr']);
    var progress = $('#progress');
    var temp = '';
    var abort;
    // var uploader = Webuploader.create({
    //     // 不压缩image
    //     resize: false,
    //     chunked: false,
    //     fileNumLimit: 1,
    //     // swf文件路径
    //     swf: '../bower_components/fex-webuploader/dist/Uploader.swf',
    //     // 文件接收服务端。
    //     server: '/user/form',
    //     auto: false,
    //     // 选择文件的按钮。可选。
    //     // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    //     pick: '.uploader'
    // });
    //
    // // 当有文件添加进来的时候
    // uploader.on('fileQueued', function (file) {
    //     console.log(file);
    //     temp = file.id;
    //     progress.append('<p>文件准备上传</p>' +
    //         '<button class="btn btn-danger" id="abort">取消</button>');
    //     $('#container').hide();
    //     abort = $('#abort');
    //     abort.on('click', function () {
    //         uploader.reset();
    //         $('#container').show();
    //         progress.empty();
    //     });
    // });
    //
    // // 文件上传过程中创建进度条实时显示。
    // uploader.on('uploadProgress', function (file, percentage) {
    //     // var $li = $('#' + file.id),
    //     var $percent = progress.find('.progress .progress-bar');
    //
    //     // 避免重复创建
    //     if (!$percent.length) {
    //         $percent = $('<div class="row"><div class="col-md-1"></div>'
    //             + '<div class="col-md-9"><div class="progress progress-striped active">'
    //             + '<div class="progress-bar" role="progressbar" style="width:0;">'
    //             + '</div>' + '</div></div></div>').appendTo(progress);//.find('.progress-bar');
    //     }
    //
    //     // // $li.find('#' + file.id).text('上传中');
    //     //
    //     $percent.css('width', percentage * 100 + '%');
    // });
    //
    // uploader.on('uploadSuccess', function (file) {
    //     progress.empty();
    //     progress.append('<p>上传成功</p>')
    // });
    //
    // uploader.on('uploadError', function (file) {
    //     progress.empty();
    //     progress.append('<p>上传失败</p>')
    // });
    //
    // uploader.on('uploadComplete', function (file) {
    //     progress.empty();
    // });
    //
    // uploader.on('uploadAccept', function (object, ret) {
    //
    // });
    

    app.controller('formController', ['$scope', '$http', '$templateCache', 'toastr',
        function (scope, http, cache, toastr) {
            scope.TYPE = {
                POWER: 0,
                REGISTER1: 1,
                REGISTER2: 2
            };

            scope.loaded = false;
            scope.loading = '加载中.......';

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
        
        // http.post()

            scope.downloadFile = function (index) {
                var url = scope.insert_data.file_items[index].url;
                http({
                    method: 'GET',
                    url: url
                }).then(function (res) {},
                    function (err) {
                        console.error(err);
                        toastr.error('下载文件失败', '错误：');
                    });
            }
    }]);

    angular.bootstrap(document, ['app']);
});