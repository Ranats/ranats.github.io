---
layout: post
title: ネットワークプリンタを設定した話
tag: ArchLinux
---

プリンタの検出どうすんのってなったので覚え書き。  
プリンタの型番はCanon MG 4230だった。
<br>
<br>

CUPSをインストールする。Common Unix Printing Systemの略らしい。

` $ yaourt -S cups, libcups `

プリンタのドライバをインストールする。

` $ yaourt -S cnijfilter-mg4200 `

CUPSを再起動する。

` $ systemctl restart org.cupsd.service `

プリンタのMACアドレスを調べる。

` $ cnijnetprn --installer --search auto `

` network cnijnet:/18-0C-AC-0C-CB-0E "Canon MG4200 series" ...`

CUPSにMG4200LANという名前で登録する。

` $ sudo /usr/sbin/lpadmin -p MG4200LAN -m canonmg4200.ppd -v cnijnet:/18-0C-AC-0C-CB-0E -E `

プリンタ設定からプリンタが見える。

<div class='inpic' style="margin-top:-20px;margin-bottom:-20px">
<img src="/images/print.png" width=100%/>
</div>

デフォルトのプリンタに設定する。

` $ sudo /usr/sbin/lpadmin -d MG4200LAN `

印刷できた。わーい。