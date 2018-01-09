var fs = require('fs');  
var path = require('path');
var args = process.argv.splice(2);
var head = '', foot = '';
var ft = require('../util/formatTime');
var files = ['cp','cl','cn','cf'];

if(args.length > 0){
    files = [];
    for(var i = 0; i < args.length; i ++){
        if(files.indexOf(args[i]) < 0
            && ['cp','cl','cn','cf','ep','el','en','ef'].indexOf(args[i]) > -1){
            files.push(args[i]);
        }
    }
}

if(files.length < 1){
    console.log('需要参数');
    return;
}


var genHtmls = {
    init: function(name){
        this.name = name;
        this.filename = path.join(__dirname, '../src', this.name + '.log');
        this.timeext = ft((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000, 'YYYY-mm-DD');
        this.dstname = path.join(__dirname, '../../hl', this.name + '-' + this.timeext  + '.html');

        if(!head) {
            fs.readFile(path.join(__dirname,'../common/head.html'), 'utf-8', function (err, data) {
                if (err) throw err;
                head = data;
            });
            fs.readFile(path.join(__dirname,'../common/footer.html'), 'utf-8', function (err, data) {
                if (err) throw err;
                foot = data;
                genHtmls.initLogic();
            });
        } else {
            this.initLogic();
        }
    },
    initLogic: function(){
        files.splice(0, 1);
        var _this = this;

        fs.exists(_this.filename, function(ext){
            if(ext){
                fs.readFile(_this.filename, 'utf-8', function (err, data) {
                    if (err) throw err;
                    fs.writeFile(_this.dstname, head + data + foot, function (err) {
                        if (err) throw err;
                        console.log("create "+ _this.name +" html success!");

                        if(files.length > 0) {
                            genHtmls.init(files[0]);
                        }else {
                            console.log('...............................create html done....................................');
                            var exec = require('child_process').exec;
                            var cmdstr = 'rm -f ' + path.join(__dirname, '../src/*.log');
                            exec(cmdstr, function(err,stdout,stderr){
                                if(err) {
                                    console.log('remove *.logs error: '+ stderr);
                                    return;
                                }
                                console.log('remove *.logs success');
                            });
                        }
                    });
                });
            }
        }); 
    }
};

genHtmls.init(files[0]);
