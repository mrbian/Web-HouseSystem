/**
 * Created by bln on 16-6-28.
 */
var superagentPromisePlugin = require('superagent-promise-plugin');
require('es6-promise').polyfill();
var request = superagentPromisePlugin.patch(require('superagent'));
var charset = require('superagent-charset');
charset(request);
var should = require('should');
var path = require('path');
var fs = require('fs');
var baseUrl = 'http://localhost:8000';

describe('Test the agent of router',function (){
    it('upload a file should work ok',function(done){
        request
            .post(baseUrl + '/upload')
            .field('user[name]', 'Test')
            .attach('image',path.join(__dirname,'../public/head.jpg'))
            .then(function(res){
                console.log(res.text);
                done();
            });
    });
});