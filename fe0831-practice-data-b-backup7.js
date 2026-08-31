(() => {
  "use strict";
  const BANK = window.FE_BANK;
  if (!BANK?.sections) return;
  const L = "アイウエオカキク".split("");
  const source = n => `IPA 基本情報技術者試験 科目B サンプル問題 問${n}`;
  const q = (id,n,question,options,answer,brief,media,wrong) => ({
    id, section:"I", question, options, answer,
    correct_option:options[L.indexOf(answer)], brief, media,
    source_label:source(n), official:true, backup:true,
    option_explanations:options.map((x,i)=>L[i]===answer?`○ ${brief}`:`× ${wrong}`)
  });

  const questions = [
    q("I-2",2,
      "関数 fizzBuzz は，引数で与えられた値が3で割り切れて5で割り切れない場合は『3で割り切れる』を，5で割り切れて3で割り切れない場合は『5で割り切れる』を，3と5で割り切れる場合は『3と5で割り切れる』を返す。それ以外は『3でも5でも割り切れない』を返す。プログラム中の a～c の正しい組合せはどれか。",
      ["a=3 / b=3と5 / c=5","a=3 / b=5 / c=3と5","a=3と5 / b=3 / c=5","a=5 / b=3 / c=3と5","a=5 / b=3と5 / c=3"],
      "ウ","if / elseif は上から評価されるので，3と5の両方で割り切れる条件を最初に置く。",
      {kind:"code",title:"fizzBuzz",lines:["文字列型: fizzBuzz(整数型: num)","if (num が [a] で割り切れる)","  result ← \"[a]で割り切れる\"","elseif (num が [b] で割り切れる)","  result ← \"[b]で割り切れる\"","elseif (num が [c] で割り切れる)","  result ← \"[c]で割り切れる\"","else","  result ← \"3でも5でも割り切れない\"","endif","return result"]},
      "15の倍数を3又は5で先に確定させる順序になっている。"),

    q("I-4",4,
      "関数 gcd は，二つの正の整数 num1，num2 の最大公約数を，大きい方から小さい方を引く性質を用いて求める。プログラム中の a～c の正しい組合せはどれか。",
      ["a=if / b=< / c=endif","a=if / b=> / c=endif","a=while / b=< / c=endwhile","a=while / b=> / c=endwhile"],
      "エ","xとyが等しくなるまで繰り返し，大きい方から小さい方を引くので while / > / endwhile。",
      {kind:"code",title:"gcd",lines:["整数型: gcd(整数型: num1, 整数型: num2)","x ← num1","y ← num2","[a] (x ≠ y)","  if (x [b] y)","    x ← x - y","  else","    y ← y - x","  endif","[c]","return x"]},
      "停止条件又は大小関係が問題文の性質と一致しない。"),

    q("I-6",6,
      "関数 rev は8ビット型の引数 byte を受け取り，ビットの並びを逆にした値を返す。例えば rev(01001011) の戻り値は11010010である。forループ中の空欄に入る処理として適切なものはどれか。",
      [
        "r←(r<<1)∨(rbyte∧00000001); rbyte←rbyte>>1",
        "r←(r<<7)∨(rbyte∧00000001); rbyte←rbyte>>7",
        "r←(rbyte<<1)∨(rbyte>>7); rbyte←r",
        "r←(rbyte>>1)∨(rbyte<<7); rbyte←r"
      ],
      "ア","rbyteの最下位ビットを1個ずつ取り出し，rを左へ1ビットずらして追加し，rbyteを右へ1ビット進める。",
      {kind:"code",title:"rev",lines:["8ビット型: rev(8ビット型: byte)","rbyte ← byte","r ← 00000000","for (i を 1 から 8 まで)","  [空欄]","endfor","return r","","∧: ビット単位AND / ∨: ビット単位OR","<<: 左シフト / >>: 右シフト"]},
      "1ビットずつ読み出して逆順に積み上げる処理になっていない。"),

    q("I-7",7,
      "関数 factorial は非負整数 n の階乗を返す。n=0 のとき1を返し，それ以外の場合の return 式として適切なものはどれか。",
      ["(n-1)×factorial(n)","factorial(n-1)","n","n×(n-1)","n×factorial(1)","n×factorial(n-1)"],
      "カ","n! = n × (n-1)! なので n×factorial(n-1)。",
      {kind:"code",title:"factorial",lines:["整数型: factorial(整数型: n)","if (n = 0)","  return 1","endif","return [空欄]"]},
      "再帰呼出しで引数を1減らし，現在のnを掛ける形になっていない。"),

    q("I-9",9,
      "手続 order は，2分木で左の子を再帰処理した後に自分を出力し，最後に右の子を再帰処理する。order(1) として呼び出したときの出力順はどれか。",
      [
        "1,2,3,4,5,6,7,8,9,10,11,12,13,14",
        "1,2,4,8,9,5,10,11,3,6,12,13,7,14",
        "8,4,9,2,10,5,11,1,12,6,13,3,14,7",
        "8,9,4,10,11,5,2,12,13,6,14,7,3,1"
      ],
      "ウ","左→自分→右の中間順（in-order）で走査する。",
      {kind:"tree",title:"2分木",lines:[]},
      "先行順又は後行順など，プログラムの出力位置と異なる順序になっている。"),

    q("I-10",10,
      "手続 delNode は単方向リストからpos番目の要素を削除する。posが1以外のとき，繰返し終了後の prev は削除対象の一つ前を指している。prev.next に代入する式として適切なものはどれか。",
      ["listHead","listHead.next","listHead.next.next","prev","prev.next","prev.next.next"],
      "カ","削除対象 prev.next を飛ばし，その次 prev.next.next へつなぎ替える。",
      {kind:"list",title:"単方向リスト",lines:["大域: ListElement: listHead","if (pos = 1)","  listHead ← listHead.next","else","  prev ← listHead","  for (i を 2 から pos-1 まで)","    prev ← prev.next","  endfor","  prev.next ← [空欄]","endif","","prev → [削除対象] → [次の要素]","       prev.next      prev.next.next"]},
      "削除対象を飛ばして次の要素へリンクを張り替える式になっていない。"),

    q("I-13",13,
      "昇順・重複なしの配列 data を2分探索する関数 search には不具合がある。例えば，どの条件で無限ループになるか。",
      [
        "要素数が1で，targetがその要素と等しい",
        "要素数が2で，targetが先頭要素と等しい",
        "要素数が2で，targetが末尾要素と等しい",
        "要素に-1が含まれる"
      ],
      "ウ","要素数2で末尾を探すと middle=1 のまま low←middle となり，探索範囲が縮まらない。",
      {kind:"code",title:"不具合のある2分探索",lines:["low ← 1","high ← dataの要素数","while (low ≤ high)","  middle ← (low + high) ÷ 2 の商","  if (data[middle] < target)","    low ← middle   ← 注目","  elseif (data[middle] > target)","    high ← middle","  else","    return middle","  endif","endwhile","return -1"]},
      "探索範囲が実際に縮小しない条件ではない。")
  ];

  const section = {
    id:"I",
    title:"科目B・追加演習7問",
    diagnostic_mapping:"B1・B2｜バックアップ",
    recommended_time:"30〜35分",
    description:"授業で扱わないIPA公式サンプル7問。時間が余った場合・任意課題用。",
    questions
  };
  const i = BANK.sections.findIndex(s=>s.id==="I");
  if(i>=0) BANK.sections[i]=section; else BANK.sections.push(section);
})();
