/**
 * Created by bln on 16-7-4.
 */
require('../common/shared.js');
require('../../bower_components/toastr/toastr.min.css');
require('../../scss/admin/small_business_detail.scss');

require('expose?toastr!../../bower_components/toastr/toastr.min.js');
require('angular');
require('angular-animate'); //本身不能产生动画，但是可以监听事件
var WebUploader = require('../../bower_components/fex-webuploader/dist/webuploader.min.js');
var $ = jQuery;

/**
 * 可以给返回与创建页面加一个左右滑动的动画
 */

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
        var init_data = JSON.parse(angular.element('#data').html());
        var is_edit = ! init_data;
        scope.init = function(){
            if(init_data && init_data.id){
                $http
                    .get('/super/agent/get_all_small_business_file/' + init_data.id)
                    .success(function(data){
                        console.log(data);
                        scope.dataObj = JSON.parse(JSON.stringify(data));
                        scope.dataObjCached = JSON.parse(JSON.stringify(data));
                    });
            }
        };
        scope.init();
        scope.add = function(){
            modal_show();
        };
        scope.filter = '1';
        scope.dataObj = [];
        scope.dataObjCached = [];
        scope.search_text = '';

        scope.tab = 1;
        scope.switchTab = function (tab){
            scope.tab = tab;
        };

        scope.back = function (){
           location.href = '/admin/set_small_business_kind';
        };

        scope.is_free = 1;
        
        

        scope.del = function($index){
            if(is_edit){
                if(! confirm('您确认要删除吗?')){
                    return;
                }
                // console.log($index);
                $http.post('/super/agent/small_business_del_file',{
                    business_id : init_data.id,
                    material_id : scope.dataObj[$index].id
                }).success(function(ret){
                    // console.log(ret);
                    if(ret == 'ok'){
                        toastr.info('删除成功');
                    }else{
                        toastr.warning('删除失败');
                        return;
                    }
                    scope.dataObj.splice($index,1);
                    scope.dataObjCached.splice($index,1);
                }).error(ajaxError);
            }else{
                scope.dataObj.splice($index,1);
                scope.dataObjCached.splice($index,1);
            }
        };

        scope.submit = function(){
            if(is_edit){
                $http.post('/super/agent/change_small_business_kind',{
                    business_id : init_data.id,
                    title : scope.title,
                    is_free : scope.is_free,
                }).success(function(ret){
                    console.log('change ret',ret);
                });
            }else{
                $http.post('/super/agent/add_small_business_kind',{
                    title : scope.title,
                    is_free : scope.is_free,
                    file_list : scope.dataObj
                }).success(function(ret){
                    console.log('add ret',ret)
                });
            }
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

        scope.init = (function () {
            return function(){
                $http
                    .get('/super/agent/get_all_material_kind')
                    .success(function(ret){
                        // console.log('get material',ret);
                        scope.lists = ret;
                        scope.material = scope.lists[0].id;
                    });
            };
        })();
        scope.init();

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

        scope.right_type = '1';

        scope.submit = function (){
            console.log(scope.material);
            var file;
            for(var idx in scope.lists){
                if(scope.lists[idx].id == scope.material){
                    file = scope.lists[idx];
                }
            }
            scope.dataObj.push(file);
            scope.dataObjCached.push(file);
            modal_hide();
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