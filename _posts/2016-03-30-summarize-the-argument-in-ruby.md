---
layout: post
title: Rubyで引数をまとめる
tag: Algorithm
---


組み合わせを作る時に悩んだので覚え書き。
<br>

#### productメソッド(Array)
` array.product(other_array, ...) `

[product (Array) - Rubyリファレンス](http://ref.xaio.jp/ruby/classes/array/product)

<br>

#### 問題：
複数の入力があり、データベースから当てはまる要素をもつ配列をそれぞれ生成し、
それらの配列から組み合わせを生成する。


入力の数が3つ、とかの時に

```ruby:sample.rb
requests = ["foo","bar","baz"]
array = []
requests.each do |request|
	array << DB.collect{|item| item.include?(request)}
end
array[0].product(array[1],array[2])
```

みたいな感じで書いてた。

ばってん入力の数を可変にしようと思ったときに、productの引数どうしよう。ってなった。
調べてみると splat展開 とやらが使えそう。

` [*0...5]   #=> [0, 1, 2, 3, 4] `

` [*'abcde'] #=> ['a', 'b', 'c', 'd', 'e']`

つまり

` [*Array.new(3){|i| Array.new(2){|j| (i*2)+j}}] #=> [[0,1], [2,3], [4,5]]`


ということで最初のコードを書き直してみる。

```ruby:sample.rb
requests = ["foo","bar","baz", ... ]
array = []
requests.each do |request|
	array << DB.collect{|item| item.include?(request)}
end

head = array.shift
head.product(*array)
```

やったね！


そもそももっとスマートに組み合わせ作れるよって意見もあると思うけど、覚え書きという事でひとつ…
<p style="font-size: 0.8em;">こういう書き方あるよってのがあればリプライ投げつけてください。</p>


#### 参考
- Ruby関数の引数を配列でまとめて渡す。 - それマグで！
[http://takuya-1st.hatenablog.jp/entry/2014/02/24/174150](http://takuya-1st.hatenablog.jp/entry/2014/02/24/174150)
- ここまで出来る！RubyのSplat Operatorまとめ - RailsとRubyとVimのブログ
[http://alpaca.tc/blog/ruby/how-to-use-star.html](http://alpaca.tc/blog/ruby/how-to-use-star.html)
- splat での Array 式展開 - Qiita
[http://qiita.com/hotchpotch/items/4228405cb0edc734fac3](http://qiita.com/hotchpotch/items/4228405cb0edc734fac3)