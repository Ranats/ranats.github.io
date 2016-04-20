---
layout: post
title: 追記：ibus-mozcの初期入力モードを「ひらがな」にする。
tag: ArchLinux
---

ibus-mozc、起動後の初期入力モードが「直接入力」になっていて、
毎回マウス操作で入力モードを「ひらがな」に切り替えるの面倒だーと常々思っていたので修正した話。
<br>
<br>

調べてみると公式が「現行バージョンでは初期モードを変更する事はできない」って言ってるのを見かけた。

ソースを修正してビルドすればイケる、との事。

```
$ yaourt -G ibus-mozc
$ cd ibus-mozc
$ ls
PKGBUILD emacs-mozc.install

$ makepkg -s
...
```

「property_handler.cc」の83行目、「const bool kActivatedOnLaunch = false;」をtrueに変更する事で設定できるらしい。

```
$ find -name property_handler.cc
./src/mozc/src/unix/ibus/property_handler.cc

$ vim src/mozc/src/unix/ibus/property_handler.cc

...
// Some users expect that Mozc is turned off by default on IBus 1.5.0 and later.
// https://code.google.com/p/mozc/issues/detail?id=201
// On IBus 1.4.x, IBus expects that an IME should always be turned on and
// IME on/off keys are handled by IBus itself rather than each IME.
#if IBUS_CHECK_VERSION(1, 5, 0)
const bool kActivatedOnLaunch = true; //false;
#else
const bool kActivatedOnLaunch = true;
#endif  // IBus>=1.5.0
...
```

ビルドする。

```
$ yaourt -U ibus-mozc-2.17.2313.102-1-x86_64.pkg.tar.xz
```

<br>
再ログイン後入力メソッドを切り替えると、ちゃんと「ひらがな」入力が初期モードに設定されてる。

<br>
<br>

## 追記
薄々気づいてはいたけど、なんか実はうまく行ってなかったっぽい

Mozcのリポジトリ(https://github.com/google/mozc) をforkして、上記ファイル(property_handler.cc)を編集。

PKGBUILDを編集してソースをForkしたリポジトリに変更する。

```
$ vim PKGBUILD
...
source=(
	mozc::git+https://github.com/Ranats/mozc.git
    http://...
    http://...
)
...
```

ibus-mozcがインストールしてある場合はアンインストール後、
makepkg してビルド。

<br>

...なんかエラー出たけど一緒に生成されてた mozc -> ibus-mozc の順番でインストールしたら入った。  
<br>

再起動して起動時から「ひらがな」が選択されてるのを確認。ﾔｯﾀｰ

<br>
#### まとめ
makepkg に関して<s>よく</s>まったく理解してなかった。
<br><br>

#### 参考
- ibus-mozc の初期モードを「ひらがな」入力にする | uvirt.com https://www.uvirt.com/wp1/20141026-134