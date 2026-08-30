(() => {
  "use strict";
  const BANK = window.FE_BANK;
  const LETTERS = "アイウエオカキク".split("");
  const STORE_KEY = "fe0831-practice-v1";
  const homeView = document.getElementById("homeView");
  const quizView = document.getElementById("quizView");
  const resultView = document.getElementById("resultView");
  const homeBtn = document.getElementById("homeBtn");
  const historyBtn = document.getElementById("historyBtn");

  const state = {
    mode: "home",
    section: null,
    questionIds: [],
    answers: {},
    startedAt: null,
    timerId: null,
    elapsed: 0,
    retryMode: false,
    lastResult: null,
  };

  let memoryStore = {attempts: [], best: {}};
  function normalizeStore(x) {
    return {
      attempts: Array.isArray(x?.attempts) ? x.attempts : [],
      best: x?.best && typeof x.best === "object" ? x.best : {},
    };
  }
  function loadStore() {
    try {
      const x = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      memoryStore = normalizeStore(x);
      return JSON.parse(JSON.stringify(memoryStore));
    } catch {
      return JSON.parse(JSON.stringify(memoryStore));
    }
  }
  function saveStore(store) {
    memoryStore = normalizeStore(store);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(memoryStore)); } catch {}
  }
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }
  function formatJapaneseTime(sec) {
    const m = Math.floor(sec/60), s = sec%60;
    return m ? `${m}分${String(s).padStart(2,"0")}秒` : `${s}秒`;
  }
  function sectionById(id) {
    return BANK.sections.find(s => s.id === id);
  }
  function questionById(section, id) {
    return section.questions.find(q => q.id === id);
  }
  function recommendedMax(section) {
    const nums = String(section.recommended_time).match(/\d+/g)?.map(Number) || [15];
    return (nums.at(-1) || 15) * 60;
  }
  function recommendedMin(section) {
    const nums = String(section.recommended_time).match(/\d+/g)?.map(Number) || [12];
    return (nums[0] || 12) * 60;
  }
  function paceLabel(section, sec) {
    const lo = recommendedMin(section), hi = recommendedMax(section);
    if (sec <= lo) return "速め";
    if (sec <= hi) return "目安内";
    return "じっくり";
  }
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 1900);
  }
  function showView(name) {
    homeView.classList.toggle("hidden", name !== "home");
    quizView.classList.toggle("hidden", name !== "quiz");
    resultView.classList.toggle("hidden", name !== "result");
    homeBtn.classList.toggle("hidden", name === "home");
    state.mode = name;
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function renderStats() {
    const store = loadStore();
    const attemptedSections = new Set(store.attempts.map(a => a.sectionId)).size;
    const totalAttempts = store.attempts.length;
    const perfect = Object.values(store.best).filter(b => b.score === b.total).length;
    const recent = store.attempts[0];
    const items = [
      ["実施分野", `${attemptedSections} / 8`, "弱点から優先してOK"],
      ["演習回数", totalAttempts, "再挑戦も含む"],
      ["満点分野", `${perfect} / 8`, "ベストスコア基準"],
      ["直近", recent ? `${recent.score}/${recent.total}` : "—", recent ? recent.sectionTitle : "まだ履歴なし"],
    ];
    document.getElementById("stats").innerHTML = items.map(([l,v,n]) => `
      <div class="stat">
        <div class="stat-label">${l}</div>
        <div class="stat-value">${v}</div>
        <div class="stat-note">${n}</div>
      </div>`).join("");
  }

  function renderSections() {
    const store = loadStore();
    const grid = document.getElementById("sectionGrid");
    grid.innerHTML = BANK.sections.map(s => {
      const best = store.best[s.id];
      const attempted = store.attempts.some(a => a.sectionId === s.id);
      const status = best?.score === 8
        ? `<span class="pill status-pill status-done">満点</span>`
        : attempted
          ? `<span class="pill status-pill status-started">実施済み</span>`
          : `<span class="pill status-pill">未実施</span>`;
      const result = best
        ? `<div class="card-result"><span>ベスト <b>${best.score}/8</b></span><span>時間 <b>${formatTime(best.elapsed)}</b></span></div>`
        : `<div class="card-result"><span>診断対応 <b>${s.diagnostic_mapping}</b></span><span>目安 <b>${s.recommended_time}</b></span></div>`;
      return `
        <button class="section-card" type="button" data-section="${s.id}">
          <div class="card-top">
            <div class="section-letter">${s.id}</div>
            <div style="flex:1;min-width:0">
              <div class="section-name">${s.title}</div>
              <div class="section-map">診断対応：${s.diagnostic_mapping}</div>
            </div>
            ${status}
          </div>
          <div class="card-meta">
            <span class="pill">8問</span>
            <span class="pill">目安 ${s.recommended_time}</span>
            <span class="pill">採点後に詳細解説</span>
          </div>
          ${result}
        </button>`;
    }).join("");
    grid.querySelectorAll("[data-section]").forEach(btn => {
      btn.addEventListener("click", () => beginSection(btn.dataset.section));
    });
  }

  function renderHome() {
    stopTimer();
    renderStats();
    renderSections();
    showView("home");
  }

  function beginSection(sectionId, questionIds=null, retryMode=false) {
    const section = sectionById(sectionId);
    if (!section) return;
    stopTimer();
    state.section = section;
    state.questionIds = questionIds || section.questions.map(q => q.id);
    state.answers = {};
    state.elapsed = 0;
    state.startedAt = Date.now();
    state.retryMode = retryMode;

    document.getElementById("quizLetter").textContent = section.id;
    document.getElementById("quizTitle").textContent = section.title;
    document.getElementById("quizSubtitle").textContent =
      `${retryMode ? "誤答再挑戦" : "通常演習"}｜${state.questionIds.length}問｜診断対応 ${section.diagnostic_mapping}`;
    document.getElementById("targetTime").textContent =
      retryMode ? "誤答だけを再確認" : `目安 ${section.recommended_time}`;
    renderQuestions();
    updateProgress();
    startTimer();
    showView("quiz");
  }

  function renderQuestions() {
    const list = document.getElementById("questionList");
    const section = state.section;
    list.innerHTML = state.questionIds.map((id, i) => {
      const q = questionById(section, id);
      return `
      <article class="q-card" data-q="${q.id}">
        <div class="q-top">
          <div class="q-id">Q${i+1}｜${q.id}</div>
          <div class="q-state" id="state-${q.id}">未回答</div>
        </div>
        <div class="q-text">${escapeHtml(q.question)}</div>
        <div class="options">
          ${q.options.map((opt, oi) => `
            <label class="option">
              <input type="radio" name="${q.id}" value="${LETTERS[oi]}">
              <span class="opt-letter">${LETTERS[oi]}</span>
              <span class="opt-text">${escapeHtml(opt)}</span>
            </label>`).join("")}
        </div>
      </article>`;
    }).join("");
    list.querySelectorAll("input[type=radio]").forEach(input => {
      input.addEventListener("change", e => {
        state.answers[e.target.name] = e.target.value;
        const st = document.getElementById(`state-${e.target.name}`);
        if (st) { st.textContent = "回答済み"; st.style.color = "var(--blue)"; }
        updateProgress();
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
  }

  function updateProgress() {
    const answered = state.questionIds.filter(id => state.answers[id]).length;
    const total = state.questionIds.length;
    document.getElementById("answeredCount").textContent = `${answered} / ${total} 回答`;
    document.getElementById("progressBar").style.width = `${(answered/total)*100}%`;
    document.getElementById("submitQuizBtn").disabled = answered !== total;
  }

  function startTimer() {
    const update = () => {
      state.elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
      const timer = document.getElementById("timer");
      timer.textContent = formatTime(state.elapsed);
      if (!state.retryMode && state.section) {
        const lo = recommendedMin(state.section), hi = recommendedMax(state.section);
        timer.style.color = state.elapsed > hi ? "var(--red)" : state.elapsed > lo ? "var(--amber)" : "var(--navy)";
      } else {
        timer.style.color = "var(--navy)";
      }
    };
    update();
    state.timerId = setInterval(update, 1000);
  }
  function stopTimer() {
    if (state.timerId) clearInterval(state.timerId);
    state.timerId = null;
  }

  function submitQuiz() {
    stopTimer();
    const section = state.section;
    const results = state.questionIds.map(id => {
      const q = questionById(section, id);
      const selected = state.answers[id];
      return {id, selected, correct: selected === q.answer};
    });
    const score = results.filter(r => r.correct).length;
    const total = results.length;
    const wrongIds = results.filter(r => !r.correct).map(r => r.id);
    const attempt = {
      timestamp: new Date().toISOString(),
      sectionId: section.id,
      sectionTitle: section.title,
      score, total,
      elapsed: state.elapsed,
      retryMode: state.retryMode,
      questionIds: [...state.questionIds],
      wrongIds,
    };
    saveAttempt(attempt);
    state.lastResult = {attempt, results, answers:{...state.answers}};
    renderResult();
    showView("result");
  }

  function saveAttempt(attempt) {
    const store = loadStore();
    store.attempts.unshift(attempt);
    store.attempts = store.attempts.slice(0, 80);
    if (!attempt.retryMode || attempt.total === 8) {
      const b = store.best[attempt.sectionId];
      if (!b || attempt.score > b.score || (attempt.score === b.score && attempt.elapsed < b.elapsed)) {
        store.best[attempt.sectionId] = {
          score: attempt.score, total: attempt.total, elapsed: attempt.elapsed, timestamp: attempt.timestamp
        };
      }
    }
    saveStore(store);
  }

  function renderResult() {
    const {attempt, results, answers} = state.lastResult;
    const section = sectionById(attempt.sectionId);
    const pct = Math.round(attempt.score/attempt.total*100);
    document.getElementById("scoreCircle").style.setProperty("--score-angle", `${pct*3.6}deg`);
    document.getElementById("scoreMain").textContent = `${attempt.score}/${attempt.total}`;
    document.getElementById("scorePercent").textContent = `${pct}%`;
    document.getElementById("resultTitle").textContent =
      `${section.id} ${section.title}${attempt.retryMode ? "｜誤答再挑戦" : ""}`;
    const msg = pct === 100 ? "全問正解です。別の弱点へ進めます。"
      : pct >= 75 ? "概ね理解できています。誤答だけ確認してから次へ進みましょう。"
      : pct >= 50 ? "解説を確認し、誤答だけ再挑戦すると効果的です。"
      : "この分野は重点復習候補です。解説を読んでから同じ分野をもう一度解きましょう。";
    document.getElementById("resultSummary").textContent = msg;
    const pace = paceLabel(section, attempt.elapsed);
    document.getElementById("resultKpis").innerHTML = `
      <span class="kpi">所要時間 <b>${formatJapaneseTime(attempt.elapsed)}</b></span>
      <span class="kpi">正答率 <b>${pct}%</b></span>
      <span class="kpi">時間感覚 <b>${pace}</b></span>
      <span class="kpi">誤答 <b>${attempt.wrongIds.length}問</b></span>`;
    document.getElementById("retryWrongBtn").classList.toggle("hidden", attempt.wrongIds.length === 0);
    document.getElementById("reviewList").innerHTML = results.map(r => reviewHtml(section, r, answers[r.id])).join("");
  }

  function reviewHtml(section, r, selected) {
    const q = questionById(section, r.id);
    const selectedIdx = LETTERS.indexOf(selected);
    const correctIdx = LETTERS.indexOf(q.answer);
    const opts = q.options.map((opt, i) => {
      const isCorrect = i === correctIdx;
      const chosenWrong = i === selectedIdx && !isCorrect;
      return `<div class="opt-exp ${isCorrect ? "correct" : ""} ${chosenWrong ? "chosen-wrong" : ""}">
        <b>${LETTERS[i]}．${escapeHtml(opt)}</b><br>${escapeHtml(q.option_explanations[i])}
      </div>`;
    }).join("");
    return `<details class="review ${r.correct ? "ok" : "ng"}" ${r.correct ? "" : "open"}>
      <summary>
        <span class="review-badge">${r.correct ? "✓" : "×"}</span>
        <span class="review-q">${q.id}｜${escapeHtml(q.question)}</span>
      </summary>
      <div class="review-body">
        <div class="answer-lines">
          <div class="answer-line"><label>あなたの回答</label><b>${selected}．${escapeHtml(q.options[selectedIdx])}</b></div>
          <div class="answer-line"><label>正解</label><b>${q.answer}．${escapeHtml(q.correct_option)}</b></div>
        </div>
        <div class="explain"><b>考え方：</b>${escapeHtml(q.brief)}</div>
        <div class="opt-explain-list">${opts}</div>
      </div>
    </details>`;
  }

  async function copyResult() {
    const {attempt} = state.lastResult;
    const section = sectionById(attempt.sectionId);
    const wrong = attempt.wrongIds.length ? attempt.wrongIds.join(",") : "なし";
    const text = `${section.id} ${section.title}｜${attempt.score}/${attempt.total}問｜${formatJapaneseTime(attempt.elapsed)}｜正答率${Math.round(attempt.score/attempt.total*100)}%｜誤答 ${wrong}`;
    try {
      await navigator.clipboard.writeText(text);
      toast("結果をコピーしました");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
      toast("結果をコピーしました");
    }
  }

  function showHistory() {
    const store = loadStore();
    const modalRoot = document.getElementById("modalRoot");
    const rows = store.attempts.length ? store.attempts.map(a => `
      <div class="history-item">
        <div>
          <div class="history-title">${a.sectionId} ${escapeHtml(a.sectionTitle)}${a.retryMode ? "｜誤答再挑戦" : ""}</div>
          <div class="history-sub">${new Date(a.timestamp).toLocaleString("ja-JP")}</div>
        </div>
        <div class="history-score">${a.score}/${a.total}</div>
        <div class="history-time">${formatTime(a.elapsed)}</div>
      </div>`).join("") : `<div class="empty">まだ演習履歴がありません。</div>`;
    modalRoot.innerHTML = `
      <div class="modal-backdrop" id="historyBackdrop">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-head">
            <h3>演習履歴</h3>
            <button class="close-btn" id="closeHistory" type="button">×</button>
          </div>
          <div class="history-list">${rows}</div>
          ${store.attempts.length ? `<div style="display:flex;justify-content:flex-end;margin-top:16px"><button class="btn btn-danger" id="clearHistory" type="button">履歴を削除</button></div>` : ""}
        </div>
      </div>`;
    document.getElementById("closeHistory").onclick = () => modalRoot.innerHTML = "";
    document.getElementById("historyBackdrop").onclick = e => { if (e.target.id === "historyBackdrop") modalRoot.innerHTML = ""; };
    const clear = document.getElementById("clearHistory");
    if (clear) clear.onclick = () => {
      if (confirm("このブラウザに保存された演習履歴を削除しますか？")) {
        try { localStorage.removeItem(STORE_KEY); } catch {}
        memoryStore = {attempts: [], best: {}};
        modalRoot.innerHTML = "";
        renderHome();
        toast("履歴を削除しました");
      }
    };
  }

  document.getElementById("quizForm").addEventListener("submit", e => {
    e.preventDefault();
    submitQuiz();
  });
  document.getElementById("cancelQuizBtn").addEventListener("click", () => {
    if (Object.keys(state.answers).length && !confirm("このセットの回答途中です。分野一覧へ戻りますか？")) return;
    renderHome();
  });
  document.getElementById("retryWrongBtn").addEventListener("click", () => {
    const a = state.lastResult.attempt;
    beginSection(a.sectionId, a.wrongIds, true);
  });
  document.getElementById("retryAllBtn").addEventListener("click", () => beginSection(state.lastResult.attempt.sectionId));
  document.getElementById("copyResultBtn").addEventListener("click", copyResult);
  document.getElementById("nextSectionBtn").addEventListener("click", renderHome);
  document.getElementById("resultHomeBtn").addEventListener("click", renderHome);
  homeBtn.addEventListener("click", () => {
    if (state.mode === "quiz" && Object.keys(state.answers).length && !confirm("回答途中です。分野一覧へ戻りますか？")) return;
    renderHome();
  });
  historyBtn.addEventListener("click", showHistory);

  window.addEventListener("beforeunload", e => {
    if (state.mode === "quiz" && Object.keys(state.answers).length) {
      e.preventDefault(); e.returnValue = "";
    }
  });

  renderHome();
})();