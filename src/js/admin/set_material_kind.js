/**
 * Created by bln on 16-6-29.
 */
require('../common/shared.js');

require('../../bower_components/toastr/toastr.min.css');
require('../../scss/admin/set_material_kind.scss');

require('../../bower_components/toastr/toastr.min.js');
require('angular');

var $ = jQuery;

$(function () {
    var app = angular.module('app',[]);

    app.controller('MainCtrl',['$scope',function(scope){
        scope.createFile = function(){
              
        };
    }]);

    angular.bootstrap(document.documentElement, ['app']);
});