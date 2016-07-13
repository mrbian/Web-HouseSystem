/**
 * Created by bln on 16-7-4.
 */
require('../common/shared.js');
require('../../bower_components/toastr/toastr.min.css');
require('../../scss/admin/set_small_business_kind.scss');
require('../../scss/user/list.scss');
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
        scope.STATE = {
            NOT_PASS : -1,
            FIRST : 1,
            SECOND : 2,
            THIRD : 3,
            PASS : 4,
            ERROR : -2
        };
        scope.init = function(){
            $http
                .get('/user/agent/get_all_business')
                .success(function(data){
                    // console.log(data);
                    scope.dataObj = JSON.parse(JSON.stringify(data));
                    scope.dataObjCached = JSON.parse(JSON.stringify(data));
                });
        };
        scope.init();
        scope.filter = '1';
        scope.dataObj = [];
        scope.dataObjCached = [];
        scope.search_text = '';
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