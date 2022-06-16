secretフォルダ以下にgoogleドライブ読み込みのためのjsonファイルを置く


# cron　設定例
12時と24時にfileをgoogleドライブにアップロード
3時間おきにmessageを取得してmongodbにアップロード
```shell
1 12/12 * * *   cd /home/xxx/www/slacklog/update/;/home/xxx/local/python/bin/python3 /home/xxx/www/slacklog/update/google_upload_file.py
1 1/3 * * *  cd /home/xxx/www/slacklog/update/; /home/xxx/local/python/bin/python3 /home/xxx/www/slacklog/update/message_logging.py
```
