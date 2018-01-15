var exec = require('child_process').exec;
var cmdstr = "ls -l /root/study/hl | awk '{print$9}' > ./bb.log";

exec(cmdstr, function(err,stdout,stderr){
                                if(err) {
                                    console.log('remove *.logs error: '+ stderr);
                                    return;
                                }
                                console.log('remove *.logs success');
                            });

