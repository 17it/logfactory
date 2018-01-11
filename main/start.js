var fs = require("fs");
var path = require('path');
var files = ['cf','cl','cn','cp'];
var args = process.argv.splice(2);
var ft = require('../util/formatTime');

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

var transFile = {
    init: function(name){
        this.name = name;
        this.initLogic();
    },
    initLogic: function(){
        var self = this;
        var filename = path.join(__dirname, '../src/') + self.name;
        var exec = require('child_process').exec;
        var cmdstr = "cat " + path.join(__dirname, "../out_log.log") + " | grep " + self.name + ":http > " + filename + "-first.log && sed 's/^....\-..\-.. ..\:..\: //g' " + filename + "-first.log > " + filename + "-one.log && sed -e 's/\&\&\&undefined//' " + filename + "-one.log > " + filename + "-second.log && sort " + filename + "-second.log > " + filename + "-tmp.log && uniq -c " + filename + "-tmp.log > " + filename + "-uniq.log && sort -nr " + filename + "-uniq.log > " + filename + "-first.log && sed -e 's/ *$/\",/' " + filename + "-first.log > " + filename + "-second.log && sed -e 's/^  */\"/' " + filename + "-second.log > " + filename + ".log && rm -f " + filename + "-*.log";
        console.log(cmdstr);
        files.splice(0, 1);
        exec(cmdstr, function(err,stdout,stderr){
            if(err) {
                console.log('cat out_log.log error: '+ stderr);
                return;
            }
            console.log(stdout);
            if(files.length > 0) {
                transFile.init(files[0]);
            }else {
                self.second();
            }
        });
    },
    second: function(){
        var _this = this;
        var exec = require('child_process').exec;
        var datetxt = ft((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000, 'YYYY-mm-DD').replace(/-/g,'');
        var dir = path.join(__dirname, '../backup/') + datetxt;
        var cmdstr = '';
	fs.exists(dir + '', function(exists){
            if(exists){
                cmdstr = 'rm -rf ' + dir + ' && mkdir ' + dir + ' && cp ' + path.join(__dirname, '../src/') + '*.log ' + dir;
            } else {
                cmdstr = 'mkdir ' + dir + ' && cp ' + path.join(__dirname, '../src/') + '*.log ' + dir;
            }
	
            exec(cmdstr, function(err,stdout,stderr){
                if(err) {
                    console.log('cp *.log error: '+ stderr);
                    return;
                }
                console.log(stdout);
                console.log('...............................sed logs end....................................');
                console.log('............................start general htmls.................................');
                _this.genHtmls();
            });
	});
    },
    genHtmls: function(){
        var _this = this;
        var exec = require('child_process').exec;
        var cmdstr = 'node ' + path.join(__dirname, 'main.js');
        exec(cmdstr, function(err,stdout,stderr){
            if(err) {
                console.log('genHtmls error: '+ stderr);
                return;
            }
            console.log(stdout);
        });
    }
};

transFile.init(files[0]);
