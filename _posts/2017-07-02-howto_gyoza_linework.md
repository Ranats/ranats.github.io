---
layout: post
title: AEで集中線をつくりたい
tag: AfterEffects
---

### はじめに

<blockquote class="twitter-tweet tw-align-center" data-conversation="true" data-cards="" data-partner="tweetdeck"><p lang="und" dir="ltr"><a href="https://t.co/xktAklzKj1">pic.twitter.com/xktAklzKj1</a></p>&mdash; らなとす 8thGen (@Ranats85) <a href="https://twitter.com/Ranats85/status/881526657562976256">July 2, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### 覚え書き

1. **コンポジションをつくる**

    元のコンポ(集中線を乗せたいコンポ)より大きめのサイズで新規コンポジションを作成する.

2. **フラクタルノイズ**

    新規平面を作成し，エフェクト > ラクタルノイズで元となる線をつくる．
    
    ![gyoza]({{site.baseurl}}/images/gyoza/fractal.png){:width="100%"}
    
    コントラスト，明るさ，スケールの幅・高さを調節して良い感じにする．

3. **グラデーションマスク**

    新規レイヤーをつくり，エフェクト > グラデーションを追加．
    
    ![gyoza]({{site.baseurl}}images/gyoza/gradation.png){:width="100%"}
    
    黒と白の位置を良い感じに調節する．
    
    レイヤーの描画モードを「焼き込み(リニア)」にして重ねるとこんな感じになる．
    
    ![gyoza]({{site.baseurl}}/images/gyoza/fractal_gradation.png){:width="60%"}

4. **極座標**

    一番上になるレイヤーをつくり，エフェクト > 極座標を追加．
    
    ![gyoza]({site.baseurl}}/images/gyoza/kyokuzahyou_param.jpg){ :width="60%" }
    
    補間を100%にし，変換の種類を「長方形から極線へ」に変更する．こんな感じになる．
    
    ![gyoza]({{site/baseurl}}/images/gyoza/fractal_kyokuzahyou.png){ :width="60%" }
    
5. **完成**

    元のコンポに戻って，重ねたい所に上記で作成した集中線のコンポを追加する．
    
    描画モード「スクリーン」で重ねたら回したり好きなようにして完成．
    
    ![gyoza]({{site.baseurl}}/images/gyoza/saigo.png){:width="100%"}
    
---
参考

- AfterEffectsの使い方｜フラクタルノイズで集中線を作る : [http://cubelic3.jp/aftereffects_fractal02/](http://cubelic3.jp/aftereffects_fractal02/)
- 【AE】至高の集中線を作ろう｜Valkyrja-Graphics.net∽Blog : [http://valkyrja-graphics.net/blog/archives/801](http://valkyrja-graphics.net/blog/archives/801)
