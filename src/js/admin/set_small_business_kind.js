/**
 * Created by bln on 16-7-4.
 */
require('../common/shared.js');
require('../../bower_components/toastr/toastr.min.css');
require('../../scss/admin/set_small_business_kind.scss');

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
                .get('/super/agent/get_all_small_business_kind')
                .success(function(data){
                    console.log(data);
                    scope.dataObj = JSON.parse(JSON.stringify(data));
                    scope.dataObjCached = JSON.parse(JSON.stringify(data));
                });
        };
        scope.init();
        scope.create = function(){
            location.href = '/admin/small_business_detail';
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
            $http.post('/super/agent/del_business_kind',{
                id : scope.dataObj[$index].id
            }).success(function(ret){
                // console.log(ret);
                if(ret == 'ok'){
                    toastr.info('删除成功');
                }else{
                    toastr.warning('删除失败，请先删除所有引用此登记大类的登记小类别');
                    return;
                }
                scope.dataObj.splice($index,1);
                scope.dataObjCached.splice($index,1);
            }).error(ajaxError);
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
            scope.title = '';
            scope.right_type = '1';
            scope.is_edit = false;
            scope.edit_id = -1;
            scope.edit_index = -1;
            scope.is_done = false;
            scope.is_right = -1;
            modal_hide();
        };
        scope.is_done = false;
        scope.is_right = -1;

        scope.$watch('title',function(newValue,oldValue){
            if(newValue == oldValue || ! newValue){
                return;
            }
            if(scope.is_edit){
                return;
            }
            $http
                .get('/super/agent/check_business_title',{ params :{title : scope.title}})
                .success(function(ret){
                    if(ret == 'ok'){
                        scope.is_done = true;
                        scope.is_right = 1;
                    }else{
                        scope.is_done = false;
                        scope.is_right = 0;
                    }
                }).error(ajaxError)
        });

        scope.right_type = '1';

        scope.submit = function(){
            // console.log(! uploaded && !!scope.url);

            if(!! scope.is_edit){
                $http.post('/super/agent/change_business_kind',{
                    id : scope.edit_id,
                    title : scope.title,
                    right_type : scope.right_type
                }).success(function(ret){
                    if(ret == 'false'){
                        toastr.warning('登记大类名不可重复！');
                        return;
                    }
                    toastr.success('登记大类修改成功');
                    scope.dataObj[scope.edit_index] = {
                        id : scope.edit_id ,
                        title : scope.title,
                        right_type : scope.right_type
                    };
                    scope.dataObjCached[scope.edit_index] = {
                        id : scope.edit_id ,
                        title : scope.title,
                        right_type : scope.right_type
                    };
                    scope.title = '';
                    scope.right_type = '1';
                    scope.is_edit = false;
                    modal_hide();
                }).error(ajaxError);
            }else{
                $http
                    .post('/super/agent/add_business_kind',{
                        title : scope.title,
                        right_type : scope.right_type
                    }).success(function(ret){
                    if(ret == 'false') {
                        toastr.warning('登记种类添加失败，请检查登记大类名称');
                        return;
                    }
                    toastr.info('登记种类添加成功');
                    // console.log(scope.$parent.dataObj[0]);
                    scope.$parent.dataObj.push({
                        id : ret,
                        title : scope.title,
                        right_type : scope.right_type
                    });
                    scope.$parent.dataObjCached.push({
                        id : ret,
                        title : scope.title,
                        right_type : scope.right_type
                    });
                    scope.title = '';
                    scope.right_type = '1';
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
            scope.edit_id = scope.dataObj[$index].id;
            scope.edit_index = $index;
            scope.title = scope.dataObj[$index].title;
            scope.is_right = -1;
            scope.right_type = scope.dataObj[$index].right_type.toString();
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