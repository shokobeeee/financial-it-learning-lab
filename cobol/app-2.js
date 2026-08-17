function createRuntime(lab){
  return {
    lab,
    state: JSON.parse(JSON.stringify(lab.initial)),
    before: JSON.parse(JSON.stringify(lab.initial)),
    done: new Set(),
    mission:0,
    mode:"basic",
    maxFlow:-1,
    lastAction:null
  };
}
function renderLab(lab){
  renderTopNav(lab);
  runtime=createRuntime(lab);
  document.getElementById("app").innerHTML=`
    <section class="card lab-hero">
      <div class="lab-number">LAB ${String(lab.id).padStart(2,"0")} / ${esc(lab.group)}</div>
      <h1 style="font-size:clamp(28px,4vw,44px)">${esc(lab.title)}</h1>
      <p class="muted">${esc(lab.subtitle)}</p>
      <div class="goalbox"><strong>🎯 このLabのゴール</strong><div>${esc(lab.goal)}</div></div>
      <div class="chips">${lab.scope.map(s=>`<span class="chip">📍 ${esc(s)}</span>`).join("")}</div>
      <div class="process" id="processFlow">${lab.flow.map((s,i)=>`<div class="step" data-flow="${i}">${esc(s)}</div>`).join("")}</div>
    </section>

    <section class="dashboard">
      <div class="card">
        <h2>いまの状態</h2>
        <div class="status-grid" id="statusGrid"></div>
      </div>
      <div class="card">
        <h2>状態DIFF — 何が変わった？</h2>
        <div class="diff" id="stateDiff"><div class="muted">まだ状態変更はありません。</div></div>
      </div>
    </section>

    <section class="card workspace">
      <h2>操作してみる</h2>
      <div class="modebar">
        <button class="mode active" data-mode="basic">基本</button>
        <button class="mode" data-mode="select">選択</button>
        <button class="mode" data-mode="input">入力</button>
      </div>
      <p class="mode-note" id="modeNote">基本：ボタンを押して「何が起きるか」をまず観察します。</p>

      <div class="workgrid">
        <aside class="pane">
          <div class="pane-title" id="controlTitle">操作</div>
          <div id="controlArea"></div>
        </aside>
        <section class="pane">
          <div class="pane-title">COBOL / Job Console</div>
          <div class="terminal" id="terminalArea">ready&gt; Lab ${String(lab.id).padStart(2,"0")}\n基本モードから触ってみよう。</div>
        </section>
        <section class="pane">
          <div class="pane-title">この1行を分解</div>
          <div id="breakdownArea" class="muted">まだコードを実行していません。</div>
        </section>
      </div>

      <div class="lesson card" style="background:#0d1727;margin-top:12px">
        <div class="lesson-badge">💡 ここがポイント</div>
        <div id="lessonText">操作すると、コードの意味と業務上の位置づけをここに表示します。</div>
      </div>
    </section>

    <section class="card quiz">
      <h2>理解チェック</h2>
      <div>${esc(lab.quiz.q)}</div>
      <div class="quiz-options" id="quizOptions">
        ${lab.quiz.options.map((o,i)=>`<button class="quizopt" data-quiz="${i}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join("")}
      </div>
      <div class="quiz-result" id="quizResult"></div>
    </section>

    <details class="card trylocal">
      <summary>🧪 実際のLinuxでCOBOLを動かすときの基本形</summary>
      <p class="muted">この教材はブラウザ内シミュレーターです。GnuCOBOL環境では、たとえば free format のソースを次のように実行形式へできます。</p>
      <pre>cobc -x -free hello.cob -o hello
./hello</pre>
      <p class="muted">最初はLab01〜06の小さなコードをローカルで動かし、ファイル/JCL/DB2/CICSは教材上で概念を分けて学ぶのがおすすめです。</p>
    </details>

    <div class="references">
      参照：IBM Enterprise COBOL for z/OS 6.4（program structure / DATA DIVISION / PROCEDURE DIVISION / file processing / SORT 等）および GnuCOBOL Manual。<br>
      この教材の目的は、製品固有運用を丸暗記することではなく、コード・データ・実行基盤の境界を理解することです。
    </div>
  `;
  wireLab();
  updateStatus();
  renderControls();
  updateFlow();
}
function wireLab(){
  document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>{
    runtime.mode=b.dataset.mode;
    document.querySelectorAll(".mode").forEach(x=>x.classList.toggle("active",x===b));
    renderControls();
  }));
  document.querySelectorAll("[data-quiz]").forEach(b=>b.addEventListener("click",()=>answerQuiz(Number(b.dataset.quiz),b)));
}
function updateStatus(){
  const g=document.getElementById("statusGrid"); if(!g)return;
  g.innerHTML=Object.entries(runtime.state).map(([k,v])=>`<div class="status-item"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join("");
}
function updateDiff(prev,next){
  const d=document.getElementById("stateDiff");
  const changed=[];
  Object.keys(next).forEach(k=>{if(String(prev[k])!==String(next[k])) changed.push([k,prev[k],next[k]])});
  d.innerHTML=changed.length?changed.map(x=>`<div class="diff-row"><b>${esc(x[0])}</b><br>${esc(x[1])} → <strong>${esc(x[2])}</strong></div>`).join(""):'<div class="muted">この操作では状態値の変更はありません。</div>';
}
function updateFlow(){
  document.querySelectorAll("[data-flow]").forEach(el=>{
    const i=Number(el.dataset.flow);
    el.classList.toggle("done",i<runtime.maxFlow);
    el.classList.toggle("active",i===runtime.maxFlow);
  });
}
function firstUndone(){
  for(let i=0;i<runtime.lab.actions.length;i++) if(!runtime.done.has(i)) return i;
  return runtime.lab.actions.length-1;
}
function renderControls(){
  const area=document.getElementById("controlArea"), note=document.getElementById("modeNote"), title=document.getElementById("controlTitle");
  const lab=runtime.lab;
  if(runtime.mode==="basic"){
    title.textContent="操作";
    note.textContent="基本：ボタンを押して「何が起きるか」をまず観察します。順番どおりに押すのがおすすめ。";
    area.innerHTML=`<div class="action-list">${lab.actions.map((a,i)=>`<button class="action ${runtime.done.has(i)?"done-action":""}" data-action="${i}"><span class="action-index">${i+1}</span>${esc(a.label)}</button>`).join("")}</div>
      <button class="chipbtn" id="resetBtn" style="width:100%;margin-top:9px;text-align:center">↻ 最初から</button>`;
    area.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>executeAction(Number(b.dataset.action))));
    document.getElementById("resetBtn").addEventListener("click",()=>resetRuntime());
  } else {
    runtime.mission=firstUndone();
    const a=lab.actions[runtime.mission];
    title.textContent=runtime.mode==="select"?"正しいコードを選ぶ":"コードを入力する";
    note.textContent=runtime.mode==="select"
      ?"選択：ミッションに対して正しいCOBOL/JCL構文を選びます。"
      :"入力：自分で構文を書きます。大文字小文字・空白・末尾ピリオドの差はある程度吸収します。";
    if(runtime.done.size===lab.actions.length){
      area.innerHTML=`<div class="mission"><div class="small">COMPLETE</div><strong>このLabの3ミッションは完了済み 🎉</strong></div><button class="chipbtn" id="resetBtn" style="width:100%">↻ もう一度</button>`;
      document.getElementById("resetBtn").addEventListener("click",()=>resetRuntime());
      return;
    }
    if(runtime.mode==="select"){
      const shuffled=a.choices.map((c,i)=>({c,i})).sort(()=>Math.random()-.5);
      area.innerHTML=`<div class="mission"><div class="small">MISSION ${runtime.mission+1} / 3</div><strong>${esc(a.prompt)}</strong></div>
        <div class="choice-list">${shuffled.map(x=>`<button class="choice" data-choice="${x.i}">${esc(x.c)}</button>`).join("")}</div>
        <div class="feedback" id="feedback"></div>`;
      area.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>checkChoice(b,Number(b.dataset.choice))));
    }else{
      area.innerHTML=`<div class="mission"><div class="small">MISSION ${runtime.mission+1} / 3</div><strong>${esc(a.prompt)}</strong></div>
        <textarea class="codeinput" id="codeInput" spellcheck="false" placeholder="ここにCOBOL/JCLを入力"></textarea>
        <button class="runbtn" id="runInput">▶ 実行</button>
        <div class="feedback" id="feedback"></div>`;
      document.getElementById("runInput").addEventListener("click",checkInput);
    }
  }
}
function normalizeCode(s){
  return String(s)
    .replace(/\r/g,"")
    .trim()
    .toUpperCase()
    .replace(/[ \t]+/g," ")
    .replace(/ *\n */g,"\n")
    .replace(/\.\s*$/,'')
    .replace(/\s+/g," ");
}
function checkChoice(btn,idx){
  const a=runtime.lab.actions[runtime.mission], f=document.getElementById("feedback");
  if(idx===0){
    btn.classList.add("good"); f.className="feedback ok"; f.textContent="✅ 正解。実行します。";
    setTimeout(()=>executeAction(runtime.mission),180);
  }else{
    btn.classList.add("bad"); f.className="feedback ng"; f.textContent="惜しい。送り元/受け取り先、DIVISION、終端語をもう一度見てみよう。";
  }
}
function checkInput(){
  const a=runtime.lab.actions[runtime.mission], raw=document.getElementById("codeInput").value, f=document.getElementById("feedback");
  const ok=normalizeCode(raw)===normalizeCode(a.statement);
  if(ok){
    f.className="feedback ok";f.textContent="✅ 正解。実行します。";
    setTimeout(()=>executeAction(runtime.mission),180);
  }else{
    f.className="feedback ng";
    f.textContent="△ まだ一致していません。ヒント：最初のキーワードは「"+a.statement.trim().split(/\s+/)[0]+"」。";
  }
}
function executeAction(idx){
  const a=runtime.lab.actions[idx], prev=JSON.parse(JSON.stringify(runtime.state));
  Object.assign(runtime.state,a.changes);
  runtime.done.add(idx);
  runtime.lastAction=idx;
  runtime.maxFlow=Math.max(runtime.maxFlow,a.flow);
  updateStatus();updateDiff(prev,runtime.state);updateFlow();
  document.getElementById("terminalArea").textContent=a.console;
  document.getElementById("lessonText").textContent=a.lesson;
  document.getElementById("breakdownArea").innerHTML=`
    <div class="mission"><div class="small">SOURCE</div><pre style="white-space:pre-wrap;margin:4px 0 0;font:13px/1.5 ui-monospace,monospace;color:#e9f0f7">${esc(a.statement)}</pre></div>
    <div class="token-table">${a.tokens.map(t=>`<div class="token-row"><div class="token">${esc(t[0])}</div><div class="explain">${esc(t[1])}</div></div>`).join("")}</div>`;
  if(runtime.done.size===runtime.lab.actions.length){
    safeStorage.set(labKey(runtime.lab.id),"true");
  }
  renderControls();
}
function resetRuntime(){
  const lab=runtime.lab;
  runtime=createRuntime(lab);
  document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode==="basic"));
  document.getElementById("terminalArea").textContent="ready> reset\n基本モードからもう一度。";
  document.getElementById("lessonText").textContent="操作すると、コードの意味と業務上の位置づけをここに表示します。";
  document.getElementById("breakdownArea").innerHTML='<div class="muted">まだコードを実行していません。</div>';
  document.getElementById("stateDiff").innerHTML='<div class="muted">まだ状態変更はありません。</div>';
  updateStatus();updateFlow();renderControls();
}
function answerQuiz(i,btn){
  const q=runtime.lab.quiz, result=document.getElementById("quizResult");
  document.querySelectorAll(".quizopt").forEach(x=>x.classList.remove("correct","wrong"));
  if(i===q.answer){
    btn.classList.add("correct"); result.style.color="var(--ok)"; result.textContent="✅ 正解。"+q.why;
  }else{
    btn.classList.add("wrong"); result.style.color="var(--warn)"; result.textContent="惜しい。"+q.why;
  }
}
function route(){
  if(location.hash==="#stage0") renderStage0();
  else {
    const lab=currentLabFromHash();
    if(lab) renderLab(lab); else renderHome();
  }
  window.scrollTo({top:0,behavior:"instant"});
}
window.addEventListener("hashchange",route);
route();
