var fs = require("fs");
var path = require('path');

var transFile = {
    init: function(){
        this.head = '';
        this.foot = '';
        this.arr = '';
        this.dstname = path.join(__dirname, '../../sum/sum.html');
        this.initLogic();
    },
    initLogic: function(){
        var self = this;
        var _dir = path.join(__dirname, '../main/');
        var exec = require('child_process').exec;
        // "sort -k 2 -t '-' " + _dir + "_sum.log > " + _dir + "_year.log
        var cmdstr = "ls -l " + path.join(__dirname, '../../hl') + " | awk '{print$9}' > _sum.log && sed -e 's/ *$/\",/' " + _dir + "_sum.log > " + _dir + "_sum-second.log && sed -e 's/^/\"/' " + _dir + "_sum-second.log > " + _dir + "_sum.log";
        
        console.log(cmdstr);
        exec(cmdstr, function(err,stdout,stderr){
            if(err) {
                console.log('gen log error: '+ stderr);
                return;
            }
            console.log(stdout);
            self.genHtmls();
        });
    },
    genHtmls: function(){
        var _this = this;
        
        fs.readFile(path.join(__dirname,'../common/head-sum.html'), 'utf-8', function (err, data) {
            if (err) throw err;
            _this.head = data;
            fs.readFile(path.join(__dirname,'../common/footer-sum.html'), 'utf-8', function (err, data) {
                if (err) throw err;
                _this.foot = data;
                fs.readFile(path.join(__dirname, './_sum.log'), 'utf-8', function (err, data) {
                    if (err) throw err;
                    _this.arr = data;
                    fs.writeFile(_this.dstname, _this.head + _this.arr + _this.foot, function (err) {
                        if (err) throw err;
                        console.log("create sum html success!");
        
                        var exec = require('child_process').exec;
                        var cmdstr = 'rm -f ./main/_*.log';
                        exec(cmdstr, function(err,stdout,stderr){
                            if(err) {
                                console.log('rm _*.log error: '+ stderr);
                                return;
                            }
                            console.log(stdout);
                        });
                    });
                });
            });
        });
    }
};

transFile.init();



