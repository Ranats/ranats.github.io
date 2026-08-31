(() => {
  "use strict";
  const findH = () => window.FE_BANK?.sections?.find(s => s.id === "H");
  const allQuestions = () => findH()?._allQuestions || findH()?.questions || [];
  const byId = id => allQuestions().find(q => q.id === id) || findH()?.questions?.find(q => q.id === id);

  const style = document.createElement("style");
  style.textContent = `
    .q-source-row{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:-2px 0 12px}
    .q-source-badge{font-size:10px;font-weight:800;color:#17677e;background:#eaf6f9;border:1px solid #cde8ee;border-radius:999px;padding:5px 8px}
    .q-source-badge.guided{color:#7a5a12;background:#fff7dd;border-color:#f1dd97}
    .q-media{margin:12px 0 16px;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#f9fcfd}
    .q-media img{display:block;width:100%;height:auto;max-height:480px;object-fit:contain;background:white}
    .q-media-caption{padding:8px 11px;border-top:1px solid var(--line);font-size:10px;color:var(--muted);line-height:1.5;background:#fbfdfe}
    .review-source{font-size:10px;color:var(--muted);margin:0 0 10px;padding:7px 9px;background:#f5f9fb;border-radius:9px}
    @media(max-width:760px){.q-media img{max-height:390px}.q-source-row{margin-top:0}}
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
  function drawMinimax(){
    return `<text x="550" y="55" text-anchor="middle" font-size="20" font-weight="800" fill="#17365d" font-family="Noto Sans JP,sans-serif">根：自分の手番（max）</text>
      <line x1="550" y1="75" x2="300" y2="135" stroke="#9cb4bd" stroke-width="2"/><line x1="550" y1="75" x2="800" y2="135" stroke="#9cb4bd" stroke-width="2"/>
      <rect x="210" y="135" width="180" height="66" rx="12" fill="#f1f8fb" stroke="#b8d8e2"/><text x="300" y="162" text-anchor="middle" font-size="17" font-weight="800" fill="#17365d" font-family="Noto Sans JP,sans-serif">A：相手の手番</text><text x="300" y="187" text-anchor="middle" font-size="15" fill="#526579" font-family="Noto Sans JP,sans-serif">min(0, 10) = 0</text>
      <rect x="710" y="135" width="180" height="66" rx="12" fill="#f1f8fb" stroke="#b8d8e2"/><text x="800" y="162" text-anchor="middle" font-size="17" font-weight="800" fill="#17365d" font-family="Noto Sans JP,sans-serif">B：相手の手番</text><text x="800" y="187" text-anchor="middle" font-size="15" fill="#526579" font-family="Noto Sans JP,sans-serif">min(-10, 0) = -10</text>
      <text x="550" y="260" text-anchor="middle" font-size="16" fill="#2f75b5" font-weight="800" font-family="Noto Sans JP,sans-serif">葉：勝ち 10 / 負け -10 / 引分け 0</text>`;
  }
  function mediaSvg(m){
    if(!m) return "";
    const W=1100, lines=m.lines||[];
    const H=m.kind==="tree"?350:m.kind==="minimax"?320:Math.max(260,110+lines.length*42);
    let body="";
    if(m.kind==="tree") body=drawTree();
    else if(m.kind==="minimax") body=drawMinimax();
    else {
      const mono=m.kind==="code"||m.kind==="list";
      body=lines.map((line,i)=>`<text x="54" y="${112+i*42}" font-size="${mono?18:19}" fill="#243242" font-family="${mono?'Noto Sans Mono, Noto Sans JP, monospace':'Noto Sans JP, sans-serif'}">${svgText(line)}</text>`).join("");
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img"><rect width="100%" height="100%" fill="#fff"/><rect x="0" y="0" width="100%" height="68" fill="#eef7fa"/><text x="44" y="44" font-size="25" font-weight="800" fill="#17365d" font-family="Noto Sans JP,sans-serif">${svgText(m.title||"問題資料")}</text>${body}</svg>`;
  }
  function dataUri(svg){return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);}

  function enhanceQuestionCards(){
    document.querySelectorAll('.q-card[data-q]:not([data-rich-b="1"])').forEach(card=>{
      const q=byId(card.dataset.q); if(!q || q.section!=="H") return;
      card.dataset.richB="1";
      const text=card.querySelector('.q-text');
      if(!text) return;
      const row=document.createElement('div'); row.className='q-source-row';
      row.innerHTML=`<span class="q-source-badge">${esc(q.source_label||"IPA公式サンプル問題")}</span>${q.guided?'<span class="q-source-badge guided">授業で解説済み</span>':''}`;
      text.insertAdjacentElement('afterend',row);
      if(q.media){
        const wrap=document.createElement('div'); wrap.className='q-media';
        const img=document.createElement('img'); img.alt=`${q.id} 問題資料`; img.loading='lazy'; img.src=dataUri(mediaSvg(q.media));
        const cap=document.createElement('div'); cap.className='q-media-caption'; cap.textContent='擬似コード・図表を見ながら，途中の状態を紙やメモに残して解いてください。';
        wrap.append(img,cap); row.insertAdjacentElement('afterend',wrap);
      }
    });
  }
  function enhanceReviews(){
    document.querySelectorAll('.review:not([data-rich-b="1"])').forEach(d=>{
      const title=d.querySelector('.review-q')?.textContent||"";
      const id=title.split('｜')[0]; const q=byId(id); if(!q||q.section!=="H") return;
      d.dataset.richB="1";
      const body=d.querySelector('.review-body'); if(!body) return;
      const n=document.createElement('div'); n.className='review-source'; n.textContent=q.source_label||'IPA公式サンプル問題';
      body.prepend(n);
    });
  }
  function refreshHCard(){
    const card=document.querySelector('[data-section="H"]'); const h=findH(); if(!card||!h) return;
    const first=card.querySelector('.card-meta .pill'); if(first) first.textContent=`公式サンプル ${h.pool_size||h.questions.length}問からランダム8問`;
    const map=card.querySelector('.section-map'); if(map) map.textContent='科目B本番形式｜擬似コード・図表付き';
  }
  function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function armRandomH(){
    const h=findH(); if(!h) return;
    if(!h._allQuestions) h._allQuestions=[...h.questions];
    h.questions=shuffle(h._allQuestions).slice(0,8);
    setTimeout(()=>{h.questions=h._allQuestions;},0);
  }
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-section="H"]')) armRandomH();
    if(e.target.closest?.('#retryAllBtn')){
      const t=document.getElementById('resultTitle')?.textContent||"";
      if(t.trim().startsWith('H ')) armRandomH();
    }
  },true);

  const obs=new MutationObserver(()=>{enhanceQuestionCards();enhanceReviews();refreshHCard();});
  obs.observe(document.body,{childList:true,subtree:true});
  enhanceQuestionCards(); enhanceReviews(); refreshHCard();
})();
