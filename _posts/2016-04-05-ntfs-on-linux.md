---
layout: post
title: ntfsなボリュームを読み書きする
tag: ArchLinux
---

ntfsなボリュームに書き込みが出来なかったので覚え書き。
<br>
<br>

ちょっとファイルを移そうと思って、ふとコピーしようとした時に、  
「読み込み専用です！」って言われて、

`$ mount -w /dev/sdaX /mnt/hoge `

ってしても` mount `で確認すると` (ro, ... `になってる。

権限とか所有者、グループとかかなーと思ったけど、
調べてみると`NTFS-3G`ってのを入れると良さそう。

`$ yaourt -S ntfs-3g `

入れたらマウント。

`$ mount -t ntfs-3g /dev/sdaX /mount/hoge `

エンコードだの云々書いてる記事もあったけど、特に指定なしでも以後問題なさそう。

> Arch ではマウントタイプ ntfs-3g を明示的に指定する必要はありません。ntfs-3g パッケージがインストールされていれば mount コマンドはデフォルトで /usr/bin/ntfs-3g にシンボリックリンクされている /usr/bin/mount.ntfs を使用します。
> <br>https://wiki.archlinuxjp.org/index.php/NTFS-3G#.E6.89.8B.E5.8B.95.E3.83.9E.E3.82.A6.E3.83.B3.E3.83.88

との事で、` ntfs-3g `をインストールしていれば普通に(GUI上のファイルマネージャも)マウントするとやってくれるみたい。

#### 参考
- NTFS-3G - ArchWiki  
https://wiki.archlinuxjp.org/index.php/NTFS-3G
- LinuxでNTFSのHDDをマウントする - 犬も歩けば棒も歩く
http://d.hatena.ne.jp/prime503/20091024/1256344170