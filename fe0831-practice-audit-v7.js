(() => {
  const sections = window.FE_BANK && window.FE_BANK.sections;
  if (!Array.isArray(sections)) return;
  const byId = {};
  for (const s of sections) for (const q of s.questions || []) byId[q.id] = q;

  if (byId["B-4"]) {
    byId["B-4"].option_explanations = [
      "× 時間計画保全や状態監視保全は稼働後の保全手法であり，設計・製造由来の初期欠陥を減らす直接策ではない。",
      "× 累積動作時間に基づく経時保全は使用時間に応じた保全であり，設計・製造由来の初期欠陥を減らす直接策ではない。",
      "○ 初期故障は設計・製造上の欠陥が主因なので，設計審査や故障解析の強化が有効。",
      "× 部品の事前取替えは寿命・劣化に備える保全であり，設計・製造ミスに起因する初期故障への主対策ではない。"
    ];
  }
  if (byId["D-1"]) {
    byId["D-1"].brief = "CSMA/CDは共有媒体・半二重Ethernetで，送信中の衝突を検出して再送する方式。";
    byId["D-1"].option_explanations[1] = "○ CSMA/CDは共有媒体・半二重Ethernetで衝突を検出し，再送する方式。";
  }
  if (byId["H-5"]) {
    Object.assign(byId["H-5"], {
      question: "配列x={2,1,3}について，out[0]←x[0]とし，i=1,2の順にout[i]←out[i-1]+x[i]として累積和を求める。out[2]の値はどれか。",
      brief: "out[0]=2，out[1]=2+1=3，out[2]=3+3=6。",
      option_explanations: [
        "× 3はout[1]の値であり，最後のout[2]ではない。",
        "× 累積和は2→3→6となるので5にはならない。",
        "○ out[0]=2，out[1]=3，out[2]=6となる。",
        "× 元配列の全要素の和は6なので7にはならない。"
      ]
    });
  }
  if (byId["H-7"]) {
    const opts = [
      "nが3の倍数 / nが3と5の両方の倍数 / nが5の倍数",
      "nが3の倍数 / nが5の倍数 / nが3と5の両方の倍数",
      "nが3と5の両方の倍数 / nが3の倍数 / nが5の倍数",
      "nが5の倍数 / nが3の倍数 / nが3と5の両方の倍数",
      "nが5の倍数 / nが3と5の両方の倍数 / nが3の倍数"
    ];
    Object.assign(byId["H-7"], {
      question: "1以上の整数nについて，条件a，b，cをこの順に評価し，aなら「FizzBuzz」，bなら「Fizz」，cなら「Buzz」と出力する。a，b，cに入る判定条件の組合せとして適切なものはどれか。",
      options: opts,
      correct_option: opts[2],
      brief: "15の倍数を最初に判定し，次に3の倍数，最後に5の倍数を判定する。",
      option_explanations: [
        "× 3の倍数を先に判定すると，15の倍数もFizzとして処理されてしまう。",
        "× 3の倍数を先に判定するため，15の倍数をFizzBuzzとして分離できない。",
        "○ 3と5の両方の倍数を最初に判定し，次に3，最後に5を判定すればよい。",
        "× 5の倍数を先に判定すると，15の倍数もBuzzとして処理されてしまう。",
        "× 5の倍数を先に判定するため，15の倍数をFizzBuzzとして分離できない。"
      ]
    });
  }
})();
