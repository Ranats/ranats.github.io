(() => {
  "use strict";
  const bank = window.FE_BANK;
  if(!bank?.sections) return;
  const clone = x => JSON.parse(JSON.stringify(x));
  const shuffle = a => {
    a=[...a];
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
  };
  const sec=id=>bank.sections.find(s=>s.id===id);
  const wrap=(prefix,q)=>{
    const c=clone(q);
    c.origin_id=q.id;
    c.id=`${prefix}-${q.id}`;
    c.section=prefix;
    return c;
  };

  // 科目A総合: 90分 / 60問。
  // アプリ内の分野別プールから，A〜Eを各8問，F/Gを各10問として60問を構成。
  // この分野配分は学習用のアプリ内設計であり，IPAが公表する厳密な本番出題比率を意味しない。
  const tech = ["A","B","C","D","E"].flatMap(id => shuffle(sec(id)?.questions||[]).slice(0,8));
  const f = shuffle(sec("F")?.questions||[]).slice(0,10);
  const g = shuffle(sec("G")?.questions||[]).slice(0,10);
  const a60 = shuffle([...tech,...f,...g]).map(q=>wrap("J",q));
  const J = {
    id:"J",
    title:"科目A総合｜本番想定",
    diagnostic_mapping:"科目A 全分野",
    recommended_time:"90分",
    questions:a60,
    display_count:60,
    exam_mode:true,
    exam_subject:"A",
    description:"90分・60問。分野別問題プールから構成する総合模試。",
    scoring_note:"本試験はIRTに基づく評価点方式。アプリでは正答数・正答率を参考値として表示する。"
  };

  // 科目B総合: 100分 / 20問。Hの20問を全問使用。
  const hQuestions = (sec("H")?.questions||[]).map(q=>wrap("K",q));
  const K = {
    id:"K",
    title:"科目B総合｜本番想定",
    diagnostic_mapping:"科目B 全分野",
    recommended_time:"100分",
    questions:hQuestions,
    display_count:20,
    exam_mode:true,
    exam_subject:"B",
    description:"100分・20問。IPA科目Bサンプル問題をWeb演習向けに再構成した20問を全問出題。",
    scoring_note:"本試験はIRTに基づく評価点方式。アプリでは正答数・正答率を参考値として表示する。"
  };

  bank.sections = bank.sections.filter(s=>!['J','K'].includes(s.id));
  bank.sections.push(J,K);
})();
