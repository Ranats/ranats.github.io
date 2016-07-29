---
layout: post
title: SinatraでActiveRecordでPostgresqlでherokuで
tag: Heroku
---

よく分かっていないので覚え書き．


- HerokuにPostgresqlのアドオンを入れる

`% heroku addons:add heroku-postgresql --app <APPNAME>	`

- コンフィグを確認

`% heroku config --app <APPNAME>`

   [DATABASE_URL] ってのに名前とかがまとめて追加されてる．
   
-	psqlを使ってみる

`% heroku pg:psql`

<img src="/images/0730/port.png" width=100% />
　ｱｯﾊｲ(ラボ，というか大学のファイアウォールがﾌｧｲﾔｰしてる)
    
- 参考の記事を参考にわーっと作る．

  herokuにデプロイする部分で何かタイムアウトしていたので代わりに以下を実行．
  
`% heroku run:detached rake db:migrate`


＜＜＜W I P＞＞＞

このへん
SinatraからActiveRecord 3を使う(2) CRUD操作 - アインシュタインの電話番号 : http://blog.ruedap.com/2011/04/17/ruby-sinatra-active-record-3-crud
http://blog.ruedap.com/2011/04/18/ruby-sinatra-active-record-3-validate
http://blog.ruedap.com/2011/04/19/ruby-sinatra-active-record-3-meta-where

---
参考

- NOT SO BAD / Sinatra✕ActiveRecord✕PostgreSQLでデータベース操作。 : http://blog.notsobad.jp/post/60070706766/sinatra-activerecord-postgresql%E3%81%A7%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E6%93%8D%E4%BD%9C