/**
 * Created by bln on 16-6-30.
 */
var parse = require('co-busboy');
var path = require('path');
var fs = require('fs');
var util = require('../lib/utilx');

module.exports = (router) => {
    router.post('/upload',function * (){
        var ctx = this;
        if( !this.request.is('multipart/*')) return yield next;

        var parts = parse(this);
        var part,filename = 'test';
        while(part = yield parts){
            if(part.length){
                if(part[0] === 'name'){
                    filename = part[1];
                }
            } else {
                var prefix = util.getUniqueStr(6) + '_';
                filename = prefix + filename;
                var file_directory = path.join(__dirname,'../public/upload/file');
                var file_path = path.join(file_directory,filename);
                try{
                    fs.accessSync(file_directory);
                }catch (err){
                    fs.mkdirSync(file_directory);
                    ctx.body = 'false';
                    return;
                }
                var is_exist = fs.existsSync(file_path);
                if(is_exist) {
                    ctx.body = 'false';
                    return;
                }
                part.pipe(fs.createWriteStream(path.join(__dirname,'../public/upload/file',filename)));
            }
        }

        ctx.body = 'http://127.0.0.1:8080/upload/file/' + filename;
    });
};