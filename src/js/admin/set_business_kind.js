/**
 * Created by bln on 16-7-3.
 */
require('../common/shared.js');

require('../../bower_components/toastr/toastr.min.css');
require('../../scss/admin/set_business_kind.scss');

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

    function ajaxError(){
        toastr.error('服务器错误，请debug');
    }

    var app = angular.module('app',[]);

    app.controller('MainCtrl',['$scope','$http',function(scope,$http){
        scope.init = function(){
            $http
                .get('/super/agent/get_all_business_kind')
                .success(function(data){
                    console.log(data);
                    scope.dataObj = JSON.parse(JSON.stringify(data));
                    scope.dataObjCached = JSON.parse(JSON.stringify(data));
                });
        };
        scope.init();
        scope.create = function(){
            modal_show();
        };
        scope.filter = '1';
        scope.dataObj = [];
        scope.dataObjCached = [];
        scope.search_text = '';

        scope.edit = function($index){
            scope.$broadcast('edit modal',$index);
        };

        scope.del = function($index){
            if(! confirm('您确认要删除吗?')){
                return;
            }
            // console.log($index);
            $http.post('/super/agent/del_material_kind',{
                id : scope.dataObj[$index].id
            }).success(function(ret){
                // console.log(ret);
                if(ret == 'ok'){
                    toastr.info('删除成功');
                }else{
                    toastr.warning('删除失败');
                }
            }).error(ajaxError);
            scope.dataObj.splice($index,1);
            scope.dataObjCached.splice($index,1);
        };
    }]);

    app.controller('ModalCtrl',['$scope','$http',function(scope,$http){
        var uploader = WebUploader.create({
            server : '/upload',
            pick : '#picker',
            resize : false
        });

        var uploaded = false;

        //初始化edit_id 和 is_edit
        scope.is_edit = false;
        scope.edit_id = -1;
        scope.edit_index = -1;

        scope.hide = function(){
            scope.url = '';
            scope.title = '';
            scope.is_need = 'yes';
            modal_hide();
        };
        scope.is_need = 'yes';
        scope.submit = function(){
            // console.log(! uploaded && !!scope.url);
            scope.$watch('title',function(newValue,oldValue){
                if(newValue == oldValue || ! oldValue || ! newValue){
                    return;
                }
                $http
                    .get('/super/agent/check_business_title',{title : newValue})
                    .success(function(ret){
                        console.log(ret);
                    });
            });

            if(!! scope.is_edit){
                $http.post('/super/agent/change_material_kind',{
                    id : scope.edit_id,
                    title : scope.title,
                    url : scope.url,
                    is_need : scope.is_need == 'yes'
                }).success(function(ret){
                    if(ret == 'false'){
                        toastr.error('缺少参数');
                        return;
                    }
                    toastr.success('材料修改成功');
                    scope.dataObj[scope.edit_index] = {
                        id : scope.edit_id ,
                        title : scope.title,
                        url : scope.url,
                        is_need : scope.is_need == 'yes'
                    };
                    scope.dataObjCached[scope.edit_index] = {
                        id : scope.edit_id ,
                        title : scope.title,
                        url : scope.url,
                        is_need : scope.is_need == 'yes'
                    };
                    scope.title = '';
                    scope.url = '';
                    scope.is_need = 'yes';
                    modal_hide();
                }).error(ajaxError);
            }else{
                $http
                    .post('/super/agent/add_material_kind',{
                        title : scope.title,
                        url : scope.url,
                        is_need : scope.is_need == 'yes'
                    }).success(function(ret){
                    if(ret == 'false') {
                        toastr.error('材料种类添加失败');
                        return;
                    }
                    toastr.info('材料种类添加成功');
                    // console.log(scope.$parent.dataObj[0]);
                    scope.$parent.dataObj.push({
                        id : ret,
                        title : scope.title,
                        url : scope.url,
                        is_need : scope.is_need
                    });
                    scope.$parent.dataObjCached.push({
                        id : ret,
                        title : scope.title,
                        url : scope.url,
                        is_need : scope.is_need
                    });
                    scope.title = '';
                    scope.url = '';
                    scope.is_need = 'yes';
                    modal_hide();
                });
            }
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
            toastr.success(file.name + '上传成功');
            scope.url = ret._raw.toString();
            uploaded = true;
            uploader.reset();
            scope.$digest();
        });

        uploader.on('uploadError',function(file,ret){
            toastr.error('上传出错');
            uploader.reset();
            uploaded = false;
        });

        uploader.on('uploadComplete',function(file){
            uploader.reset();
        });

        scope.$on('edit modal',function(event,$index){
            scope.is_edit = true;
            scope.edit_id = scope.dataObj[$index].id
            scope.edit_index = $index;
            scope.url = scope.dataObj[$index].url;
            scope.title = scope.dataObj[$index].title;
            scope.is_need = scope.dataObj[$index].is_need ? 'yes' : 'no';
            modal_show();
        });
    }]);

    app.controller('tableCtrl',['$scope','$http',function(scope,$http){
        scope.search_text = '';
        scope.search = function(){
            if(! scope.search_text ) {
                scope.$parent.dataObj = JSON.parse(JSON.stringify(scope.dataObjCached));
                return;
            }
            scope.$parent.dataObj = [];
            for(var x in scope.dataObjCached){
                var item = scope.dataObjCached[x];
                if(item.title.indexOf(scope.search_text) !== -1){
                    scope.$parent.dataObj.push(item);
                }
            }
        };
    }]);

    angular.bootstrap(document.documentElement, ['app']);
});