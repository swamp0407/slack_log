# ファイル一覧
- .env
- .htaccess
- config.py
- index.cgi
- mongo.py
- requirements.txt

## .env
slackのtokenとmongodb atlasのurl:user:passなどが書かれている 部外秘()

## .htaccess
お馴染みのファイル
すべてindex.cgiに内部リダイレクトしている

## config.py
.envを読み出している
index.cgiで使用

## mongo.py
index.cgiで使用
mongoのインスタンス作成とかしている

## requirements.txt
使っているライブラリ一覧

## index.cgi
python3を使ったcgi
存在しているendpointは
- users.json
- bots.json
- channels.json
- ims.json
- messages/<string:channel>.json
- around_messages/<string:channel>.json
- search
- time
- team.json

### users.json
ユーザーの一覧を取得
### bots.json
ボットの一覧を取得
### channels.json
チャンネルの一覧を取得
### ims.json
ダイレクトメッセージの一覧を取得(存在しない)
### messages/<string:channel>.json
チャンネルごとのメッセージを取得
### around_messages/<string:channel>.json
指定された時間周辺のチャンネルごとのメッセージを取得
### search
指定されたwordで検索した結果を取得
### time

### team.json
workspaceの情報を取得


### 編集の仕方
①ディレクトリを自分のパソコンにダウンロード

② python3が使える環境を用意する

③ライブラリインストール

```
pip install -r requirements.txt
```

④いい感じにindex.cgiを編集する

# 参考リンク
- flaskの使い方

    https://msiz07-flask-docs-ja.readthedocs.io/ja/latest/
- pymongoの使い方
    
    https://pymongo.readthedocs.io/en/stable/
