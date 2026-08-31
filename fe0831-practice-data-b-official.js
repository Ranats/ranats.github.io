(() => {
  "use strict";
  const BANK = window.FE_BANK;
  if (!BANK?.sections) return;
  const L = "アイウエオカキク".split("");
  const src = n => `IPA 基本情報技術者試験 科目B サンプル問題 問${n}（Web表示用再構成）`;
  const mk = (n,question,options,answer,brief,media={},guided=false,wrong="問題文・処理順・データ構造の条件と一致しない。") => ({
    id:`H-${String(n).padStart(2,"0")}`, section:"H", question, options, answer,
    correct_option: options[L.indexOf(answer)], brief, media, source_label:src(n), official:true, guided,
    option_explanations: options.map((o,i)=>L[i]===answer?`○ ${brief}`:`× ${wrong}`)
  });
  const Q = [
    mk(1,"x=1，y=2，z=3 と初期化し，x←y，y←z，z←x を順に実行した後，y と z を出力する。出力はどれか。",
      ["1,2","1,3","2,1","2,3","3,1","3,2"],"カ","逐次代入なので x=2，y=3，最後に z へ現在の x=2 が入る。",
      {kind:"code",title:"擬似コード",lines:["整数型: x ← 1","整数型: y ← 2","整数型: z ← 3","x ← y","y ← z","z ← x","yの値 と zの値 を出力"]},true,"代入前の値を保存して同時代入のように扱っている。"),
    mk(2,"関数 fizzBuzz で，3と5の両方で割り切れる場合を正しく判定するため，if / elseif の条件 a，b，c をどの順に置くか。",
      ["3 / 3と5 / 5","3 / 5 / 3と5","3と5 / 3 / 5","5 / 3 / 3と5","5 / 3と5 / 3"],"ウ","if は上から評価されるので，3と5の両方で割り切れる条件を最初に置く。",
      {kind:"code",title:"fizzBuzz",lines:["if (num が a で割り切れる)","  result ← \"aで割り切れる\"","elseif (num が b で割り切れる)","  result ← \"bで割り切れる\"","elseif (num が c で割り切れる)","  result ← \"cで割り切れる\""]},false,"15の倍数を3又は5の判定で先に確定させてしまう。"),
    mk(3,"makeNewArray({3,2,1,6,5,4}) の戻り値の配列で，要素番号5の値はどれか。",
      ["5","6","9","11","12","17","21"],"カ","out は累積和。{3,5,6,12,17,21} となるので5番目は17。",
      {kind:"code",title:"makeNewArray",lines:["outの末尾に in[1] を追加","for (iを2から要素数まで)","  tail ← out[outの要素数]","  outの末尾に tail + in[i] を追加","endfor","return out"]},true,"入力配列 in の5番目をそのまま答えている。"),
    mk(4,"大きい方から小さい方を引く性質を使って最大公約数を求める gcd の空欄として適切な組合せはどれか。",
      ["if(x≠y) / x<y / endif","if(x≠y) / x>y / endif","while(x≠y) / x<y / endwhile","while(x≠y) / x>y / endwhile"],"エ","xとyが等しくなるまで繰り返し，大きい方から小さい方を引く。",
      {kind:"code",title:"gcd",lines:["x ← num1","y ← num2","while (x ≠ y)","  if (x > y)","    x ← x - y","  else","    y ← y - x","  endif","endwhile","return x"]},false,"停止条件又は大小関係が逆になっている。"),
    mk(5,"正の実数 x，y に対して √(x²+y²) を返す calc の return 式として適切なものはどれか。",
      ["(pow(x,2)+pow(y,2))÷pow(2,0.5)","(pow(x,2)+pow(y,2))÷pow(x,y)","pow(2,pow(x,0.5))+pow(2,pow(y,0.5))","pow(pow(pow(2,x),y),0.5)","pow(pow(x,2)+pow(y,2),0.5)","pow(x,2)×pow(y,2)÷pow(x,y)","pow(x,y)÷pow(2,0.5)"],"オ","x²+y² を作り，全体を0.5乗すれば平方根になる。",
      {kind:"formula",title:"返したい値",lines:["√(x² + y²)","x² → pow(x, 2)","√a → pow(a, 0.5)"]},true,"平方根を全体へ適用できていない。"),
    mk(6,"8ビット値のビット並びを逆順にする rev の for ループ内の処理として適切なものはどれか。",
      ["r←(r<<1)∨(rbyte∧00000001); rbyte←rbyte>>1","r←(r<<7)∨(rbyte∧00000001); rbyte←rbyte>>7","r←(rbyte<<1)∨(rbyte>>7); rbyte←r","r←(rbyte>>1)∨(rbyte<<7); rbyte←r"],"ア","rを左へ1ビットずつずらし，rbyteの最下位ビットを追加してからrbyteを右へ1ビット進める。",
      {kind:"code",title:"ビット反転",lines:["rbyte ← byte","r ← 00000000","for (iを1から8まで)","  r ← (r << 1) ∨ (rbyte ∧ 00000001)","  rbyte ← rbyte >> 1","endfor"]},false,"1ビットずつ順に取り出す処理になっていない。"),
    mk(7,"非負整数 n の階乗を再帰で求める factorial で，n≠0 のとき return に入る式はどれか。",
      ["(n-1)×factorial(n)","factorial(n-1)","n","n×(n-1)","n×factorial(1)","n×factorial(n-1)"],"カ","n! = n × (n-1)! なので n×factorial(n-1)。",
      {kind:"code",title:"factorial",lines:["if (n = 0)","  return 1","endif","return □"]},false,"再帰呼出しで引数を1減らし，現在のnを掛ける形になっていない。"),
    mk(8,"優先度1が最も高い PrioQueue をプログラムどおり操作した後，sizeが0になるまでdequeueして出力する。出力順はどれか。",
      ["A,B,C,D","A,B,D,D","A,C,C,D","A,C,D,D"],"エ","最後のキューは優先度順に A(1), C(2), D(3), D(3) と取り出される。",
      {kind:"code",title:"優先度付きキュー",lines:["enqueue A1, B2, C2, D3","dequeue ×2","enqueue D3, B2","dequeue ×2","enqueue C2, A1","while size≠0: dequeueを出力"]},true,"優先度と，同一優先度では先に追加した要素を優先する規則を反映していない。"),
    mk(9,"図の2分木を order(1) で走査する。処理は左の子を再帰処理した後に自分を出力し，最後に右の子を再帰処理する。出力順はどれか。",
      ["1,2,3,4,5,6,7,8,9,10,11,12,13,14","1,2,4,8,9,5,10,11,3,6,12,13,7,14","8,4,9,2,10,5,11,1,12,6,13,3,14,7","8,9,4,10,11,5,2,12,13,6,14,7,3,1"],"ウ","左→自分→右の中間順（in-order）走査になる。",
      {kind:"tree",title:"2分木",lines:[]},false,"先行順又は後行順など，処理順が異なる。"),
    mk(10,"単方向リストからpos番目を削除する delNode で，prev が削除対象の直前を指している。prev.next に代入する式はどれか。",
      ["listHead","listHead.next","listHead.next.next","prev","prev.next","prev.next.next"],"カ","削除対象 prev.next を飛ばし，その次 prev.next.next へつなぎ替える。",
      {kind:"list",title:"単方向リスト",lines:["prev → [削除対象] → [次の要素]","          prev.next     prev.next.next","prev.next ← prev.next.next"]},false,"削除対象を飛ばして次の要素へリンクを張り替えられていない。"),
    mk(11,"binSort の戻り値に未定義の要素がなく，値が昇順になる入力はどれか。bins[data[i]]←data[i] とする。",
      ["{2,6,3,1,4,5}","{3,1,4,4,5,2}","{4,2,1,5,6,2}","{5,3,4,3,2,6}"],"ア","1～nを重複なく一度ずつ含む入力なら bins[1..n] が全て定義され，1,2,...,n となる。",
      {kind:"code",title:"binSort",lines:["n ← dataの要素数","bins ← {n個の未定義}","for (iを1からnまで)","  bins[data[i]] ← data[i]","endfor","return bins"]},false,"値の重複により未定義の添字が残る。"),
    mk(12,"simRatio で，同じ要素番号の文字が一致した個数 cnt を数えるための if 条件はどれか。",
      ["s1[i] ≠ s2[cnt]","s1[i] ≠ s2[i]","s1[i] = s2[cnt]","s1[i] = s2[i]"],"エ","同じ位置 i の s1[i] と s2[i] を比較し，一致したときだけcntを増やす。",
      {kind:"code",title:"simRatio",lines:["cnt ← 0","for (iを1からs1の要素数まで)","  if (□)","    cnt ← cnt + 1","  endif","endfor","return cnt ÷ s1の要素数"]},true,"比較する要素番号又は一致/不一致の条件が異なる。"),
    mk(13,"昇順配列を2分探索する search に不具合がある。無限ループになる data / target の条件はどれか。",
      ["要素数1でtarget=その要素","要素数2でtarget=先頭要素","要素数2でtarget=末尾要素","要素に-1が含まれる"],"ウ","要素数2で末尾を探すと middle=1 のまま low←middle となり，探索範囲が縮まらない。",
      {kind:"code",title:"不具合のある2分探索",lines:["low ← 1; high ← 要素数","while (low ≤ high)","  middle ← (low + high) ÷ 2 の商","  if data[middle] < target","    low ← middle   ← ここに注目","  elseif data[middle] > target","    high ← middle","  else return middle"]},false,"探索範囲が実際に縮小しない条件ではない。"),
    mk(14,"summarize({0.1,0.2,...,0.9,1}) が p={0,0.25,0.5,0.75,1} に対して findRank を呼ぶ。戻り値はどれか。",
      ["{0.1,0.3,0.5,0.7,1}","{0.1,0.3,0.5,0.8,1}","{0.1,0.3,0.6,0.7,1}","{0.1,0.3,0.6,0.8,1}","{0.1,0.4,0.5,0.7,1}","{0.1,0.4,0.5,0.8,1}","{0.1,0.4,0.6,0.7,1}","{0.1,0.4,0.6,0.8,1}"],"ク","i=ceil(p×(n-1)) を使うので添字は1,4,6,8,10となり，{0.1,0.4,0.6,0.8,1}。",
      {kind:"code",title:"findRank / summarize",lines:["i ← ceil(p × (要素数 - 1))","return sortedData[i + 1]","p ← {0, 0.25, 0.5, 0.75, 1}","各pのfindRank結果をrankDataへ追加"]},false,"ceil と 1始まりの配列添字の扱いが異なる。"),
    mk(15,"三目並べの状態遷移木で，葉を勝ち10・負け-10・引分け0とする。自分手番は子の最大値，相手手番は最小値を採用するとき，図のA，Bの評価値の組合せはどれか。",
      ["A=0 / B=-10","A=0 / B=0","A=10 / B=-10","A=10 / B=0"],"ア","相手手番では最小値，自分手番では最大値を選ぶため，A=0，B=-10。",
      {kind:"minimax",title:"ミニマックス",lines:["葉: 勝ち=10 / 負け=-10 / 引分け=0","自分の手番: max","相手の手番: min","A ?    B ?"]},false,"max/minを適用する手番が逆又は葉の評価を取り違えている。"),
    mk(19,"受注管理業務の一部をB社へ委託する。B社が入力した場合はA社が承認するという職務分離を保つとき，表のa1，a2に入る利用者の組合せはどれか。",
      ["A社販売責任者 / B社販売責任者","A社販売責任者 / B社販売担当者","B社販売責任者 / A社販売責任者","B社販売責任者 / B社販売担当者","B社販売担当者 / B社販売責任者"],"エ","B社販売責任者は閲覧のみ，B社販売担当者は閲覧・入力。承認はA社側に残す。",
      {kind:"table",title:"操作権限の考え方",lines:["A社販売責任者: 閲覧 + 承認","A社販売担当者: 閲覧 + 入力","B社販売責任者: 閲覧のみ","B社販売担当者: 閲覧 + 入力","B社入力 → A社承認"]},false,"入力者と承認者の職務分離，又はB社側の役割分担と一致しない。"),
    mk(20,"FWルールの誤った変更を防ぐため，職務分離の観点から最も適切な改善策はどれか。",
      ["EDRをコンソールへ導入","パスワード認証を多要素認証へ変更","コンソール/リモートのログイン担当を分離","運用担当者を1人に限定","一部を操作ログ確認だけの担当にする","編集担当とログ確認・操作承認担当を分け，必要最小限の権限を付与","曜日ごとに作業担当者を割り当てる"],"カ","編集者と確認・承認者を分離し，それぞれに必要最小限の権限を与えることで誤変更を防ぐ。",
      {kind:"table",title:"FW運用の職務分離",lines:["現状: 6名全員が編集・ログ確認・承認可能","問題: 編集者が自分で確認・承認できる","改善: 編集担当 ≠ 確認/承認担当","権限: 必要最小限に分離"]},false,"認証強化や担当人数変更だけでは，編集と承認の職務分離を実現できない。")
  ];
  const H = {id:"H",title:"科目B・本番形式",diagnostic_mapping:"B1・B2",recommended_time:"35〜40分",questions:Q,pool_size:Q.length,
    description:"IPA公式サンプル問題をWeb演習向けに再構成。毎回17問から8問を出題。"};
  const i = BANK.sections.findIndex(s=>s.id==="H");
  if (i >= 0) BANK.sections[i] = H; else BANK.sections.push(H);
})();
