/**
 * Created by bln on 16-6-29.
 */
require('../common/shared.js');

require('../../bower_components/toastr/toastr.min.css');
require('../../scss/admin/set_material_kind.scss');

require('expose?toastr!../../bower_components/toastr/toastr.min.js');
require('angular');
require('angular-animate'); //本身不能产生动画，但是可以监听事件
var WebUploader = require('../../bower_components/fex-webuploader/dist/webuploader.min.js');

var $ = jQuery;

$(function () {

    var modal = angular.element('div.my-modal');
    var backdrop = angular.element('div.my-modal-backdrop');
    function modal_show(){
        backdrop.css('visibility','visible');
        modal.css('visibility','visible');
        modal.addClass('in');
        backdrop.addClass('in');
    }

    function modal_hide(){
        modal.removeClass('in');
        backdrop.removeClass('in');
        backdrop.css('visibility','hidden');
        modal.css('visibility','hidden');
    }

    var app = angular.module('app',[]);

    app.controller('MainCtrl',['$scope','$http',function(scope,$http){

        scope.createFile = function(){
            modal_show();
        };
        scope.filter = '1';
        scope.dataObj = {};
        scope.search_text = '';
        scope.search = function(){

        };

        scope.edit = function(){

        };

        scope.del = function(){

        };



    }]);

    app.controller('ModalCtrl',['$scope','$http',function(scope,$http){
        var uploader = WebUploader.create({
            server : '/upload',
            pick : '#picker',
            resize : false
        });

        var uploaded = false;


        scope.hide = function(){
            modal_hide();
        };
        scope.is_need = 'yes';
        scope.submit = function(){

        };

        uploader.on('fileQueued',function(file){
            uploader.upload(file);
            toastr.info(file.name + '正在上传');
        });

        uploader.on('uploadSuccess',function(file,ret){
            if(ret == 'false'){
                toastr.error(file.name + '上传失败，请刷新页面重试');
                return;
            }
            console.log(ret);
            toastr.success(file.name + '上传成功');
            scope.url = ret;
        });
    }]);

    angular.bootstrap(document.documentElement, ['app']);
});