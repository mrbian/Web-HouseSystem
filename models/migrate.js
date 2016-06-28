var co = require('co');
var db = require('./index.js');
var models = db.models;

function * superUserInit(){

}

function * init(){
    yield db.sync({force : true});
}

co(function *(){
    yield init();
    console.log('finished');
}).catch(function(err){
    console.log(err);
});