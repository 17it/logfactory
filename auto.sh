#!/bin/bash

echo -e '\n'
echo -e '\n'
echo -e '\n'
echo '---------------------------------------start---------------------------------------'
echo -e '\n'

filename=`ls -l /root/study/log-backup/ | tail -n 1 | awk '{print $9}'`
echo $filename

cp /root/study/log-backup/$filename /root/study/logfactory/
echo 'copy success'

gunzip /root/study/logfactory/$filename
echo 'unzip success' 

file=${filename/\.gz/}
echo $file

mv /root/study/logfactory/$file /root/study/logfactory/out_log.log
echo 'rename success'

node /root/study/logfactory/main/start
echo 'gen htmls success'

rm -f /root/study/logfactory/out_log.log
echo 'remove old log file success'

echo -e '\n'
echo '---------------------------------------end---------------------------------------'
echo -e '\n'
echo -e '\n'
echo -e '\n'

