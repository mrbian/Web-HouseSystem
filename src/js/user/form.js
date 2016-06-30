/**
 * Created by li-rz on 16-6-29.
 */
require('../common/shared');
require('../../scss/user/form.scss');
require('expose?Webuploader!../../bower_components/fex-webuploader/dist/webuploader');
require('angular-toastr');
var $ = jQuery;

// var Webuploader = Webuploader;
// require('angular');

$(document).ready(function () {
    var app = angular.module('app', []);
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
    //     dnd: '#container',
    //     // 文件接收服务端。
    //     server: '/user/form',
    //     auto: false,
    //     // 选择文件的按钮。可选。
    //     // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    //     pick: '#picker'
    //     // accept: {
    //     //     title: 'Images',
    //     //     extensions: 'gif,jpg,jpeg,bmp,png',
    //     //     mimeTypes: 'image/*'
    //     // }
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
    

    app.controller('formController', ['$scope', '$http', function (scope, http) {
        scope.TYPE = {
            POWER: 0,
            REGISTER1: 1,
            REGISTER2: 2
        };



        scope.power_button = '选择权利类型';
        scope.register_button1 = '选择权利大类';
        scope.register_button2 = '选择权利小类';
        
        scope.show = {
            power: true,
            register1: false,
            register2: false,
            uploader: false
        };
        
        scope.power_types = [
            '所有权登记',
            '抵押权登记',
            '地役权登记',
            '预告登记',
            '其他登记'
        ];
        
        scope.register_types1 = [
            '初始登记'
        ];

        scope.register_types2 = [
            '商品房初始登记',
            '经济适用房初始登记',
            '城市房屋新建',
            '集体入地房屋新建',
            '集资建房'
        ];

        scope.file_items = [{
            name: '日出江花',
            if_need: false
        }];
        
        
        scope.changePowerButton = function (type, text) {

            switch (type) {
                case scope.TYPE.POWER:
                    scope.power_button = text;

                    if (!scope.show.register1) {
                        scope.show.register1 = true;
                    }
                    break;
                case scope.TYPE.REGISTER1:
                    scope.register_button1 = text;

                    if (!scope.show.register2) {
                        scope.show.register2 = true;
                    }
                    break;
                case scope.TYPE.REGISTER2:
                    scope.register_button2 = text;

                    if (!scope.show.uploader) {
                        scope.show.uploader = true;
                    }
                    break;
                default:
                    throw Error('Fuck You');
                    break;
            }
        };
        
        // http.post()

    }]);

    angular.bootstrap(document, ['app']);
});