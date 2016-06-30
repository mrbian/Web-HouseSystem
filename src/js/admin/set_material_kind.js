/**
 * Created by bln on 16-6-29.
 */
require('../common/shared.js');

require('../../bower_components/toastr/toastr.min.css');
require('../../scss/admin/set_material_kind.scss');

require('../../bower_components/toastr/toastr.min.js');
require('angular');
var WebUploader = require('../../bower_components/fex-webuploader/dist/webuploader.min.js');

var uploader = WebUploader.create({
    server : '',
    pick : '#picker',
    resize : false
});

var $ = jQuery;

$(function () {

    var app = angular.module('app',[]);

    app.controller('MainCtrl',['$scope',function(scope){
        scope.createFile = function(){

        };
    }]);

    app.controller('ModalCtrl',['$scope','$http',function(scope,$http){

    }]);

    angular.bootstrap(document.documentElement, ['app']);
});