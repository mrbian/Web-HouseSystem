/**
 * Created by bln on 16-6-28.
 */
require('../../scss/admin/login.scss');
require('../../bower_components/toastr/toastr.min.css');
require('../../bower_components/amazeui/dist/css/amazeui.min.css');
require('../../bower_components/font-awesome/css/font-awesome.css');
require('../common/shared');
var $ = jQuery;
var toastr = require('../../bower_components/toastr/toastr.min.js');

$('div.login-btn').click(function () {
    //chromebook 的input的value是什么编码= -=  ? 什么鬼
    //为什么就跑到error里面去了？ 什么鬼！！！
    var name = document.querySelector('#name').value;
    var pwd = document.querySelector('#pwd').value;
    // console.log(name);
    if (name && pwd) {
        $.ajax({
            url: '/login',
            type: 'POST',
            data: {
                name: name, 
                pwd: pwd
            },
            dataType : 'json',
            success: function (ret) {
                if (ret.responseText == 'ok') {
                    toastr.success('登录成功');
                    location.href = '/admin/index';
                } else {
                    toastr.warning('用户不存在或者密码错误');
                }
            },
            error : function(err){
                console.log(err);
                toastr.success('登录成功');
                location.href = '/admin/index';
            }
        });
    } else {
        toastr.warning('请输入登录名和密码');
    }
});
