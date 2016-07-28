---
layout: post
title: Windows上にHerokuをセットアップ
tag: Heroku
---
どうも.<br>
　家に居たらブーバーが出てきたのでボール投げたら逃げられました.らなとすです.

久々にHeroku触ったので覚え書き.

Git、及びRubyはインストール済みのものとする.

---

0. Heroku Toolbeltをインストール

    https://toolbelt.heroku.com/
    
1. 以下、リポジトリを置きたいディレクトリ内での作業
2. Herokuにログイン

    `$heroku login`
3.   Herokuアプリケーションを作成

    `$heroku apps:create <app-name>`
4.    作成したアプリケーションのリポジトリをクローン

    `$git clone git@heroku.com:<app-name>.git`

    リポジトリ名でディレクトリが作成される.

    現在のディレクトリに展開して欲しい場合はピリオドで現ディレクトリを指定する.

    `$git clone git@heroku.com:<app-name>.git .`

    (Permission denied (publickey) で怒られた場合はHerokuに公開鍵を登録.

    `$heroku keys:add`)
5.    中身を用意

    とりあえずのsinatra

    ```ruby
    #app.rb
    require "sinatra"
    
    get "/" do
        "Hello world!"
    end
    ```
---

    ```ruby
    #config.ru
    require "./app"
    run Sinatra::Application
    ```
---

    ```ruby
    #Gemfile
    source "https://rubygems.org"
    gem "sinatra"
    ```
6.    コミット

    お好きに.
7.    .git/configを編集

    Herokuからcloneすると,「[remote "origin"]」がherokuをターゲットに設定されているらしいので,変更する.

    ```ruby
    ...
    [remote "heroku"]
        url = git@heroku.com:...
        ...
    ```
9.  デプロイ

    `$git push heroku master`

----
参考

- WindowsでHerokuをセットアップする手順 · GitHub : https://gist.github.com/weed/4192953