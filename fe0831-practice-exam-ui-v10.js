(() => {
  "use strict";
  const STORE_KEY="fe0831-practice-v1";
  const bank=window.FE_BANK;
  const examIds=new Set(["J","K"]);
  const style=document.createElement("style");
  style.textContent=`
    .section-card[data-section="J"],.section-card[data-section="K"]{border:2px solid #78a9bd;background:linear-gradient(180deg,#fbfeff,#f2f8fb)}
    .section-card[data-section="J"] .section-letter,.section-card[data-section="K"] .section-letter{background:#17365d;color:#fff}
    .exam-pill{background:#17365d!important;color:#fff!important;border-color:#17365d!important}
    .exam-note{margin:0 0 18px;padding:12px 14px;border:1px solid #d5b65e;border-radius:12px;background:#fff9e8;color:#674d08;font-size:12px;line-height:1.7;font-weight:700}
    .exam-source{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:-2px 0 12px}
    .exam-source span{font-size:10px;font-weight:800;color:#17677e;background:#eaf6f9;border:1px solid #cde8ee;border-radius:999px;padding:5px 8px}
    .exam-media{margin:12px 0 16px;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff}
    .exam-media img{display:block;width:100%;height:auto;max-height:480px;object-fit:contain;background:#fff}
    .exam-media-cap{padding:8px 11px;border-top:1px solid var(--line);font-size:10px;color:var(--muted);line-height:1.5;background:#fbfdfe}
    .q-card{content-visibility:auto;contain-intrinsic-size:auto 420px}
    @media(max-width:760px){.exam-media img{max-height:390px}}
  `;
  document.head.appendChild(style);

  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  function readStore(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"{}")}catch{return {}}}
  function section(id){return bank?.sections?.find(s=>s.id===id)}
  function byQuestionId(id){
    for(const s of bank?.sections||[]){const q=s.questions?.find(q=>q.id===id);if(q)return q;}
    return null;
  }
  function originalKQuestion(id){
    const q=byQuestionId(id); if(q?.section==="K") return q;
    const k=section("K"); return k?.questions?.find(q=>q.id===id);
  }
  function svgText(s){return esc(s).replace(/\u2190/g,"←").replace(/\u2192/g,"→");}
  function treeBody(){
    const pos={1:[550,55],2:[320,125],3:[780,125],4:[170,205],5:[390,205],6:[670,205],7:[890,205],8:[100,285],9:[220,285],10:[330,285],11:[450,285],12:[610,285],13:[730,285],14:[870,285]};
    const edges=[[1,2],[1,3],[2,4],[2,5],[3,6],[3,7],[4,8],[4,9],[5,10],[5,11],[6,12],[6,13],[7,14]];
    let s=edges.map(([a,b])=>`<line x1="${pos[a][0]}" y1="${pos[a][1]+20}" x2="${pos[b][0]}" y2="${pos[b][1]-20}" stroke="#9cb4bd" stroke-width="2"/>`).join("");
    s+=Object.entries(pos).map(([v,p])=>`<circle cx="${p[0]}" cy="${p[1]}" r="20" fill="#eef8fa" stroke="#2a91ad" stroke-width="2"/><text x="${p[0]}" y="${p[1]+6}" text-anchor="middle" font-size="17" font-weight="700" fill="#19354c" font-family="Noto Sans JP,sans-serif">${v}</text>`).join("");
    return s;
  }
  function mediaSvg(m){
    if(!m)return"";
    const W=1100,lines=m.lines||[];
    const H=m.kind==="tree"?350:Math.max(250,110+lines.length*42);
    let body="";
    if(m.kind==="tree")body=treeBody();
    else body=lines.map((line,i)=>`<text x="54" y="${112+i*42}" font-size="18" fill="#243242" font-family="${m.kind==='code'||m.kind==='list'?'Noto Sans Mono,Noto Sans JP,monospace':'Noto Sans JP,sans-serif'}">${svgText(line)}</text>`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#fff"/><rect width="100%" height="68" fill="#eef7fa"/><text x="44" y="44" font-size="25" font-weight="800" fill="#17365d" font-family="Noto Sans JP,sans-serif">${svgText(m.title||'問題資料')}</text>${body}</svg>`;
  }
  const mediaCache=new WeakMap();
  function dataUriFor(m){
    if(!m)return"";
    if(mediaCache.has(m))return mediaCache.get(m);
    const uri="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(mediaSvg(m));
    mediaCache.set(m,uri);
    return uri;
  }

  function setText(el,text){if(el&&el.textContent!==String(text))el.textContent=String(text)}
  function fixStats(){
    const stats=[...document.querySelectorAll("#stats .stat")];
    if(stats[0]){
      const n=bank?.sections?.length||11;
      const store=readStore(); const attempted=new Set((store.attempts||[]).map(a=>a.sectionId)).size;
      setText(stats[0].querySelector('.stat-label'),'実施セット');
      setText(stats[0].querySelector('.stat-value'),`${attempted} / ${n}`);
    }
    if(stats[2])setText(stats[2].querySelector('.stat-label'),'満点セット');
  }
  function fixExamCards(){
    const store=readStore();
    for(const id of examIds){
      const s=section(id),card=document.querySelector(`[data-section="${id}"]`); if(!s||!card)continue;
      const pills=card.querySelectorAll('.card-meta .pill');
      if(pills[0])setText(pills[0],`${s.display_count}問`);
      if(pills[1])setText(pills[1],`本番時間 ${s.recommended_time}`);
      if(pills[2]){setText(pills[2],'本番想定');pills[2].classList.add('exam-pill');}
      const map=card.querySelector('.section-map'); if(map)setText(map,s.exam_subject==='A'?'90分・60問｜科目A 全分野':'100分・20問｜科目B 全分野');
      const best=store.best?.[id];
      const status=card.querySelector('.status-pill');
      if(status&&best){
        setText(status,best.score===best.total?'満点':'実施済み');
        status.classList.toggle('status-done',best.score===best.total);
        status.classList.toggle('status-started',best.score!==best.total);
      }
      const result=card.querySelector('.card-result');
      if(result&&best){
        const html=`<span>ベスト <b>${best.score}/${best.total}</b></span><span>時間 <b>${Math.floor(best.elapsed/60)}:${String(best.elapsed%60).padStart(2,'0')}</b></span>`;
        if(result.innerHTML!==html)result.innerHTML=html;
      }
    }
  }
  function addExamNotice(){
    const title=document.getElementById('quizTitle')?.textContent||'';
    const isExam=title.includes('科目A総合')||title.includes('科目B総合');
    const old=document.getElementById('examNotice');
    if(!isExam){old?.remove();return;}
    const header=document.querySelector('#quizView .quiz-header');
    if(header&&!old){
      const n=document.createElement('div');n.id='examNotice';n.className='exam-note';
      n.textContent='本番想定モード：採点するまで正解は表示しません。本試験はIRTに基づく評価点方式のため、このアプリの正答数・正答率は学習用の参考値です。';
      header.insertAdjacentElement('afterend',n);
    }
  }
  function addResultNotice(){
    const title=document.getElementById('resultTitle')?.textContent||'';
    const isExam=/^[JK] /.test(title.trim());
    const hero=document.querySelector('#resultView .result-hero');
    const old=document.getElementById('examResultNotice');
    if(!isExam){old?.remove();return;}
    if(hero&&!old){
      const n=document.createElement('div');n.id='examResultNotice';n.className='exam-note';
      n.textContent='この結果は正答数・正答率による学習用の参考値です。本試験の600/1000という評価点を直接換算したものではありません。誤答分野を確認し、分野別演習へ戻って復習してください。';
      hero.insertAdjacentElement('afterend',n);
    }
  }
  function enrichK(){
    document.querySelectorAll('#quizView .q-card[data-q^="K-"]:not([data-exam-rich="1"])').forEach(card=>{
      const q=originalKQuestion(card.dataset.q); if(!q)return;
      card.dataset.examRich='1';
      const text=card.querySelector('.q-text');if(!text)return;
      const row=document.createElement('div');row.className='exam-source';row.innerHTML=`<span>${esc(q.source_label||'科目B 本番想定')}</span>`;text.insertAdjacentElement('afterend',row);
      if(q.media){
        const wrap=document.createElement('div');wrap.className='exam-media';
        const img=document.createElement('img');img.alt='擬似コード・図表';img.loading='lazy';img.decoding='async';img.src=dataUriFor(q.media);
        const cap=document.createElement('div');cap.className='exam-media-cap';cap.textContent='本番を想定し、擬似コード・図表の必要な部分だけを追ってください。';
        wrap.append(img,cap);row.insertAdjacentElement('afterend',wrap);
      }
    });
  }
  function cleanNotice(){if(!document.querySelector('#quizView:not(.hidden)'))document.getElementById('examNotice')?.remove();}

  let refreshing=false;
  let scheduled=false;
  function refresh(){
    if(refreshing)return;
    refreshing=true;
    try{fixStats();fixExamCards();addExamNotice();addResultNotice();enrichK();cleanNotice();}
    finally{refreshing=false;}
  }
  function scheduleRefresh(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;refresh();});
  }
  const obs=new MutationObserver(mutations=>{
    if(refreshing)return;
    const relevant=mutations.some(m=>m.addedNodes.length||m.removedNodes.length);
    if(relevant)scheduleRefresh();
  });
  obs.observe(document.body,{childList:true,subtree:true});
  refresh();
})();
