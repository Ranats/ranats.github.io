(() => {
  "use strict";
  const STORE_KEY = "fe0831-practice-v1";
  const findI = () => window.FE_BANK?.sections?.find(s => s.id === "I");
  const byId = id => window.FE_BANK?.sections?.flatMap(s => s.questions || []).find(q => q.id === id);

  const style = document.createElement("style");
  style.textContent = `
    .q-source-badge.backup{color:#5e4b10;background:#fff8df;border-color:#eadb9a}
    .backup-note{margin:8px 0 0;font-size:11px;color:#6d5a17;font-weight:700}
  `;
  document.head.appendChild(style);

  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
  function svgText(s){return esc(s).replace(/\u2190/g,"←").replace(/\u2192/g,"→");}
  function drawTree(){
    const pos={1:[550,55],2:[320,125],3:[780,125],4:[170,205],5:[390,205],6:[670,205],7:[890,205],8:[100,285],9:[220,285],10:[330,285],11:[450,285],12:[610,285],13:[730,285],14:[870,285]};
    const edges=[[1,2],[1,3],[2,4],[2,5],[3,6],[3,7],[4,8],[4,9],[5,10],[5,11],[6,12],[6,13],[7,14]];
    let s=edges.map(([a,b])=>`<line x1="${pos[a][0]}" y1="${pos[a][1]+20}" x2="${pos[b][0]}" y2="${pos[b][1]-20}" stroke="#9cb4bd" stroke-width="2"/>`).join("");
    s+=Object.entries(pos).map(([v,p])=>`<circle cx="${p[0]}" cy="${p[1]}" r="20" fill="#eef8fa" stroke="#2a91ad" stroke-width="2"/><text x="${p[0]}" y="${p[1]+6}" text-anchor="middle" font-size="17" font-weight="700" fill="#19354c" font-family="Noto Sans JP, sans-serif">${v}</text>`).join("");
    return s;
  }
  function mediaSvg(m){
    if(!m) return "";
    const W=1100, lines=m.lines||[];
    const H=m.kind==="tree"?350:Math.max(260,110+lines.length*42);
    let body="";
    if(m.kind==="tree") body=drawTree();
    else {
      const mono=m.kind==="code"||m.kind==="list";
      body=lines.map((line,i)=>`<text x="54" y="${112+i*42}" font-size="${mono?18:19}" fill="#243242" font-family="${mono?'Noto Sans Mono, Noto Sans JP, monospace':'Noto Sans JP, sans-serif'}">${svgText(line)}</text>`).join("");
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img"><rect width="100%" height="100%" fill="#fff"/><rect x="0" y="0" width="100%" height="68" fill="#eef7fa"/><text x="44" y="44" font-size="25" font-weight="800" fill="#17365d" font-family="Noto Sans JP,sans-serif">${svgText(m.title||"問題資料")}</text>${body}</svg>`;
  }
  function dataUri(svg){return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);}

  function enhanceQuestionCards(){
    document.querySelectorAll('.q-card[data-q]:not([data-backup7-rich="1"])').forEach(card=>{
      const q=byId(card.dataset.q); if(!q || q.section!=="I") return;
      card.dataset.backup7Rich="1";
      const text=card.querySelector('.q-text'); if(!text) return;
      const row=document.createElement('div'); row.className='q-source-row';
      row.innerHTML=`<span class="q-source-badge">${esc(q.source_label||"IPA公式サンプル問題")}</span><span class="q-source-badge backup">追加演習バックアップ</span>`;
      text.insertAdjacentElement('afterend',row);
      if(q.media){
        const wrap=document.createElement('div'); wrap.className='q-media';
        const img=document.createElement('img'); img.alt=`${q.id} 擬似コード・図表`; img.loading='lazy'; img.src=dataUri(mediaSvg(q.media));
        const cap=document.createElement('div'); cap.className='q-media-caption';
        cap.textContent='授業で扱っていない公式サンプル問題です。途中の状態や根拠をメモしてから選択肢を選んでください。';
        wrap.append(img,cap); row.insertAdjacentElement('afterend',wrap);
      }
    });
  }

  function enhanceReviews(){
    document.querySelectorAll('.review:not([data-backup7-rich="1"])').forEach(d=>{
      const title=d.querySelector('.review-q')?.textContent||"";
      const id=title.split('｜')[0]; const q=byId(id); if(!q||q.section!=="I") return;
      d.dataset.backup7Rich="1";
      const body=d.querySelector('.review-body'); if(!body) return;
      const n=document.createElement('div'); n.className='review-source';
      n.textContent=`${q.source_label}｜追加演習バックアップ`;
      body.prepend(n);
    });
  }

  function refreshICard(){
    const card=document.querySelector('[data-section="I"]'); const s=findI(); if(!card||!s) return;
    const pills=card.querySelectorAll('.card-meta .pill');
    if(pills[0]) pills[0].textContent='7問';
    if(pills[1]) pills[1].textContent='目安 30〜35分';
    if(pills[2]) pills[2].textContent='授業の追加演習・任意課題';
    const map=card.querySelector('.section-map'); if(map) map.textContent='IPA公式サンプル7問｜授業未実施分';
    const status=card.querySelector('.status-pill');
    try{
      const store=JSON.parse(localStorage.getItem(STORE_KEY)||'{}');
      const best=store.best?.I;
      if(status && best?.score===best?.total && best?.total===7){
        status.textContent='満点'; status.className='pill status-pill status-done';
      }
    }catch{}
  }

  const obs=new MutationObserver(()=>{enhanceQuestionCards();enhanceReviews();refreshICard();});
  obs.observe(document.body,{childList:true,subtree:true});
  enhanceQuestionCards(); enhanceReviews(); refreshICard();
})();
