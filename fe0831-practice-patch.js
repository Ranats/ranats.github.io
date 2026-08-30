(() => {
  "use strict";
  const STORE_KEY = "fe0831-practice-v1";
  const LETTERS = "アイウエオカキク".split("");
  let historyMode = null;

  const style = document.createElement("style");
  style.textContent = `
    .brand{cursor:pointer;border-radius:12px;padding:2px 5px 2px 2px;transition:.15s}
    .brand:hover{background:rgba(47,117,181,.06)}
    .brand:focus-visible{outline:3px solid rgba(47,117,181,.35);outline-offset:2px}
    .history-item{cursor:pointer;transition:.14s}
    .history-item:hover{background:#f7fbfe;border-color:#b9cfdf;transform:translateY(-1px)}
    .history-item::after{content:"結果を開く";font-size:10px;color:#2f75b5;font-weight:700;grid-column:1/4;margin-top:-5px}
    .history-view-note{display:inline-flex;margin:0 0 10px;padding:5px 9px;border-radius:999px;background:#eef5fa;color:#2f75b5;font-size:11px;font-weight:800}
  `;
  document.head.appendChild(style);

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
    catch { return {}; }
  }
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }
  function sectionById(id) { return window.FE_BANK?.sections?.find(s => s.id === id); }
  function questionById(section,id) { return section?.questions?.find(q => q.id === id); }
  function formatJapaneseTime(sec) {
    sec=Number(sec||0); const m=Math.floor(sec/60),s=sec%60;
    return m ? `${m}分${String(s).padStart(2,"0")}秒` : `${s}秒`;
  }
  function paceLabel(section,sec) {
    const nums=String(section?.recommended_time||"").match(/\d+/g)?.map(Number)||[12,15];
    const lo=(nums[0]||12)*60, hi=(nums.at(-1)||15)*60;
    return sec<=lo?"速め":sec<=hi?"目安内":"じっくり";
  }
  function goHome() {
    historyMode=null;
    restoreResultActions();
    document.getElementById("homeBtn")?.click();
  }

  const brand = document.querySelector(".brand");
  if (brand) {
    brand.setAttribute("role","button");
    brand.setAttribute("tabindex","0");
    brand.setAttribute("aria-label","分野一覧へ戻る");
    brand.addEventListener("click", goHome);
    brand.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goHome(); }
    });
  }

  try {
    const nativeSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key,value) {
      if (this === localStorage && key === STORE_KEY) {
        try {
          const data=JSON.parse(value);
          const latest=data?.attempts?.[0];
          if (latest && !latest.answers) {
            const answers={};
            document.querySelectorAll('#quizForm input[type="radio"]:checked').forEach(el => { answers[el.name]=el.value; });
            if (Object.keys(answers).length) latest.answers=answers;
            value=JSON.stringify(data);
          }
        } catch {}
      }
      return nativeSetItem.call(this,key,value);
    };
  } catch {}

  function reviewHtml(section,id,selected,correct) {
    const q=questionById(section,id); if(!q) return "";
    const si=selected?LETTERS.indexOf(selected):-1, ci=LETTERS.indexOf(q.answer);
    const opts=q.options.map((opt,i)=>{
      const isCorrect=i===ci, chosenWrong=i===si&&!isCorrect;
      return `<div class="opt-exp ${isCorrect?"correct":""} ${chosenWrong?"chosen-wrong":""}"><b>${LETTERS[i]}．${esc(opt)}</b><br>${esc(q.option_explanations[i])}</div>`;
    }).join("");
    return `<details class="review ${correct?"ok":"ng"}" ${correct?"":"open"}>
      <summary><span class="review-badge">${correct?"✓":"×"}</span><span class="review-q">${esc(q.id)}｜${esc(q.question)}</span></summary>
      <div class="review-body"><div class="answer-lines">
        <div class="answer-line"><label>あなたの回答</label><b>${si>=0?`${selected}．${esc(q.options[si])}`:"旧履歴のため選択肢記録なし"}</b></div>
        <div class="answer-line"><label>正解</label><b>${q.answer}．${esc(q.correct_option)}</b></div>
      </div><div class="explain"><b>考え方：</b>${esc(q.brief)}</div><div class="opt-explain-list">${opts}</div></div>
    </details>`;
  }

  function showHistoryResult(attempt) {
    const section=sectionById(attempt.sectionId); if(!section) return;
    const ids=Array.isArray(attempt.questionIds)&&attempt.questionIds.length?attempt.questionIds:section.questions.map(q=>q.id);
    const wrong=new Set(attempt.wrongIds||[]);
    const pct=Math.round((attempt.score/attempt.total)*100);
    historyMode={attempt,section};

    document.getElementById("modalRoot").innerHTML="";
    document.getElementById("homeView")?.classList.add("hidden");
    document.getElementById("quizView")?.classList.add("hidden");
    document.getElementById("resultView")?.classList.remove("hidden");
    document.getElementById("homeBtn")?.classList.remove("hidden");

    const title=document.getElementById("resultTitle");
    if(title) title.innerHTML=`<span class="history-view-note">履歴から表示</span><br>${esc(section.id)} ${esc(section.title)}${attempt.retryMode?"｜誤答再挑戦":""}`;
    const summary=document.getElementById("resultSummary");
    if(summary) summary.textContent=`${new Date(attempt.timestamp).toLocaleString("ja-JP")} に実施した結果です。`;
    document.getElementById("scoreCircle")?.style.setProperty("--score-angle",`${pct*3.6}deg`);
    if(document.getElementById("scoreMain")) document.getElementById("scoreMain").textContent=`${attempt.score}/${attempt.total}`;
    if(document.getElementById("scorePercent")) document.getElementById("scorePercent").textContent=`${pct}%`;
    const kpis=document.getElementById("resultKpis");
    if(kpis) kpis.innerHTML=`<span class="kpi">所要時間 <b>${formatJapaneseTime(attempt.elapsed)}</b></span><span class="kpi">正答率 <b>${pct}%</b></span><span class="kpi">時間感覚 <b>${paceLabel(section,attempt.elapsed)}</b></span><span class="kpi">誤答 <b>${(attempt.wrongIds||[]).length}問</b></span>`;
    const reviews=document.getElementById("reviewList");
    if(reviews) reviews.innerHTML=ids.map(id=>{
      const selected=attempt.answers?.[id] || (wrong.has(id)?null:questionById(section,id)?.answer);
      return reviewHtml(section,id,selected,!wrong.has(id));
    }).join("");

    const retryWrong=document.getElementById("retryWrongBtn"); if(retryWrong) retryWrong.style.display="none";
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function restoreResultActions() {
    const rw=document.getElementById("retryWrongBtn"); if(rw) rw.style.display="";
  }

  document.addEventListener("click", e => {
    const item=e.target.closest?.(".history-item");
    if (item && item.closest("#historyBackdrop")) {
      const items=[...item.parentElement.querySelectorAll(".history-item")];
      const index=items.indexOf(item);
      const attempt=readStore()?.attempts?.[index];
      if(attempt){ e.preventDefault(); e.stopImmediatePropagation(); showHistoryResult(attempt); }
      return;
    }

    if (!historyMode) return;
    if (e.target.closest?.("#retryAllBtn")) {
      e.preventDefault(); e.stopImmediatePropagation();
      const sid=historyMode.attempt.sectionId; historyMode=null; restoreResultActions();
      document.getElementById("homeBtn")?.click();
      setTimeout(()=>document.querySelector(`[data-section="${sid}"]`)?.click(),0);
    } else if (e.target.closest?.("#copyResultBtn")) {
      e.preventDefault(); e.stopImmediatePropagation();
      const a=historyMode.attempt,s=historyMode.section,wrong=(a.wrongIds||[]).length?(a.wrongIds||[]).join(","):"なし";
      const text=`${s.id} ${s.title}｜${a.score}/${a.total}問｜${formatJapaneseTime(a.elapsed)}｜正答率${Math.round(a.score/a.total*100)}%｜誤答 ${wrong}`;
      navigator.clipboard?.writeText(text).catch(()=>{});
    } else if (e.target.closest?.("#nextSectionBtn") || e.target.closest?.("#resultHomeBtn")) {
      historyMode=null; restoreResultActions();
    }
  }, true);
})();
