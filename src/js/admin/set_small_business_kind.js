/**
 * Created by bln on 16-7-4.
 */
require('../common/shared.js');
require('../../bower_components/toastr/toastr.min.css');
require('../../scss/admin/set_small_business_kind.scss');

require('expose?toastr!../../bower_components/toastr/toastr.min.js');
require('angular');
// require('angular-animate'); //本身不能产生动画，但是可以监听事件
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
            var url = '/admin/small_business_detail/' + scope.dataObj[$index].id;
            location.href = url;
        };

        scope.del = function($index){
            if(! confirm('您确认要删除吗?')){
                return;
            }
            // console.log($index);
            $http.post('/super/agent/del_small_business_kind',{
                id : scope.dataObj[$index].id
            }).success(function(ret){
                // console.log(ret);
                if(ret == 'ok'){
                    toastr.success('删除成功');
                }else{
                    toastr.warning('删除失败');
                    return;
                }
                scope.dataObj.splice($index,1);
                scope.dataObjCached.splice($index,1);
            }).error(ajaxError);
        };
    }]);

    app.controller('ModalCtrl',['$scope','$http',function(scope,$http){
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