/**
 * Created by bln on 16-6-28.
 */
var fs = require("fs");
var path = require("path");
var crypto = require('crypto');

function Utilx(){
    this.name = "utilx";
    this.signature = 'OurEDA';
}

Utilx.prototype.autoImport = function(nextPath,callback) {
    var isDir = fs.statSync(nextPath).isDirectory();
    if(isDir){
        fs
            .readdirSync(nextPath)
            .filter((file) => {
            return file !== "index.js" && file !== "migrate.js" && file.indexOf(".") !== 0;
    }).forEach((fileName) => {
            var tmpPath = path.join(nextPath,fileName);
        if(fs.statSync(tmpPath).isDirectory()){
            this.autoImport(tmpPath,callback);
        }else{
            callback(tmpPath);
        }
    });
    }
};

Utilx.prototype.msgWrraper = function(msg,is_error) {
    return {
        status : is_error ? 0 : 1,
        msg : msg
    }
};

//todo : 比较安全的方式是客户端也加密，约定一种加密方式，这样用户的明文永远都不会在路由上传输
Utilx.prototype.generatorToken = function(account,pwd,more) {
    var args = [].slice.call(arguments,1);
    var str = arguments[0];
    args.forEach(function(ele){
        str += '&' + ele;
    });
    var cipher = crypto
        .createCipher('aes192',this.signature);
    var token = cipher.update(str,'utf8','base64');
    token += cipher.final('base64');
    //console.log(token);
    return token;
};

Utilx.prototype.getTokenInfo = function(encrypted) {
    var decipher = crypto
        .createDecipher('aes192', this.signature);
    var decrypted = decipher
        .update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    //console.log(decrypted);
    return decrypted.split('&');
};

Utilx.prototype.generatorLoginToken = function(account){
    var LoginToken = crypto
        .createHmac('sha1',account)
        .update(this.getUniqueStr())
        .digest('base64');
    //console.log(LoginToken);
    return LoginToken;
};

Utilx.prototype.isNullOrUndefined = function(arg) {
    return arg === null || arg === undefined;
};

Utilx.prototype.extend = function() {
    //todo
};

Utilx.prototype.getUniqueStr = function(length){
    length = -(parseInt(length)) || -6;
    var timer = new Date().getTime().toString();
    return timer.substr(length);
};

Utilx.prototype.getRandomStr = function(length) {
    length = parseInt(length) || 6;
    return parseInt(Math.random() * Math.pow(10,length)).toString();
};

var utilx = new Utilx();

module.exports = utilx;
