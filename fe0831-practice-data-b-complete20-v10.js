(() => {
  "use strict";
  const bank = window.FE_BANK;
  const H = bank?.sections?.find(s=>s.id==="H");
  if(!H) return;
  const L="アイウエオカキク".split("");
  const add=(q)=>{if(!H.questions.some(x=>x.id===q.id))H.questions.push(q);};
  const mk=(id,n,question,options,answer,brief,media,wrong)=>({
    id, section:"H", question, options, answer, correct_option:options[L.indexOf(answer)], brief, media,
    source_label:`IPA 科目Bサンプル問題 問${n}（Web演習向け再構成）`, official:true, guided:false,
    option_explanations:options.map((o,i)=>L[i]===answer?`○ ${brief}`:`× ${wrong}`)
  });

  add(mk("H-16",16,
    "Unicodeの符号位置をUTF-8の3バイト符号へ変換する。utf8Bytes={224,128,128}とし，末尾バイトから順に cp の下位6ビットずつを取り出すため，『cp ÷ □ の余り』を加え，続いて『cp ← cp ÷ □ の商』とする。□に入る値はどれか。",
    ["16","32","64","256"],"ウ",
    "UTF-8の継続バイトへ格納するデータ部は6ビットなので，2^6=64で余りと商を取り出す。",
    {kind:"code",title:"encode｜UTF-8 3バイト",lines:["utf8Bytes ← {224, 128, 128}","cp ← codePoint","for (iを3から1まで1ずつ減らす)","  utf8Bytes[i] ← utf8Bytes[i] + (cp ÷ □ の余り)","  cp ← cp ÷ □ の商","endfor","return utf8Bytes"]},
    "3バイトUTF-8のデータ部を6ビット単位で分割する値になっていない。"));

  add(mk("H-17",17,
    "A社のECサイトはB社のPaaS上で稼働し，A社は開発・運用をC社へ委託している。契約ではWebアプリケーションプログラムの脆弱性対策はC社が実施する。診断で①アプリケーションサーバOSの既知脆弱性，②XSS脆弱性，③DBMSの既知脆弱性が指摘された。各項番に対処する組合せとして適切なものはどれか。",
    ["①A社 ②C社 ③B社","①B社 ②B社 ③C社","①B社 ②C社 ③B社","①C社 ②B社 ③C社"],"ウ",
    "PaaS基盤のOS/DBMSはB社，Webアプリケーションの脆弱性対策は契約上C社が担当するため，B社・C社・B社。",
    {kind:"table",title:"責任分界を整理",lines:["① アプリケーションサーバOS → PaaS基盤側","② XSS → Webアプリケーション側","③ DBMS → PaaS基盤側","契約: Webアプリ脆弱性対策はC社"]},
    "PaaS基盤側とWebアプリケーション側の責任分界が一致していない。"));

  add(mk("H-18",18,
    "客先常駐開発部員に個人所有PCの業務利用（BYOD）とVPN接続を新たに許可する。変更によって増加する又は新たに生じるリスクの組合せとして最も適切なものはどれか。",
    ["VPN接続増加による可用性低下 / A社PC紛失","VPN接続増加による可用性低下 / 感染した個人PCから社内へマルウェア拡散","A社PC紛失 / フィッシング感染","総務部員の個人PC接続 / フィッシング感染"],"イ",
    "新たにVPN接続数が増えることによる可用性リスクと，感染した個人所有PCを社内へ接続することでマルウェアが拡散するリスクが増える。",
    {kind:"table",title:"変更前→変更後",lines:["変更前: 客先常駐開発部員は個人PCからVPN不可","変更後: BYOD + VPNを新たに許可","見る点1: VPN接続数が増える","見る点2: 管理外端末が社内ネットワークへ接続する"]},
    "変更前から存在していたリスク，又は今回の変更では増加しないリスクを含んでいる。"));

  H.questions.sort((a,b)=>Number(a.id.split("-")[1])-Number(b.id.split("-")[1]));
  H.pool_size=H.questions.length;
  H.description="IPA公式科目Bサンプル問題をWeb演習向けに再構成した20問。";
})();
