---
layout: post
title: urxvtのフォントサイズを動的に変える話
tag: ArchLinux
---

ターミナルのフォントサイズをﾍﾟﾍﾟｯって変えてるの良いなーと思ったので。
<br>
<br>

[ArchWiki](https://wiki.archlinuxjp.org/index.php/Rxvt-unicode#.E3.83.95.E3.82.A9.E3.83.B3.E3.83.88.E3.82.B5.E3.82.A4.E3.82.BA.E3.82.92.E5.8D.B3.E5.BA.A7.E3.81.AB.E5.A4.89.E6.9B.B4)にはPerl拡張とやらを使えばキーバインドでﾍﾟﾍﾟｯって出来るって書いてたけど、
なんかキーバインドが反応してくれなかった。
  
[このフォーラム](https://bbs.archlinux.org/viewtopic.php?id=44121)曰く

` printf '\33]50;%s\007' "xft:Terminus:pixelsize=20" `  
  
でフォントサイズが変えられるとのこと。
<br><br>
  
~/.Xdefaultsに
` urxvt.keysym.C-0: command ... `
を追記したら動きはしたけど「+1px」とかは出来そうになかったのでシェルスクリプトを書く。  
<font size=2>urxvtのフォントサイズを拾える変数とかあったりしないのかな?</font>

~/bin/urxvt-font

```bash
#!/bin/sh
printf '\33]50;%s\007' "xft:Ricty:Bold:antialias=true:size=$1"
```
  
これで

`$ urxvt-font 10 `

とかで好きなフォントサイズに変えられるように。やったね。  
<br>

ちなみに

` $ urxvt -fn xft:Ricty:pixelsize=10 `  

とかオプション付けると指定したフォントで新しく開けるみたい。